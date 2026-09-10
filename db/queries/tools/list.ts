import { db } from "@/db"
import { tools } from "@/db/schema"
import { and, desc, eq, ilike, or, sql } from "drizzle-orm"

export type ToolListFilters = {
  q?: string
  category?: string
  tag?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "upvotes" | "builds" | "recent" | "views"
}

export const getTools = async ({
  q,
  category,
  tag,
  pricing,
  tier,
  page = 1,
  limit = 20,
  sortBy = "upvotes",
}: ToolListFilters = {}) => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(5000, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit

  const conditions = [eq(tools.status, "approved")]

  if (q) {
    conditions.push(
      or(
        ilike(tools.name, `%${q}%`),
        ilike(tools.tagline, `%${q}%`),
        ilike(tools.description, `%${q}%`),
        ilike(tools.keywords, `%${q}%`),
        ilike(tools.problemStatement, `%${q}%`),
        ilike(tools.solution, `%${q}%`),
        ilike(tools.targetAudience, `%${q}%`),
        ilike(tools.category, `%${q}%`)
      )!
    )
  }
  if (category) conditions.push(eq(tools.category, category))
  if (pricing) conditions.push(eq(tools.pricing, pricing as any))
  if (tier) conditions.push(eq(tools.tier, tier as any))

  const orderMap = {
    upvotes: desc(tools.upvotesCount),
    builds: desc(tools.buildsCount),
    recent: desc(tools.createdAt),
    views: desc(tools.viewsCount),
  }

  return db
    .select()
    .from(tools)
    .where(and(...conditions))
    .orderBy(orderMap[sortBy] ?? desc(tools.upvotesCount))
    .limit(safeLimit)
    .offset(offset)
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
