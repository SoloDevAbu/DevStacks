import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth/admin"
import { getAdminSubmissions } from "@/db/queries/admin/submissions"

export const GET = async (req: NextRequest) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator permission required." },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(req.url)
    const statusParam = searchParams.get("status") as
      | "pending"
      | "approved"
      | "rejected"
      | "all"
      | null
    const search = searchParams.get("search") || undefined

    const submissions = await getAdminSubmissions({
      status: statusParam || "all",
      search,
    })

    return NextResponse.json({ data: submissions }, { status: 200 })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch submissions"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

