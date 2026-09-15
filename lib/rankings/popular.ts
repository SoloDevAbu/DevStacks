import { db } from "@/db"
import { tools } from "@/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { POPULAR_BUILDING_BLOCKS_WEIGHTS } from "@/constants/rankings"
import type { RankedTool, RankingOptions } from "./types"

export const getPopularBuildingBlocks = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedTool[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const scoreSql = sql<number>`
    ROUND(
      (
        ${tools.buildsCount} * ${POPULAR_BUILDING_BLOCKS_WEIGHTS.buildsWeight} +
        ${tools.upvotesCount} * ${POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight} +
        ${tools.viewsCount} * ${POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight}
      )::numeric,
      1
    )
  `

  const rows = await db
    .select({
      id: tools.id,
      slug: tools.slug,
      submitterId: tools.submitterId,
      name: tools.name,
      tagline: tools.tagline,
      description: tools.description,
      problemStatement: tools.problemStatement,
      solution: tools.solution,
      uniqueValue: tools.uniqueValue,
      websiteUrl: tools.websiteUrl,
      logoUrl: tools.logoUrl,
      githubUrl: tools.githubUrl,
      twitterUrl: tools.twitterUrl,
      linkedinUrl: tools.linkedinUrl,
      discordUrl: tools.discordUrl,
      appStoreUrl: tools.appStoreUrl,
      playStoreUrl: tools.playStoreUrl,
      chromeExtensionUrl: tools.chromeExtensionUrl,
      images: tools.images,
      demoVideoUrl: tools.demoVideoUrl,
      useCases: tools.useCases,
      keywords: tools.keywords,
      targetAudience: tools.targetAudience,
      metaTitle: tools.metaTitle,
      metaDescription: tools.metaDescription,
      aiContext: tools.aiContext,
      geoTarget: tools.geoTarget,
      asoCategory: tools.asoCategory,
      categoryId: tools.categoryId,
      tags: tools.tags,
      platforms: tools.platforms,
      pricing: tools.pricing,
      tier: tools.tier,
      status: tools.status,
      upvotesCount: tools.upvotesCount,
      buildsCount: tools.buildsCount,
      commentsCount: tools.commentsCount,
      viewsCount: tools.viewsCount,
      createdAt: tools.createdAt,
      updatedAt: tools.updatedAt,
      score: scoreSql,
    })
    .from(tools)
    .where(eq(tools.status, "approved"))
    .orderBy(desc(scoreSql), desc(tools.id))
    .limit(safeLimit)
    .offset(offset)

  return rows.map((t) => ({
    ...t,
    itemKind: "tool" as const,
    score: Number(t.score) || 0,
  }))
}

