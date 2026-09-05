import { db } from "@/db"
import { products } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import type { TimeframeOption } from "@/lib/rankings/types"

export const getTrendingProducts = async (
  limit = 10,
  timeframe: TimeframeOption = "today"
) => {
  const safeLimit = Math.min(50, Math.max(1, limit))

  const allApproved = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))

  const now = new Date()

  // Score products based on the selected timeframe
  const scored = allApproved.map((p) => {
    const ageMs = Math.max(0, now.getTime() - p.createdAt.getTime())
    const ageHours = Math.max(1, ageMs / (1000 * 60 * 60))

    let timeScore = p.upvotesCount
    if (timeframe === "today") {
      timeScore = (p.upvotesCount * 4 + p.viewsCount * 0.1) / Math.pow(ageHours + 1, 0.7)
    } else if (timeframe === "this-week") {
      timeScore = (p.upvotesCount * 3 + p.viewsCount * 0.05) / Math.pow(ageHours + 1, 0.4)
    } else if (timeframe === "this-month") {
      timeScore = (p.upvotesCount * 2 + p.viewsCount * 0.02) / Math.pow(ageHours + 1, 0.2)
    } else {
      // All time
      timeScore = p.upvotesCount * 1.0 + p.viewsCount * 0.01
    }

    return {
      ...p,
      score: Math.round(timeScore * 10) / 10,
    }
  })

  scored.sort((a, b) => b.score - a.score)

  return scored.slice(0, safeLimit)
}
