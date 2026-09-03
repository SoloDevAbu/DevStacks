import { db } from "@/db"
import { bookmarks } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export type BookmarkResult = {
  action: "added" | "removed"
}

export const toggleBookmark = async (
  productId: string,
  userId: string
): Promise<BookmarkResult> => {
  const [existing] = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.productId, productId), eq(bookmarks.userId, userId)))
    .limit(1)

  if (existing) {
    await db
      .delete(bookmarks)
      .where(and(eq(bookmarks.productId, productId), eq(bookmarks.userId, userId)))

    return { action: "removed" }
  }

  await db.insert(bookmarks).values({ productId, userId })
  return { action: "added" }
}
