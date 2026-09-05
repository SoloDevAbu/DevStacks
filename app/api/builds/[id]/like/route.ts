import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { builds } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const POST = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "Invalid build ID" }, { status: 400 })
    }

    const [updated] = await db
      .update(builds)
      .set({
        likesCount: sql`${builds.likesCount} + 1`,
      })
      .where(eq(builds.id, id))
      .returning({ likesCount: builds.likesCount })

    return NextResponse.json({ data: updated }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Failed to like build" },
      { status: 500 }
    )
  }
}
