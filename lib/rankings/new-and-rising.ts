import { db } from "@/db"
import { tools, products, categories, productTools } from "@/db/schema"
import { eq, inArray } from "drizzle-orm"
import {
  DISCOVERY_WINDOW_DAYS,
  NEW_AND_RISING_WEIGHTS,
} from "@/constants/rankings"
import type { RankedItem, RankingOptions, RankedProduct } from "./types"
import type { ProductBuiltWith } from "@/types/entities"

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

  const rawActivity =
    activityCount * NEW_AND_RISING_WEIGHTS.upvotesWeight +
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
}: RankingOptions = {}): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

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
      .where(eq(tools.status, "approved")),
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
      .where(eq(products.status, "approved")),
  ])

  const now = new Date()
  const windowStartDate = new Date(
    now.getTime() - DISCOVERY_WINDOW_DAYS * 24 * 60 * 60 * 1000
  )

  let candidateTools = allTools.filter(
    (t) => t.createdAt && new Date(t.createdAt) >= windowStartDate
  )
  let candidateProducts = allProducts.filter(
    (p) => p.createdAt && new Date(p.createdAt) >= windowStartDate
  )

  if (candidateTools.length === 0 && candidateProducts.length === 0) {
    candidateTools = allTools
    candidateProducts = allProducts
  }

  const scored: RankedItem[] = [
    ...candidateTools.map((t) => {
      const { score, freshnessDaysLeft } = calculateNewAndRisingScore(
        t.createdAt ? new Date(t.createdAt) : new Date(),
        t.upvotesCount,
        t.commentsCount,
        t.viewsCount,
        now
      )
      return {
        ...t,
        itemKind: "tool" as const,
        score,
        freshnessDaysLeft,
      }
    }),
    ...candidateProducts.map((p) => {
      const { score, freshnessDaysLeft } = calculateNewAndRisingScore(
        p.createdAt ? new Date(p.createdAt) : new Date(),
        p.likesCount,
        p.commentsCount,
        p.viewsCount,
        now
      )
      return {
        ...p,
        itemKind: "product" as const,
        score,
        freshnessDaysLeft,
      }
    }),
  ]

  scored.sort((a, b) => {
    const scoreDiff = (b.score ?? 0) - (a.score ?? 0)
    if (scoreDiff !== 0) return scoreDiff
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
    return bTime - aTime
  })

  const pageItems = scored.slice(offset, offset + safeLimit)

  const productIds = pageItems
    .filter((item): item is RankedProduct => item.itemKind === "product")
    .map((p) => p.id)

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
      if (item.itemKind === "product") {
        item.builtWithTools = toolsMap.get(item.id) ?? []
      }
    }
  }

  return pageItems
}
