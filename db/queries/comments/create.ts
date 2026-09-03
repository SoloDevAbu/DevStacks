import { db } from "@/db"
import { comments, products } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const createComment = async (
  productId: string,
  userId: string,
  body: string
) => {
  const [comment] = await db
    .insert(comments)
    .values({ productId, userId, body: body.trim() })
    .returning()

  // Update denormalized counter
  await db
    .update(products)
    .set({ commentsCount: sql`${products.commentsCount} + 1` })
    .where(eq(products.id, productId))

  return comment
}
