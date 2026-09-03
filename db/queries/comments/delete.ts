import { db } from "@/db"
import { comments, products } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export const deleteComment = async (commentId: string, userId: string) => {
  const [deleted] = await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
    .returning({ productId: comments.productId })

  if (!deleted) return null

  // Decrement denormalized counter (floor at 0)
  await db
    .update(products)
    .set({
      commentsCount: sql`GREATEST(${products.commentsCount} - 1, 0)`,
    })
    .where(eq(products.id, deleted.productId))

  return deleted
}
