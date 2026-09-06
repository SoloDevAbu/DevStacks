import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { and, eq, gte } from "drizzle-orm"
import {
  DISCOVERY_WINDOW_DAYS,
  NEW_AND_RISING_WEIGHTS,
} from "@/constants/rankings"
import type { RankedItem, RankingOptions } from "./types"

export const calculateNewAndRisingScore = (
  createdAt: Date,
  activityCount: number,
  commentsCount: number,
  viewsCount: number,
  now = new Date()
) => {
  const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  const ageHours = ageMs / (1000 * 60 * 60)

  const freshnessRatio = Math.max(0, 1 - ageDays / DISCOVERY_WINDOW_DAYS)
  const freshnessScore =
    freshnessRatio * NEW_AND_RISING_WEIGHTS.freshnessMaxScore

  // activityCount = upvotesCount for tools, likesCount for products
  const rawActivity =
    activityCount * NEW_AND_RISING_WEIGHTS.upvotesWeight +
    commentsCount * NEW_AND_RISING_WEIGHTS.commentsWeight +
    viewsCount * NEW_AND_RISING_WEIGHTS.viewsWeight

  const velocity = rawActivity / Math.pow(ageHours + 1, 0.5)
  const score = Math.round((freshnessScore + velocity) * 10) / 10

  const freshnessDaysLeft = Math.max(0, Math.ceil(DISCOVERY_WINDOW_DAYS - ageDays))

  return { score, freshnessDaysLeft }
}

export const getNewAndRisingProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  const now = new Date()
  const windowStartDate = new Date(
    now.getTime() - DISCOVERY_WINDOW_DAYS * 24 * 60 * 60 * 1000
  )

  // Fetch tools and products within the discovery window in parallel
  let [candidateTools, candidateProducts] = await Promise.all([
    db
      .select()
      .from(tools)
      .where(and(eq(tools.status, "approved"), gte(tools.createdAt, windowStartDate))),
    db
      .select()
      .from(products)
      .where(and(eq(products.status, "approved"), gte(products.createdAt, windowStartDate))),
  ])

  // Fallback: if nothing is within the window, use all approved items
  if (candidateTools.length === 0 && candidateProducts.length === 0) {
    ;[candidateTools, candidateProducts] = await Promise.all([
      db.select().from(tools).where(eq(tools.status, "approved")).limit(safeLimit * safePage),
      db.select().from(products).where(eq(products.status, "approved")).limit(safeLimit * safePage),
    ])
  }

  const scored: RankedItem[] = [
    ...candidateTools.map((t) => {
      const { score, freshnessDaysLeft } = calculateNewAndRisingScore(
        t.createdAt,
        t.upvotesCount,
        t.commentsCount,
        t.viewsCount,
        now
      )
      return { ...t, itemKind: "tool" as const, score, freshnessDaysLeft }
    }),
    ...candidateProducts.map((p) => {
      const { score, freshnessDaysLeft } = calculateNewAndRisingScore(
        p.createdAt,
        p.likesCount,
        p.commentsCount,
        p.viewsCount,
        now
      )
      return { ...p, itemKind: "product" as const, score, freshnessDaysLeft }
    }),
  ]

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}
