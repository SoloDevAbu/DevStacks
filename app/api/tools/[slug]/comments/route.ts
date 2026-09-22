import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getToolComments } from "@/db/queries/comments/list"
import { createToolComment } from "@/db/queries/comments/create"
import { getToolBySlug } from "@/db/queries/tools/get"
import { createCommentSchema } from "@/lib/validation/comment"

export const GET = async (
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params
    const tool = await getToolBySlug(slug)

    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const commentList = await getToolComments(tool.id)
    return NextResponse.json({ data: commentList }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}

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
    const body = await req.json()
    const parsed = createCommentSchema.safeParse(body)

    if (!parsed.success) {
      const errorMsg =
        parsed.error.issues[0]?.message ?? "Validation failed"
      return NextResponse.json(
        { error: errorMsg, details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const tool = await getToolBySlug(slug)
    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const comment = await createToolComment(
      tool.id,
      session.user.id,
      parsed.data.body
    )

    return NextResponse.json({ data: comment }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}
