import { db } from "@/db"
import { products, upvotes, bookmarks } from "@/db/schema"
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm"

export type ProductListFilters = {
  q?: string
  category?: string
  tag?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "upvotes" | "builds" | "recent" | "views"
}

export const getProducts = async ({
  q,
  category,
  tag,
  pricing,
  tier,
  page = 1,
  limit = 20,
  sortBy = "upvotes",
}: ProductListFilters = {}) => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(50, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit

  const conditions = [eq(products.status, "approved")]

  if (q) {
    conditions.push(
      or(
        ilike(products.name, `%${q}%`),
        ilike(products.tagline, `%${q}%`),
        ilike(products.description, `%${q}%`)
      )!
    )
  }
  if (category) conditions.push(ilike(products.category, category))
  if (pricing)
    conditions.push(
      eq(products.pricing, pricing as "Free" | "Freemium" | "Paid" | "Open Source")
    )
  if (tier)
    conditions.push(
      eq(products.tier, tier as "free" | "premium" | "premium+")
    )

  const orderMap = {
    upvotes: desc(products.upvotesCount),
    builds: desc(products.buildsCount),
    recent: desc(products.createdAt),
    views: desc(products.viewsCount),
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderMap[sortBy])
    .limit(safeLimit)
    .offset(offset)

  // If tag filter, apply in-memory (tags is an array column)
  const filtered = tag
    ? rows.filter((p) => p.tags.includes(tag))
    : rows

  return filtered
}
