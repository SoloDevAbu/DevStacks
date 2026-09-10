import { db } from "@/db"
import { products, categories, productTools, tools } from "@/db/schema"
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"
import type { DbProduct, ProductBuiltWith } from "@/types/entities"
import type { Pricing, Tier } from "@/constants/plans"

export type ProductListFilters = {
  q?: string
  category?: string
  tag?: string
  platform?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "likes" | "upvotes" | "recent" | "views"
}

const PRICING_VALUES = ["Free", "Freemium", "Paid", "Open Source"] as const

export const getProducts = async ({
  q,
  category,
  tag,
  platform,
  pricing,
  tier,
  page = 1,
  limit = 20,
  sortBy = "likes",
}: ProductListFilters = {}): Promise<DbProduct[]> => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(5000, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit

  const conditions = [eq(products.status, "approved")]

  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`
    conditions.push(
      or(
        ilike(products.name, pattern),
        ilike(products.tagline, pattern),
        ilike(products.description, pattern),
        ilike(products.keywords, pattern),
        ilike(products.problemStatement, pattern),
        ilike(products.solution, pattern),
        ilike(products.targetAudience, pattern),
        ilike(categories.name, pattern)
      )!
    )
  }

  if (category && category.trim() && category.toLowerCase() !== "all") {
    const trimmedCat = category.trim()
    conditions.push(
      or(
        eq(categories.slug, trimmedCat.toLowerCase()),
        ilike(categories.name, trimmedCat),
        sql`${products.categoryId}::text = ${trimmedCat}`
      )!
    )
  }

  if (tag && tag.trim()) {
    conditions.push(sql`${products.tags} @> ARRAY[${tag.trim()}]::text[]`)
  }

  if (platform && platform.trim()) {
    conditions.push(sql`${products.platforms} @> ARRAY[${platform.trim()}]::platform[]`)
  }

  if (pricing && pricing.trim() && pricing.toLowerCase() !== "all") {
    const matchedPricing = PRICING_VALUES.find(
      (p) => p.toLowerCase() === pricing.trim().toLowerCase()
    )
    if (matchedPricing) {
      conditions.push(eq(products.pricing, matchedPricing))
    }
  }

  if (tier && tier.trim() && tier.toLowerCase() !== "all") {
    conditions.push(eq(products.tier, tier.trim() as Tier))
  }

  const orderMap = {
    likes: desc(products.likesCount),
    upvotes: desc(products.likesCount),
    recent: desc(products.createdAt),
    views: desc(products.viewsCount),
  }

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      description: products.description,
      problemStatement: products.problemStatement,
      solution: products.solution,
      uniqueValue: products.uniqueValue,
      websiteUrl: products.websiteUrl,
      logoUrl: products.logoUrl,
      githubUrl: products.githubUrl,
      twitterUrl: products.twitterUrl,
      linkedinUrl: products.linkedinUrl,
      discordUrl: products.discordUrl,
      keywords: products.keywords,
      targetAudience: products.targetAudience,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      aiContext: products.aiContext,
      geoTarget: products.geoTarget,
      asoCategory: products.asoCategory,
      tags: products.tags,
      platforms: products.platforms,
      pricing: products.pricing,
      tier: products.tier,
      status: products.status,
      likesCount: products.likesCount,
      commentsCount: products.commentsCount,
      viewsCount: products.viewsCount,
      categoryId: products.categoryId,
      category: categories.name,
      categorySlug: categories.slug,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(...conditions))
    .orderBy(orderMap[sortBy] ?? desc(products.likesCount))
    .limit(safeLimit)
    .offset(offset)

  const productIds = rows.map((r) => r.id)
  const toolsMap = new Map<string, ProductBuiltWith[]>()

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

    for (const pt of ptRows) {
      const list = toolsMap.get(pt.productId) ?? []
      list.push({
        name: pt.name,
        toolSlug: pt.toolSlug ?? null,
        toolId: pt.toolId ?? null,
      })
      toolsMap.set(pt.productId, list)
    }
  }

  return rows.map((row) => ({
    ...row,
    builtWithTools: toolsMap.get(row.id) ?? [],
  })) as unknown as DbProduct[]
}

export const getProductsStats = async () => {
  const [row] = await db
    .select({
      totalCount: sql<number>`count(*)::int`,
      totalLikes: sql<number>`coalesce(sum(${products.likesCount}), 0)::int`,
    })
    .from(products)
    .where(eq(products.status, "approved"))

  return {
    totalCount: Number(row?.totalCount ?? 0),
    totalLikes: Number(row?.totalLikes ?? 0),
  }
}
