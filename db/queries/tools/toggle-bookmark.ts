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
  return await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(toolBookmarks)
      .where(
        and(eq(toolBookmarks.toolId, toolId), eq(toolBookmarks.userId, userId))
      )
      .returning({ id: toolBookmarks.id })

    if (deleted.length > 0) {
      return { action: "removed" }
    }

    await tx
      .insert(toolBookmarks)
      .values({ toolId, userId })
      .onConflictDoNothing()

    return { action: "added" }
  })
}
