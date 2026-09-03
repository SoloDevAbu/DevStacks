import { db } from "@/db"
import { upvotes, products } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export type UpvoteResult = {
  action: "added" | "removed"
  upvotesCount: number
}

export const toggleUpvote = async (
  productId: string,
  userId: string
): Promise<UpvoteResult> => {
  const [existing] = await db
    .select()
    .from(upvotes)
    .where(and(eq(upvotes.productId, productId), eq(upvotes.userId, userId)))
    .limit(1)

  if (existing) {
    await db
      .delete(upvotes)
      .where(and(eq(upvotes.productId, productId), eq(upvotes.userId, userId)))

    const [updated] = await db
      .update(products)
      .set({ upvotesCount: sql`GREATEST(${products.upvotesCount} - 1, 0)` })
      .where(eq(products.id, productId))
      .returning({ upvotesCount: products.upvotesCount })

    return { action: "removed", upvotesCount: updated?.upvotesCount ?? 0 }
  }

  await db.insert(upvotes).values({ productId, userId })

  const [updated] = await db
    .update(products)
    .set({ upvotesCount: sql`${products.upvotesCount} + 1` })
    .where(eq(products.id, productId))
    .returning({ upvotesCount: products.upvotesCount })

  return { action: "added", upvotesCount: updated?.upvotesCount ?? 0 }
}
