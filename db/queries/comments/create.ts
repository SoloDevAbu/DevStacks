import { db } from "@/db"
import { productComments, products } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

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
