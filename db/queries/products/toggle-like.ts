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
  return await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(productLikes)
      .where(
        and(
          eq(productLikes.productId, productId),
          eq(productLikes.userId, userId)
        )
      )
      .returning({ id: productLikes.id })

    if (deleted.length > 0) {
      const [updated] = await tx
        .update(products)
        .set({ likesCount: sql`GREATEST(${products.likesCount} - 1, 0)` })
        .where(eq(products.id, productId))
        .returning({ likesCount: products.likesCount })

      return { action: "removed", likesCount: updated?.likesCount ?? 0 }
    }

    const inserted = await tx
      .insert(productLikes)
      .values({ productId, userId })
      .onConflictDoNothing()
      .returning({ id: productLikes.id })

    if (inserted.length > 0) {
      const [updated] = await tx
        .update(products)
        .set({ likesCount: sql`${products.likesCount} + 1` })
        .where(eq(products.id, productId))
        .returning({ likesCount: products.likesCount })

      return { action: "added", likesCount: updated?.likesCount ?? 0 }
    }

    const [current] = await tx
      .select({ likesCount: products.likesCount })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    return { action: "added", likesCount: current?.likesCount ?? 0 }
  })
}
