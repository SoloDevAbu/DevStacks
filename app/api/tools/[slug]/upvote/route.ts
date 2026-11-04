import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { revalidateVote } from "@/lib/cache/revalidate"
import { setToolUpvote } from "@/db/queries/tools/set-upvote"
import { getToolIdBySlug } from "@/db/queries/tools/get"

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

    const body = await req.json().catch(() => null)
    if (typeof body?.upvoted !== "boolean") {
      return NextResponse.json(
        { error: "upvoted must be a boolean" },
        { status: 400 }
      )
    }

    const { slug } = await params
    const toolId = await getToolIdBySlug(slug)
    if (!toolId) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const result = await setToolUpvote(toolId, session.user.id, body.upvoted)
    revalidateVote({ toolSlug: slug })
    return NextResponse.json({ data: result }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to save upvote" },
      { status: 500 }
    )
  }
}
