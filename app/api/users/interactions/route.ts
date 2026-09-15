import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getUserInteractions } from "@/db/queries/users/interactions"

export const GET = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    const sessionUserId = session?.user?.id

    if (!sessionUserId) {
      return NextResponse.json(
        {
          data: {
            upvotedToolIds: [],
            upvotedToolSlugs: [],
            bookmarkedToolIds: [],
            bookmarkedToolSlugs: [],
            likedProductIds: [],
            likedProductSlugs: [],
            bookmarkedProductIds: [],
            bookmarkedProductSlugs: [],
          },
        },
        { status: 200 }
      )
    }

    const interactions = await getUserInteractions(sessionUserId)
    return NextResponse.json({ data: interactions }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch user interactions" },
      { status: 500 }
    )
  }
}
