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
  const [existing] = await db
    .select()
    .from(toolUpvotes)
    .where(and(eq(toolUpvotes.toolId, toolId), eq(toolUpvotes.userId, userId)))
    .limit(1)

  if (existing) {
    await db
      .delete(toolUpvotes)
      .where(
        and(eq(toolUpvotes.toolId, toolId), eq(toolUpvotes.userId, userId))
      )

    const [updated] = await db
      .update(tools)
      .set({ upvotesCount: sql`GREATEST(${tools.upvotesCount} - 1, 0)` })
      .where(eq(tools.id, toolId))
      .returning({ upvotesCount: tools.upvotesCount })

    return { action: "removed", upvotesCount: updated?.upvotesCount ?? 0 }
  }

  await db.insert(toolUpvotes).values({ toolId, userId })

  const [updated] = await db
    .update(tools)
    .set({ upvotesCount: sql`${tools.upvotesCount} + 1` })
    .where(eq(tools.id, toolId))
    .returning({ upvotesCount: tools.upvotesCount })

  return { action: "added", upvotesCount: updated?.upvotesCount ?? 0 }
}
