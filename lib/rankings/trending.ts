import { db } from "@/db"
import { tools, products, categories, productTools } from "@/db/schema"
import { and, eq, ilike, inArray, or } from "drizzle-orm"
import type { TimeframeOption, RankedItem, RankedProduct } from "@/lib/rankings/types"
import type { ProductBuiltWith } from "@/types/entities"

export const getTrending = async (
  limit = 10,
  timeframe: TimeframeOption = "today",
  category?: string
): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))

  const toolConditions = [eq(tools.status, "approved")]
  const productConditions = [eq(products.status, "approved")]

  if (category && category.trim() && category.toLowerCase() !== "all") {
    const trimmed = category.trim()
    const catCondition = or(
      ilike(categories.name, trimmed),
      eq(categories.slug, trimmed.toLowerCase())
    )!
    toolConditions.push(catCondition)
    productConditions.push(catCondition)
  }

  const [allTools, allProducts] = await Promise.all([
    db
      .select({
        id: tools.id,
        slug: tools.slug,
        name: tools.name,
        tagline: tools.tagline,
        tags: tools.tags,
        platforms: tools.platforms,
        upvotesCount: tools.upvotesCount,
        buildsCount: tools.buildsCount,
        commentsCount: tools.commentsCount,
        viewsCount: tools.viewsCount,
        pricing: tools.pricing,
        tier: tools.tier,
        logoUrl: tools.logoUrl,
        websiteUrl: tools.websiteUrl,
        categoryId: tools.categoryId,
        category: categories.name,
        categorySlug: categories.slug,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
      })
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(and(...toolConditions)),
    db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        tagline: products.tagline,
        tags: products.tags,
        platforms: products.platforms,
        likesCount: products.likesCount,
        commentsCount: products.commentsCount,
        viewsCount: products.viewsCount,
        pricing: products.pricing,
        tier: products.tier,
        logoUrl: products.logoUrl,
        websiteUrl: products.websiteUrl,
        categoryId: products.categoryId,
        category: categories.name,
        categorySlug: categories.slug,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...productConditions)),
  ])

  const now = new Date()

  const scoreItem = (
    createdAt: Date,
    activityCount: number,
    viewsCount: number
  ) => {
    const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
    const ageHours = Math.max(1, ageMs / (1000 * 60 * 60))

    if (timeframe === "today") {
      return (
        (activityCount * 4 + viewsCount * 0.1) / Math.pow(ageHours + 1, 0.7)
      )
    } else if (timeframe === "this-week") {
      return (
        (activityCount * 3 + viewsCount * 0.05) / Math.pow(ageHours + 1, 0.4)
      )
    } else if (timeframe === "this-month") {
      return (
        (activityCount * 2 + viewsCount * 0.02) / Math.pow(ageHours + 1, 0.2)
      )
    }
    // All time
    return activityCount * 1.0 + viewsCount * 0.01
  }

  const scored: RankedItem[] = [
    ...allTools.map((t) => ({
      ...t,
      itemKind: "tool" as const,
      score:
        Math.round(scoreItem(t.createdAt, t.upvotesCount, t.viewsCount) * 10) /
        10,
    })),
    ...allProducts.map((p) => ({
      ...p,
      itemKind: "product" as const,
      score:
        Math.round(scoreItem(p.createdAt, p.likesCount, p.viewsCount) * 10) /
        10,
    })),
  ]

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const topItems = scored.slice(0, safeLimit)

  // Attach builtWithTools to top products
  const topProductIds = topItems
    .filter((item): item is RankedProduct => item.itemKind === "product")
    .map((p) => p.id)

  if (topProductIds.length > 0) {
    const ptRows = await db
      .select({
        productId: productTools.productId,
        name: productTools.name,
        toolId: productTools.toolId,
        toolSlug: tools.slug,
      })
      .from(productTools)
      .leftJoin(tools, eq(productTools.toolId, tools.id))
      .where(inArray(productTools.productId, topProductIds))

    const toolsMap = new Map<string, ProductBuiltWith[]>()
    for (const pt of ptRows) {
      const list = toolsMap.get(pt.productId) ?? []
      list.push({
        name: pt.name,
        toolSlug: pt.toolSlug ?? null,
        toolId: pt.toolId ?? null,
      })
      toolsMap.set(pt.productId, list)
    }

    for (const item of topItems) {
      if (item.itemKind === "product") {
        item.builtWithTools = toolsMap.get(item.id) ?? []
      }
    }
  }

  return topItems
}

export const getTrendingProducts = getTrending
