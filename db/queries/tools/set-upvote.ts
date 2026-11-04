import { db } from "@/db"
import { toolUpvotes, tools } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"

export type UpvoteResult = {
  upvoted: boolean
  upvotesCount: number
}

// The caller states the wanted result, so a retried request or a stale tab cannot flip the vote.
// The counter only moves when a row actually changed.
export const setToolUpvote = async (
  toolId: string,
  userId: string,
  upvoted: boolean
): Promise<UpvoteResult> =>
  db.transaction(async (tx) => {
    const changed = upvoted
      ? await tx
          .insert(toolUpvotes)
          .values({ toolId, userId })
          .onConflictDoNothing()
          .returning({ id: toolUpvotes.id })
      : await tx
          .delete(toolUpvotes)
          .where(
            and(eq(toolUpvotes.toolId, toolId), eq(toolUpvotes.userId, userId))
          )
          .returning({ id: toolUpvotes.id })

    if (changed.length > 0) {
      const [updated] = await tx
        .update(tools)
        .set({
          upvotesCount: upvoted
            ? sql`${tools.upvotesCount} + 1`
            : sql`GREATEST(${tools.upvotesCount} - 1, 0)`,
        })
        .where(eq(tools.id, toolId))
        .returning({ upvotesCount: tools.upvotesCount })

      return { upvoted, upvotesCount: updated?.upvotesCount ?? 0 }
    }

    const [current] = await tx
      .select({ upvotesCount: tools.upvotesCount })
      .from(tools)
      .where(eq(tools.id, toolId))
      .limit(1)

    return { upvoted, upvotesCount: current?.upvotesCount ?? 0 }
  })
