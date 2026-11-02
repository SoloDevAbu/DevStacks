import { db } from "@/db"
import { tools, products, categories } from "@/db/schema"
import { and, eq, ilike, or, sql } from "drizzle-orm"
import { slugify } from "@/utils/slug"
import { getCanonicalCategory } from "@/constants/categories"
import { unstable_cache } from "next/cache"
import { CACHE_TAGS, CACHE_REVALIDATE_SECONDS } from "@/constants/cache"
import { launchedByNow } from "@/lib/catalog/visibility"

export type DbCategoryItem = {
  id: string
  name: string
  slug: string
  count: number
}

export const getToolCategories = async (
  query?: string
): Promise<DbCategoryItem[]> => {
  const conditions = [
    eq(tools.status, "approved"),
    launchedByNow(tools),
    eq(tools.isDeleted, false),
  ]

  if (query && query.trim()) {
    const pattern = `%${query.trim()}%`
    conditions.push(
      or(ilike(categories.name, pattern), ilike(categories.slug, pattern))!
    )
  }

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      count: sql<number>`count(${tools.id})::int`,
    })
    .from(categories)
    .innerJoin(tools, eq(categories.id, tools.categoryId))
    .where(and(...conditions))
    .groupBy(categories.id, categories.name, categories.slug)
    .orderBy(sql`count(${tools.id}) DESC`, categories.name)

  return rows
}

export const getProductCategories = async (
  query?: string
): Promise<DbCategoryItem[]> => {
  const conditions = [
    eq(products.status, "approved"),
    launchedByNow(products),
    eq(products.isDeleted, false),
  ]

  if (query && query.trim()) {
    const pattern = `%${query.trim()}%`
    conditions.push(
      or(ilike(categories.name, pattern), ilike(categories.slug, pattern))!
    )
  }

  const rows = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      count: sql<number>`count(${products.id})::int`,
    })
    .from(categories)
    .innerJoin(products, eq(categories.id, products.categoryId))
    .where(and(...conditions))
    .groupBy(categories.id, categories.name, categories.slug)
    .orderBy(sql`count(${products.id}) DESC`, categories.name)

  return rows
}

export const getAllCategories = async (
  query?: string
): Promise<DbCategoryItem[]> => {
  const [toolCats, prodCats] = await Promise.all([
    getToolCategories(query),
    getProductCategories(query),
  ])

  const map = new Map<string, DbCategoryItem>()

  for (const tc of toolCats) {
    map.set(tc.id, { ...tc })
  }

  for (const pc of prodCats) {
    const existing = map.get(pc.id)
    if (existing) {
      existing.count += pc.count
    } else {
      map.set(pc.id, { ...pc })
    }
  }

  return Array.from(map.values()).sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name)
  )
}

export const getDbCategories = getAllCategories

export const getOrCreateCategory = async (rawName: string): Promise<string> => {
  const trimmed = rawName.trim()
  if (!trimmed) {
    throw new Error("Category name cannot be empty")
  }

  const canonical = getCanonicalCategory(trimmed)
  if (!canonical) {
    throw new Error(
      `Invalid category: "${trimmed}". Must be one of the official canonical categories.`
    )
  }

  const { name, slug } = canonical

  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(or(ilike(categories.name, name), eq(categories.slug, slug)))
    .limit(1)

  if (existing[0]?.id) {
    return existing[0].id
  }

  try {
    const [inserted] = await db
      .insert(categories)
      .values({ name, slug })
      .onConflictDoNothing()
      .returning({ id: categories.id })

    if (inserted?.id) {
      return inserted.id
    }
  } catch {
    // Conflict on slug or concurrent insert
  }

  const fallback = await db
    .select({ id: categories.id })
    .from(categories)
    .where(or(ilike(categories.name, name), eq(categories.slug, slug)))
    .limit(1)

  if (fallback[0]?.id) {
    return fallback[0].id
  }

  throw new Error(`Failed to resolve canonical category "${name}"`)
}

export const getCategoryBySlug = async (slug: string) => {
  const cleanSlug = slug.trim().toLowerCase()
  const cleanName = slug.trim().replace(/-/g, " ")

  const [row] = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      createdAt: categories.createdAt,
    })
    .from(categories)
    .where(
      or(
        eq(categories.slug, cleanSlug),
        ilike(categories.name, cleanName),
        ilike(categories.name, cleanSlug)
      )
    )
    .limit(1)

  return row ?? null
}

export const getCategoryStats = async (categoryId: string) => {
  const [toolStats] = await db
    .select({
      toolCount: sql<number>`count(${tools.id})::int`,
      totalBuilds: sql<number>`coalesce(sum(${tools.buildsCount}), 0)::int`,
      openSourceCount: sql<number>`count(case when ${tools.pricing} = 'Open Source' then 1 end)::int`,
      freeCount: sql<number>`count(case when ${tools.pricing} in ('Free', 'Freemium', 'Open Source') then 1 end)::int`,
    })
    .from(tools)
    .where(
      and(
        eq(tools.categoryId, categoryId),
        eq(tools.status, "approved"),
        launchedByNow(tools),
        eq(tools.isDeleted, false)
      )
    )

  const [productStats] = await db
    .select({
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(products)
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.status, "approved"),
        launchedByNow(products),
        eq(products.isDeleted, false)
      )
    )

  return {
    toolCount: Number(toolStats?.toolCount ?? 0),
    totalBuilds: Number(toolStats?.totalBuilds ?? 0),
    openSourceCount: Number(toolStats?.openSourceCount ?? 0),
    freeCount: Number(toolStats?.freeCount ?? 0),
    productCount: Number(productStats?.productCount ?? 0),
  }
}

export const getCachedToolCategories = unstable_cache(
  async (query?: string) => getToolCategories(query),
  [CACHE_TAGS.TOOL_CATEGORIES],
  { revalidate: CACHE_REVALIDATE_SECONDS.CATEGORIES, tags: [CACHE_TAGS.TOOL_CATEGORIES] }
)

export const getCachedProductCategories = unstable_cache(
  async (query?: string) => getProductCategories(query),
  [CACHE_TAGS.PRODUCT_CATEGORIES],
  { revalidate: CACHE_REVALIDATE_SECONDS.CATEGORIES, tags: [CACHE_TAGS.PRODUCT_CATEGORIES] }
)
