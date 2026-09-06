import { db } from "@/db"
import { toolComments, productComments, tools, products } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const createToolComment = async (
  toolId: string,
  userId: string,
  body: string
) => {
  const [comment] = await db
    .insert(toolComments)
    .values({ toolId, userId, body: body.trim() })
    .returning()

  await db
    .update(tools)
    .set({ commentsCount: sql`${tools.commentsCount} + 1` })
    .where(eq(tools.id, toolId))

  return comment
}

export const createProductComment = async (
  productId: string,
  userId: string,
  body: string
) => {
  const [comment] = await db
    .insert(productComments)
    .values({ productId, userId, body: body.trim() })
    .returning()

  await db
    .update(products)
    .set({ commentsCount: sql`${products.commentsCount} + 1` })
    .where(eq(products.id, productId))

  return comment
}
