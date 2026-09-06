import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { getBuilds } from "@/db/queries/builds/list"
import { POPULAR_BUILDING_BLOCKS_WEIGHTS } from "@/constants/rankings"
import type { RankingOptions } from "./types"

export const getPopularBuildingBlocks = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}) => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const [allApproved, allBuilds] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.status, "approved")),
    getBuilds({
      limit: 50,
      sortBy: "likes",
    }),
  ])

  const scoredProducts = allApproved.map((p) => {
    const score =
      p.buildsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.buildsWeight +
      p.upvotesCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight +
      p.viewsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight

    return {
      ...p,
      itemType: "product" as const,
      score: Math.round(score * 10) / 10,
    }
  })

  const scoredBuilds = allBuilds.map((b) => {
    const score =
      b.likesCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight * 2 +
      b.viewsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight

    return {
      ...b,
      itemType: "build" as const,
      score: Math.round(score * 10) / 10,
    }
  })

  const combined = [...scoredProducts, ...scoredBuilds]
  combined.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return combined.slice(offset, offset + safeLimit)
}
