import { db } from "@/db"
import { products } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export const softDeleteProduct = async (slug: string, userId: string) => {
  const [existing] = await db
    .select({ id: products.id })
    .from(products)
    .where(
      and(
        eq(products.slug, slug),
        eq(products.submitterId, userId),
        eq(products.isDeleted, false)
      )
    )
    .limit(1)

  if (!existing) {
    throw new Error("Product not found or you are not authorized to delete it.")
  }

  const [deleted] = await db
    .update(products)
    .set({
      isDeleted: true,
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(products.id, existing.id))
    .returning()

  return deleted
}
