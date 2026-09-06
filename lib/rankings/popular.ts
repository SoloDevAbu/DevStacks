import { db } from "@/db"
import { tools } from "@/db/schema"
import { eq } from "drizzle-orm"
import { POPULAR_BUILDING_BLOCKS_WEIGHTS } from "@/constants/rankings"
import type { RankedTool, RankingOptions } from "./types"

export const getPopularBuildingBlocks = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedTool[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const allTools = await db
    .select()
    .from(tools)
    .where(eq(tools.status, "approved"))

  const scored: RankedTool[] = allTools.map((t) => {
    const score =
      t.buildsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.buildsWeight +
      t.upvotesCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight +
      t.viewsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight

    return {
      ...t,
      itemKind: "tool" as const,
      score: Math.round(score * 10) / 10,
    }
  })

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}
