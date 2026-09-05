import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { POPULAR_BUILDING_BLOCKS_WEIGHTS } from "@/constants/rankings"
import type { RankedProduct, RankingOptions } from "./types"

export const getPopularBuildingBlocks = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedProduct[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const allApproved = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))

  const scored: RankedProduct[] = allApproved.map((p) => {
    const score =
      p.buildsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.buildsWeight +
      p.upvotesCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.upvotesWeight +
      p.viewsCount * POPULAR_BUILDING_BLOCKS_WEIGHTS.viewsWeight

    return {
      ...p,
      score: Math.round(score * 10) / 10,
    }
  })

  // Sort primarily by computed ecosystem score (heavily weighted on buildsCount)
  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}
