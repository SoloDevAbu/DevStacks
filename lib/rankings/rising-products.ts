import { db } from "@/db"
import { products, categories, productTools, tools } from "@/db/schema"
import { desc, eq, inArray, sql } from "drizzle-orm"
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

  const momentumScoreSql = sql<number>`
    ROUND(
      (
        (
          ${products.likesCount} * ${RISING_PRODUCTS_WEIGHTS.upvotesWeight} +
          ${products.commentsCount} * ${RISING_PRODUCTS_WEIGHTS.commentsWeight} +
          ${products.viewsCount} * ${RISING_PRODUCTS_WEIGHTS.viewsWeight}
        )
        /
        (LN(GREATEST(1.0, EXTRACT(EPOCH FROM (NOW() - ${products.createdAt})) / 3600.0) + 2.0) / LN(2.0))
      )::numeric,
      1
    )
  `

  const rows = await db
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
      score: momentumScoreSql,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.status, "approved"))
    .orderBy(desc(momentumScoreSql), desc(products.id))
    .limit(safeLimit)
    .offset(offset)

  const pageItems: RankedProduct[] = rows.map((p) => ({
    ...p,
    itemKind: "product" as const,
    score: Number(p.score) || 0,
  }))

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

