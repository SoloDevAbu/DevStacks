import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { and, desc, eq, ilike } from "drizzle-orm"
import type { TimeframeOption } from "@/lib/rankings/types"
import type { RankedItem } from "@/lib/rankings/types"

export const getTrendingProducts = async (
  limit = 10,
  timeframe: TimeframeOption = "today",
  category?: string
): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))

  const toolConditions = [eq(tools.status, "approved")]
  const productConditions = [eq(products.status, "approved")]

  if (category && category.trim() && category.toLowerCase() !== "all") {
    toolConditions.push(ilike(tools.category, category.trim()))
    productConditions.push(ilike(products.category, category.trim()))
  }

  const [allTools, allProducts] = await Promise.all([
    db
      .select()
      .from(tools)
      .where(and(...toolConditions)),
    db
      .select()
      .from(products)
      .where(and(...productConditions)),
  ])

  const now = new Date()

  const scoreItem = (
    createdAt: Date,
    activityCount: number, // upvotesCount for tools, likesCount for products
    viewsCount: number
  ) => {
    const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
    const ageHours = Math.max(1, ageMs / (1000 * 60 * 60))

    if (timeframe === "today") {
      return (activityCount * 4 + viewsCount * 0.1) / Math.pow(ageHours + 1, 0.7)
    } else if (timeframe === "this-week") {
      return (activityCount * 3 + viewsCount * 0.05) / Math.pow(ageHours + 1, 0.4)
    } else if (timeframe === "this-month") {
      return (activityCount * 2 + viewsCount * 0.02) / Math.pow(ageHours + 1, 0.2)
    }
    // All time
    return activityCount * 1.0 + viewsCount * 0.01
  }

  const scored: RankedItem[] = [
    ...allTools.map((t) => ({
      ...t,
      itemKind: "tool" as const,
      score: Math.round(scoreItem(t.createdAt, t.upvotesCount, t.viewsCount) * 10) / 10,
    })),
    ...allProducts.map((p) => ({
      ...p,
      itemKind: "product" as const,
      score: Math.round(scoreItem(p.createdAt, p.likesCount, p.viewsCount) * 10) / 10,
    })),
  ]

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(0, safeLimit)
}
