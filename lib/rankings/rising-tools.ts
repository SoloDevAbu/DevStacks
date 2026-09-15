import { db } from "@/db"
import { tools, categories } from "@/db/schema"
import { desc, eq, sql } from "drizzle-orm"
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

  const momentumScoreSql = sql<number>`
    ROUND(
      (
        (
          ${tools.upvotesCount} * ${RISING_TOOLS_WEIGHTS.upvotesWeight} +
          ${tools.buildsCount} * ${RISING_TOOLS_WEIGHTS.buildsWeight} +
          ${tools.commentsCount} * ${RISING_TOOLS_WEIGHTS.commentsWeight} +
          ${tools.viewsCount} * ${RISING_TOOLS_WEIGHTS.viewsWeight}
        )
        /
        (LN(GREATEST(1.0, EXTRACT(EPOCH FROM (NOW() - ${tools.createdAt})) / 3600.0) + 2.0) / LN(2.0))
      )::numeric,
      1
    )
  `

  const rows = await db
    .select({
      id: tools.id,
      slug: tools.slug,
      name: tools.name,
      tagline: tools.tagline,
      tags: tools.tags,
      platforms: tools.platforms,
      upvotesCount: tools.upvotesCount,
      buildsCount: tools.buildsCount,
      commentsCount: tools.commentsCount,
      viewsCount: tools.viewsCount,
      pricing: tools.pricing,
      tier: tools.tier,
      logoUrl: tools.logoUrl,
      websiteUrl: tools.websiteUrl,
      categoryId: tools.categoryId,
      category: categories.name,
      categorySlug: categories.slug,
      createdAt: tools.createdAt,
      updatedAt: tools.updatedAt,
      score: momentumScoreSql,
    })
    .from(tools)
    .leftJoin(categories, eq(tools.categoryId, categories.id))
    .where(eq(tools.status, "approved"))
    .orderBy(desc(momentumScoreSql), desc(tools.id))
    .limit(safeLimit)
    .offset(offset)

  return rows.map((t) => ({
    ...t,
    itemKind: "tool" as const,
    score: Number(t.score) || 0,
  }))
}

