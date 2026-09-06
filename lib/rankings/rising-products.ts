import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
import { RISING_PRODUCTS_WEIGHTS } from "@/constants/rankings"
import type { RankedProduct, RankingOptions } from "./types"

export const calculateRisingScore = (
  createdAt: Date,
  likesCount: number,
  commentsCount: number,
  viewsCount: number,
  now = new Date()
) => {
  const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
  const ageHours = Math.max(1, ageMs / (1000 * 60 * 60))

  const rawActivity =
    likesCount * RISING_PRODUCTS_WEIGHTS.upvotesWeight +
    commentsCount * RISING_PRODUCTS_WEIGHTS.commentsWeight +
    viewsCount * RISING_PRODUCTS_WEIGHTS.viewsWeight

  const momentumScore =
    Math.round((rawActivity / Math.log2(ageHours + 2)) * 10) / 10

  return momentumScore
}

export const getRisingProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedProduct[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const now = new Date()

  const allApproved = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))

  const scored: RankedProduct[] = allApproved.map((p) => {
    const momentumScore = calculateRisingScore(
      p.createdAt,
      p.likesCount,
      p.commentsCount,
      p.viewsCount,
      now
    )

    return {
      ...p,
      itemKind: "product" as const,
      score: momentumScore,
    }
  })

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}
