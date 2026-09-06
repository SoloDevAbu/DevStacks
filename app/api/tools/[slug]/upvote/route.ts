import { type NextRequest, NextResponse } from "next/server"
import { toggleToolUpvote } from "@/db/queries/tools/toggle-upvote"
import { getToolBySlug } from "@/db/queries/tools/get"
import { z } from "zod"

const upvoteSchema = z.object({
  userId: z.string().min(1, "User ID required"),
})

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await params
    const body = await req.json()
    const parsed = upvoteSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const tool = await getToolBySlug(slug)
    if (!tool) {
      return NextResponse.json({ error: "Tool not found" }, { status: 404 })
    }

    const result = await toggleToolUpvote(tool.id, parsed.data.userId)
    return NextResponse.json({ data: result }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to toggle upvote" }, { status: 500 })
  }
}
