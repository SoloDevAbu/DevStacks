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
  const [existing] = await db
    .select()
    .from(productBookmarks)
    .where(and(eq(productBookmarks.productId, productId), eq(productBookmarks.userId, userId)))
    .limit(1)

  if (existing) {
    await db
      .delete(productBookmarks)
      .where(and(eq(productBookmarks.productId, productId), eq(productBookmarks.userId, userId)))
    return { action: "removed" }
  }

  await db.insert(productBookmarks).values({ productId, userId })
  return { action: "added" }
}
