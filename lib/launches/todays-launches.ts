import { db } from "@/db"
import { tools, products, categories, productTools } from "@/db/schema"
import { desc, eq, gte, lte, and, inArray } from "drizzle-orm"
import type { RankedItem, RankedProduct } from "@/lib/rankings/types"
import type { ProductBuiltWith } from "@/types/entities"

const attachBuiltWithTools = async (items: RankedItem[]): Promise<void> => {
  const productIds = items
    .filter((item): item is RankedProduct => item.itemKind === "product")
    .map((p) => p.id)

  if (productIds.length === 0) return

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
    list.push({ name: pt.name, toolSlug: pt.toolSlug ?? null, toolId: pt.toolId ?? null })
    toolsMap.set(pt.productId, list)
  }

  for (const item of items) {
    if (item.itemKind === "product") {
      item.builtWithTools = toolsMap.get(item.id) ?? []
    }
  }
}

export const getTodaysLaunches = async ({ limit = 10 }: { limit?: number } = {}): Promise<RankedItem[]> => {
  const now = new Date()
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0))
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999))

  const [todayTools, todayProducts] = await Promise.all([
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
      .where(
        and(
          eq(tools.status, "approved"),
          gte(tools.createdAt, startOfDay),
          lte(tools.createdAt, endOfDay)
        )
      )
      .orderBy(desc(tools.upvotesCount)),
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
      .where(
        and(
          eq(products.status, "approved"),
          gte(products.createdAt, startOfDay),
          lte(products.createdAt, endOfDay)
        )
      )
      .orderBy(desc(products.likesCount)),
  ])

  const combined: RankedItem[] = [
    ...todayTools.map((t) => ({ ...t, itemKind: "tool" as const })),
    ...todayProducts.map((p) => ({ ...p, itemKind: "product" as const })),
  ].sort((a, b) => {
    const aScore = a.itemKind === "tool" ? a.upvotesCount : a.likesCount
    const bScore = b.itemKind === "tool" ? b.upvotesCount : b.likesCount
    const scoreDiff = bScore - aScore
    if (scoreDiff !== 0) return scoreDiff
    return b.commentsCount - a.commentsCount
  })

  const pageItems = combined.slice(0, limit)
  await attachBuiltWithTools(pageItems)

  return pageItems
}
