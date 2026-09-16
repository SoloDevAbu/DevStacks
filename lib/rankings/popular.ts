import { db } from "@/db"
import { tools, categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { POPULAR_BUILDING_BLOCKS_WEIGHTS } from "@/constants/rankings"
import type { RankedTool, RankingOptions } from "./types"

export const calculatePopularScore = (
  buildsCount: number,
  upvotesCount: number,
  viewsCount: number
) => {
  const rawScore =
    buildsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.buildsWeight +
    upvotesCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight +
    viewsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight
  return Math.round(rawScore * 10) / 10
}

export const getPopularBuildingBlocks = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedTool[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

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
      category: categories.name,
      categorySlug: categories.slug,
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
    })
    .from(tools)
    .leftJoin(categories, eq(tools.categoryId, categories.id))
    .where(eq(tools.status, "approved"))

  const scored: RankedTool[] = rows.map((t) => ({
    ...t,
    itemKind: "tool" as const,
    score: calculatePopularScore(t.buildsCount, t.upvotesCount, t.viewsCount),
  }))

  scored.sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0)
    if (scoreDiff !== 0) return scoreDiff
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    return bTime - aTime
  })

  return scored.slice(offset, offset + safeLimit)
}
