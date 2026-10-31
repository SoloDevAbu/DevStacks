import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserAvailableListingCredit } from "@/db/queries/users/get-user-credits"

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const credit = await getUserAvailableListingCredit(session.user.id)
    return NextResponse.json({ data: credit }, { status: 200 })
  } catch (error) {
    console.error("Failed to fetch user credits:", error)
    return NextResponse.json(
      { error: "Failed to fetch user listing credits" },
      { status: 500 }
    )
  }
}

