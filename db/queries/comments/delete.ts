import { db } from "@/db"
import { toolComments, productComments, tools, products } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export const deleteToolComment = async (commentId: string, userId: string) => {
  const [deleted] = await db
    .delete(toolComments)
    .where(and(eq(toolComments.id, commentId), eq(toolComments.userId, userId)))
    .returning({ toolId: toolComments.toolId })

  if (!deleted) return null

  await db
    .update(tools)
    .set({ commentsCount: sql`GREATEST(${tools.commentsCount} - 1, 0)` })
    .where(eq(tools.id, deleted.toolId))

  return deleted
}

export const deleteProductComment = async (commentId: string, userId: string) => {
  const [deleted] = await db
    .delete(productComments)
    .where(and(eq(productComments.id, commentId), eq(productComments.userId, userId)))
    .returning({ productId: productComments.productId })

  if (!deleted) return null

  await db
    .update(products)
    .set({ commentsCount: sql`GREATEST(${products.commentsCount} - 1, 0)` })
    .where(eq(products.id, deleted.productId))

  return deleted
}
