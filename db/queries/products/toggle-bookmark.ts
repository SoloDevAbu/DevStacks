import { db } from "@/db"
import { productBookmarks } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export type BookmarkResult = {
  action: "added" | "removed"
}

export const toggleProductBookmark = async (
  productId: string,
  userId: string
): Promise<BookmarkResult> => {
  return await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(productBookmarks)
      .where(
        and(
          eq(productBookmarks.productId, productId),
          eq(productBookmarks.userId, userId)
        )
      )
      .returning({ id: productBookmarks.id })

    if (deleted.length > 0) {
      return { action: "removed" }
    }

    await tx
      .insert(productBookmarks)
      .values({ productId, userId })
      .onConflictDoNothing()

    return { action: "added" }
  })
}
