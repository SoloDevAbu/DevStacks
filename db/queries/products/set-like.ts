import { db } from "@/db"
import { productLikes, products } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export type LikeResult = {
  liked: boolean
  likesCount: number
}

// The caller states the wanted result, so a retried request or a stale tab cannot flip the vote.
// The counter only moves when a row actually changed.
export const setProductLike = async (
  productId: string,
  userId: string,
  liked: boolean
): Promise<LikeResult> =>
  db.transaction(async (tx) => {
    const changed = liked
      ? await tx
          .insert(productLikes)
          .values({ productId, userId })
          .onConflictDoNothing()
          .returning({ id: productLikes.id })
      : await tx
          .delete(productLikes)
          .where(
            and(
              eq(productLikes.productId, productId),
              eq(productLikes.userId, userId)
            )
          )
          .returning({ id: productLikes.id })

    if (changed.length > 0) {
      const [updated] = await tx
        .update(products)
        .set({
          likesCount: liked
            ? sql`${products.likesCount} + 1`
            : sql`GREATEST(${products.likesCount} - 1, 0)`,
        })
        .where(eq(products.id, productId))
        .returning({ likesCount: products.likesCount })

      return { liked, likesCount: updated?.likesCount ?? 0 }
    }

    const [current] = await tx
      .select({ likesCount: products.likesCount })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1)

    return { liked, likesCount: current?.likesCount ?? 0 }
  })
