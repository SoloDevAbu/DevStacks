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
  const slug = slugify(name)

  const existing = await db
    .select({ id: categories.id })
    .from(categories)
    .where(or(ilike(categories.name, name), eq(categories.slug, slug)))
    .limit(1)

  if (existing[0]) {
    return existing[0].id
  }

  const [inserted] = await db
    .insert(categories)
    .values({ name, slug })
    .onConflictDoNothing({ target: categories.name })
    .returning({ id: categories.id })

  if (inserted) {
    return inserted.id
  }

  const fallback = await db
    .select({ id: categories.id })
    .from(categories)
    .where(or(ilike(categories.name, name), eq(categories.slug, slug)))
    .limit(1)

  return fallback[0]!.id
}
