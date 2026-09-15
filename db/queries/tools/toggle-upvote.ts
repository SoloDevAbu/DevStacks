import { db } from "@/db"
import { toolUpvotes, tools } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export type UpvoteResult = {
  action: "added" | "removed"
  upvotesCount: number
}

export const toggleToolUpvote = async (
  toolId: string,
  userId: string
): Promise<UpvoteResult> => {
  return await db.transaction(async (tx) => {
    const deleted = await tx
      .delete(toolUpvotes)
      .where(
        and(eq(toolUpvotes.toolId, toolId), eq(toolUpvotes.userId, userId))
      )
      .returning({ id: toolUpvotes.id })

    if (deleted.length > 0) {
      const [updated] = await tx
        .update(tools)
        .set({ upvotesCount: sql`GREATEST(${tools.upvotesCount} - 1, 0)` })
        .where(eq(tools.id, toolId))
        .returning({ upvotesCount: tools.upvotesCount })

      return { action: "removed", upvotesCount: updated?.upvotesCount ?? 0 }
    }

    const inserted = await tx
      .insert(toolUpvotes)
      .values({ toolId, userId })
      .onConflictDoNothing()
      .returning({ id: toolUpvotes.id })

    if (inserted.length > 0) {
      const [updated] = await tx
        .update(tools)
        .set({ upvotesCount: sql`${tools.upvotesCount} + 1` })
        .where(eq(tools.id, toolId))
        .returning({ upvotesCount: tools.upvotesCount })

      return { action: "added", upvotesCount: updated?.upvotesCount ?? 0 }
    }

    const [current] = await tx
      .select({ upvotesCount: tools.upvotesCount })
      .from(tools)
      .where(eq(tools.id, toolId))
      .limit(1)

    return { action: "added", upvotesCount: current?.upvotesCount ?? 0 }
  })
}
