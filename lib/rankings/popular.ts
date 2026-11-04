import { db } from "@/db"
import { tools, categories } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import {
  calculatePopularScore,
  compareByPopularScore,
} from "@/lib/rankings/compare"
import { unstable_cache } from "next/cache"
import { CACHE_TAGS, CACHE_REVALIDATE_SECONDS } from "@/constants/cache"
import type { RankedTool, RankingOptions } from "./types"
import { launchedByNow } from "@/lib/catalog/visibility"

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
    .where(
      and(
        eq(tools.status, "approved"),
        launchedByNow(tools),
        eq(tools.isDeleted, false)
      )
    )

  const scored: RankedTool[] = rows.map((t) => ({
    ...t,
    itemKind: "tool" as const,
    score: calculatePopularScore(t.buildsCount, t.upvotesCount, t.viewsCount),
  }))

  scored.sort(compareByPopularScore)

  return scored.slice(offset, offset + safeLimit)
}

export const getCachedPopularBuildingBlocks = unstable_cache(
  async (limit: number = 10) => getPopularBuildingBlocks({ limit }),
  [CACHE_TAGS.POPULAR_BUILDING_BLOCKS],
  { revalidate: CACHE_REVALIDATE_SECONDS.LISTS, tags: [CACHE_TAGS.POPULAR_BUILDING_BLOCKS] }
)
