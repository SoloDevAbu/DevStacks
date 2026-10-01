import { db } from "@/db"
import { tools, products, categories } from "@/db/schema"
import { and, eq, ilike, or, sql } from "drizzle-orm"

export type DbCategoryItem = {
  id: string
  name: string
  slug: string
  count: number
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

export const getToolCategories = async (
  query?: string
): Promise<DbCategoryItem[]> => {
  const conditions = [eq(tools.status, "approved")]

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
  const conditions = [eq(products.status, "approved")]

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
  const name = rawName.trim()
  if (!name) {
    throw new Error("Category name cannot be empty")
  }

  const baseSlug = slugify(name)
  const slug = baseSlug || `cat-${Math.random().toString(36).substring(2, 7)}`

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

  const uniqueSlug = `${slug}-${Math.random().toString(36).substring(2, 6)}`
  const [created] = await db
    .insert(categories)
    .values({ name, slug: uniqueSlug })
    .onConflictDoNothing()
    .returning({ id: categories.id })

  return created?.id ?? fallback[0]!.id
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
    .where(and(eq(tools.categoryId, categoryId), eq(tools.status, "approved")))

  const [productStats] = await db
    .select({
      productCount: sql<number>`count(${products.id})::int`,
    })
    .from(products)
    .where(and(eq(products.categoryId, categoryId), eq(products.status, "approved")))

  return {
    toolCount: Number(toolStats?.toolCount ?? 0),
    totalBuilds: Number(toolStats?.totalBuilds ?? 0),
    openSourceCount: Number(toolStats?.openSourceCount ?? 0),
    freeCount: Number(toolStats?.freeCount ?? 0),
    productCount: Number(productStats?.productCount ?? 0),
  }
}
