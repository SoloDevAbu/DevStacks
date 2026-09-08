import { db } from "@/db"
import { productLikes, products } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export type LikeResult = {
  action: "added" | "removed"
  likesCount: number
}

export const toggleProductLike = async (
  productId: string,
  userId: string
): Promise<LikeResult> => {
  const [existing] = await db
    .select()
    .from(productLikes)
    .where(
      and(
        eq(productLikes.productId, productId),
        eq(productLikes.userId, userId)
      )
    )
    .limit(1)

  if (existing) {
    await db
      .delete(productLikes)
      .where(
        and(
          eq(productLikes.productId, productId),
          eq(productLikes.userId, userId)
        )
      )

    const [updated] = await db
      .update(products)
      .set({ likesCount: sql`GREATEST(${products.likesCount} - 1, 0)` })
      .where(eq(products.id, productId))
      .returning({ likesCount: products.likesCount })

    return { action: "removed", likesCount: updated?.likesCount ?? 0 }
  }

  await db.insert(productLikes).values({ productId, userId })

  const [updated] = await db
    .update(products)
    .set({ likesCount: sql`${products.likesCount} + 1` })
    .where(eq(products.id, productId))
    .returning({ likesCount: products.likesCount })

  return { action: "added", likesCount: updated?.likesCount ?? 0 }
}
