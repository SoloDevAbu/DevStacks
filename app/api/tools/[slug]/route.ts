import { type NextRequest, NextResponse } from "next/server"
import { getToolBySlug } from "@/db/queries/tools/get"
import { db } from "@/db"
import { tools } from "@/db/schema"
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
