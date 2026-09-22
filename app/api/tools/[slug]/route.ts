import { type NextRequest, NextResponse } from "next/server"
import { getToolBySlug } from "@/db/queries/tools/get"
import { db } from "@/db"
import { tools } from "@/db/schema"
import { auth } from "@/lib/auth"
import { updateTool } from "@/db/queries/tools/update"
import { submitToolSchema } from "@/lib/validation/tool"
import { eq, sql } from "drizzle-orm"

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

    // Increment view count (fire-and-forget)
    db.update(tools)
      .set({ viewsCount: sql`${tools.viewsCount} + 1` })
      .where(eq(tools.slug, slug))
      .catch(() => {})

    return NextResponse.json({ data: tool }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to fetch tool" }, { status: 500 })
  }
}

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to edit this tool." },
        { status: 401 }
      )
    }

    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: "Missing tool slug" }, { status: 400 })
    }

    const body = await req.json()
    const updateSchema = submitToolSchema.partial()

    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const updated = await updateTool(slug, session.user.id, parsed.data)
    return NextResponse.json({ data: updated }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update tool"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
