import { db } from "@/db"
import { tools, categories } from "@/db/schema"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"
import type { DbTool } from "@/types/entities"
import type { Pricing, Tier } from "@/constants/plans"

export type ToolListFilters = {
  q?: string
  category?: string
  tag?: string
  platform?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "upvotes" | "builds" | "recent" | "views"
}

const PRICING_VALUES = ["Free", "Freemium", "Paid", "Open Source"] as const

export const getTools = async ({
  q,
  category,
  tag,
  platform,
  pricing,
  tier,
  page = 1,
  limit = 20,
  sortBy = "upvotes",
}: ToolListFilters = {}): Promise<DbTool[]> => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(5000, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit

  const conditions = [eq(tools.status, "approved")]

  if (q && q.trim()) {
    const pattern = `%${q.trim()}%`
    conditions.push(
      or(
        ilike(tools.name, pattern),
        ilike(tools.tagline, pattern),
        ilike(tools.description, pattern),
        ilike(tools.keywords, pattern),
        ilike(tools.problemStatement, pattern),
        ilike(tools.solution, pattern),
        ilike(tools.targetAudience, pattern),
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
        sql`${tools.categoryId}::text = ${trimmedCat}`
      )!
    )
  }

  if (tag && tag.trim()) {
    conditions.push(sql`${tools.tags} @> ARRAY[${tag.trim()}]::text[]`)
  }

  if (platform && platform.trim()) {
    conditions.push(sql`${tools.platforms} @> ARRAY[${platform.trim()}]::platform[]`)
  }

  if (pricing && pricing.trim() && pricing.toLowerCase() !== "all") {
    const matchedPricing = PRICING_VALUES.find(
      (p) => p.toLowerCase() === pricing.trim().toLowerCase()
    )
    if (matchedPricing) {
      conditions.push(eq(tools.pricing, matchedPricing))
    }
  }

  if (tier && tier.trim() && tier.toLowerCase() !== "all") {
    conditions.push(eq(tools.tier, tier.trim() as Tier))
  }

  const orderMap = {
    upvotes: desc(tools.upvotesCount),
    builds: desc(tools.buildsCount),
    recent: desc(tools.createdAt),
    views: desc(tools.viewsCount),
  }

  const rows = await db
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
    .where(and(...conditions))
    .orderBy(orderMap[sortBy] ?? desc(tools.upvotesCount))
    .limit(safeLimit)
    .offset(offset)

  return rows as unknown as DbTool[]
}

export const getToolsStats = async () => {
  const [row] = await db
    .select({
      totalCount: sql<number>`count(*)::int`,
      totalBuilds: sql<number>`coalesce(sum(${tools.buildsCount}), 0)::int`,
    })
    .from(tools)
    .where(eq(tools.status, "approved"))

  return {
    totalCount: Number(row?.totalCount ?? 0),
    totalBuilds: Number(row?.totalBuilds ?? 0),
  }
}
