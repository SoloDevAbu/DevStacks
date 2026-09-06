import { db } from "@/db"
import { products } from "@/db/schema"
import { and, desc, eq, ilike, or } from "drizzle-orm"

export type ProductListFilters = {
  q?: string
  category?: string
  tag?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "likes" | "recent" | "views"
}

export const getProducts = async ({
  q,
  category,
  tag,
  pricing,
  tier,
  page = 1,
  limit = 20,
  sortBy = "likes",
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
    conditions.push(eq(products.pricing, pricing as "Free" | "Freemium" | "Paid" | "Open Source"))
  if (tier)
    conditions.push(eq(products.tier, tier as "free" | "premium" | "premium+"))

  const orderMap = {
    likes: desc(products.likesCount),
    recent: desc(products.createdAt),
    views: desc(products.viewsCount),
  }

  const rows = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderMap[sortBy] ?? desc(products.likesCount))
    .limit(safeLimit)
    .offset(offset)

  const filtered = tag ? rows.filter((p) => p.tags.includes(tag)) : rows
  return filtered
}
