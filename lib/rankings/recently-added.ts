import { db } from "@/db"
import { tools, products, categories, productTools } from "@/db/schema"
import { desc, eq, inArray } from "drizzle-orm"
import type { RankedItem, RankingOptions, RankedProduct } from "./types"
import type { ProductBuiltWith } from "@/types/entities"

export const getRecentlyAddedProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit
  const fetchCount = safeLimit * safePage

  const [recentTools, recentProducts] = await Promise.all([
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
      .where(eq(tools.status, "approved"))
      .orderBy(desc(tools.createdAt))
      .limit(fetchCount),
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
      .where(eq(products.status, "approved"))
      .orderBy(desc(products.createdAt))
      .limit(fetchCount),
  ])

  const combined: RankedItem[] = [
    ...recentTools.map((t) => ({ ...t, itemKind: "tool" as const })),
    ...recentProducts.map((p) => ({ ...p, itemKind: "product" as const })),
  ].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const pageItems = combined.slice(offset, offset + safeLimit)

  // Attach builtWithTools
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
