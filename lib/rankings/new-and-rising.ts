import { db } from "@/db"
import { products } from "@/db/schema"
import { and, eq, gte } from "drizzle-orm"
import {
  DISCOVERY_WINDOW_DAYS,
  NEW_AND_RISING_WEIGHTS,
} from "@/constants/rankings"
import type { RankedProduct, RankingOptions } from "./types"

export const calculateNewAndRisingScore = (
  createdAt: Date,
  upvotesCount: number,
  buildsCount: number,
  commentsCount: number,
  viewsCount: number,
  now = new Date()
) => {
  const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  const ageHours = ageMs / (1000 * 60 * 60)

  const freshnessRatio = Math.max(
    0,
    1 - ageDays / DISCOVERY_WINDOW_DAYS
  )
  const freshnessScore =
    freshnessRatio * NEW_AND_RISING_WEIGHTS.freshnessMaxScore

  const rawActivity =
    upvotesCount * NEW_AND_RISING_WEIGHTS.upvotesWeight +
    buildsCount * NEW_AND_RISING_WEIGHTS.buildsWeight +
    commentsCount * NEW_AND_RISING_WEIGHTS.commentsWeight +
    viewsCount * NEW_AND_RISING_WEIGHTS.viewsWeight

  const velocity = rawActivity / Math.pow(ageHours + 1, 0.5)
  const score = Math.round((freshnessScore + velocity) * 10) / 10

  const freshnessDaysLeft = Math.max(
    0,
    Math.ceil(DISCOVERY_WINDOW_DAYS - ageDays)
  )

  return { score, freshnessDaysLeft }
}

export const getNewAndRisingProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedProduct[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const now = new Date()
  const windowStartDate = new Date(
    now.getTime() - DISCOVERY_WINDOW_DAYS * 24 * 60 * 60 * 1000
  )

  // 1. Primary: query approved products submitted within the 7-day discovery window
  let candidateProducts = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.status, "approved"),
        gte(products.createdAt, windowStartDate)
      )
    )

  // Fallback if no products in database are under 7 days old
  if (candidateProducts.length === 0) {
    candidateProducts = await db
      .select()
      .from(products)
      .where(eq(products.status, "approved"))
      .limit(safeLimit * safePage)
  }

  const scored: RankedProduct[] = candidateProducts.map((p) => {
    const { score, freshnessDaysLeft } = calculateNewAndRisingScore(
      p.createdAt,
      p.upvotesCount,
      p.buildsCount,
      p.commentsCount,
      p.viewsCount,
      now
    )
    return {
      ...p,
      score,
      freshnessDaysLeft,
    }
  })

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}
