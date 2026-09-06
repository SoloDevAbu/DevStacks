import { db } from "@/db"
import { tools } from "@/db/schema"
import { eq } from "drizzle-orm"
import { RISING_TOOLS_WEIGHTS } from "@/constants/rankings"
import type { RankedTool, RankingOptions } from "./types"

export const calculateRisingToolScore = (
  createdAt: Date,
  upvotesCount: number,
  buildsCount: number,
  commentsCount: number,
  viewsCount: number,
  now = new Date()
) => {
  const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
  const ageHours = Math.max(1, ageMs / (1000 * 60 * 60))

  const rawActivity =
    upvotesCount * RISING_TOOLS_WEIGHTS.upvotesWeight +
    buildsCount * RISING_TOOLS_WEIGHTS.buildsWeight +
    commentsCount * RISING_TOOLS_WEIGHTS.commentsWeight +
    viewsCount * RISING_TOOLS_WEIGHTS.viewsWeight

  const momentumScore =
    Math.round((rawActivity / Math.log2(ageHours + 2)) * 10) / 10

  return momentumScore
}

export const getRisingTools = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedTool[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const now = new Date()

  const allApproved = await db
    .select()
    .from(tools)
    .where(eq(tools.status, "approved"))

  const scored: RankedTool[] = allApproved.map((t) => {
    const momentumScore = calculateRisingToolScore(
      t.createdAt,
      t.upvotesCount,
      t.buildsCount,
      t.commentsCount,
      t.viewsCount,
      now
    )

    return {
      ...t,
      itemKind: "tool" as const,
      score: momentumScore,
    }
  })

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}
