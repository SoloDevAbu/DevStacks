import { db } from "@/db"
import { products, categories, productTools, tools } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import { RISING_PRODUCTS_WEIGHTS } from "@/constants/rankings"
import type { RankedProduct, RankingOptions } from "./types"
import type { ProductBuiltWith } from "@/types/entities"

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
  const pageItems = scored.slice(offset, offset + safeLimit)

  // Attach builtWithTools
  const productIds = pageItems.map((p) => p.id)
  if (productIds.length > 0) {
    const ptRows = await db
      .select({
        productId: productTools.productId,
        name: productTools.name,
        toolId: productTools.toolId,
        toolSlug: tools.slug,
      })
      .from(productTools)
      .leftJoin(tools, eq(productTools.toolId, tools.id))
      .where(inArray(productTools.productId, productIds))

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

    for (const item of pageItems) {
      item.builtWithTools = toolsMap.get(item.id) ?? []
    }
  }

  return pageItems
}
