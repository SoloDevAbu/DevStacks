import { db } from "@/db"
import { tools } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export const softDeleteTool = async (slug: string, userId: string) => {
  const [existing] = await db
    .select({ id: tools.id })
    .from(tools)
    .where(
      and(
        eq(tools.slug, slug),
        eq(tools.submitterId, userId),
        eq(tools.isDeleted, false)
      )
    )
    .limit(1)

  if (!existing) {
    throw new Error("Tool not found or you are not authorized to delete it.")
  }

  const [deleted] = await db
    .update(tools)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(tools.id, existing.id))
    .returning()

  return deleted
}
