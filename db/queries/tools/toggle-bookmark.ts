import { db } from "@/db"
import { toolBookmarks } from "@/db/schema"
import { and, eq } from "drizzle-orm"

export type BookmarkResult = {
  action: "added" | "removed"
}

export const toggleToolBookmark = async (
  toolId: string,
  userId: string
): Promise<BookmarkResult> => {
  const [existing] = await db
    .select()
    .from(toolBookmarks)
    .where(and(eq(toolBookmarks.toolId, toolId), eq(toolBookmarks.userId, userId)))
    .limit(1)

  if (existing) {
    await db
      .delete(toolBookmarks)
      .where(and(eq(toolBookmarks.toolId, toolId), eq(toolBookmarks.userId, userId)))
    return { action: "removed" }
  }

  await db.insert(toolBookmarks).values({ toolId, userId })
  return { action: "added" }
}
