import { type NextRequest, NextResponse, after } from "next/server"
import { getToolBySlug } from "@/db/queries/tools/get"
import { db } from "@/db"
import { tools } from "@/db/schema"
import { auth } from "@/lib/auth"
import { submitToolEdit } from "@/lib/listings/submit-edit"
import { softDeleteTool } from "@/db/queries/tools/delete"
import { updateToolSchema } from "@/lib/validation/tool"
import { eq, sql } from "drizzle-orm"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { pingListingChange } from "@/lib/seo/listing-indexnow"

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

    const parsed = updateToolSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 422 }
      )
    }

    const result = await submitToolEdit(slug, session.user.id, parsed.data)
    if (result.queued) {
      return NextResponse.json(
        { data: result.item, revisionPending: true },
        { status: 202 }
      )
    }

    revalidateCatalog({ toolSlug: slug })
    after(() => pingListingChange("tool", result.item))
    return NextResponse.json({ data: result.item }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update tool"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const DELETE = async (
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to delete this tool." },
        { status: 401 }
      )
    }

    const { slug } = await params
    if (!slug) {
      return NextResponse.json({ error: "Missing tool slug" }, { status: 400 })
    }

    const deleted = await softDeleteTool(slug, session.user.id)
    revalidateCatalog({ toolSlug: slug })
    after(() => pingListingChange("tool", deleted))
    return NextResponse.json({ data: deleted }, { status: 200 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete tool"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
