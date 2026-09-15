import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { toggleToolUpvote } from "@/db/queries/tools/toggle-upvote"
import { getToolBySlug } from "@/db/queries/tools/get"

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = await params
    const tool = await getToolBySlug(slug)
    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const result = await toggleToolUpvote(tool.id, session.user.id)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to toggle upvote" },
      { status: 500 }
    )
  }
}

