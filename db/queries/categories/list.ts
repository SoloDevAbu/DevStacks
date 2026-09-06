import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { and, eq, ilike, isNotNull, sql } from "drizzle-orm"

export type DbCategoryItem = {
  name: string
  count: number
}

export const getDbCategories = async (
  query?: string
): Promise<DbCategoryItem[]> => {
  const toolConditions = [
    eq(tools.status, "approved"),
    isNotNull(tools.category),
  ]
  const productConditions = [
    eq(products.status, "approved"),
    isNotNull(products.category),
  ]

  if (query && query.trim()) {
    const pattern = `%${query.trim()}%`
    toolConditions.push(ilike(tools.category, pattern))
    productConditions.push(ilike(products.category, pattern))
  }

  const [toolCategories, productCategories] = await Promise.all([
    db
      .select({
        category: tools.category,
        count: sql<number>`count(*)::int`,
      })
      .from(tools)
      .where(and(...toolConditions))
      .groupBy(tools.category),
    db
      .select({
        category: products.category,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .where(and(...productConditions))
      .groupBy(products.category),
  ])

  const categoryMap = new Map<string, number>()

  for (const t of toolCategories) {
    if (t.category) {
      const trimmed = t.category.trim()
      categoryMap.set(
        trimmed,
        (categoryMap.get(trimmed) ?? 0) + Number(t.count || 0)
      )
    }
  }

  for (const p of productCategories) {
    if (p.category) {
      const trimmed = p.category.trim()
      categoryMap.set(
        trimmed,
        (categoryMap.get(trimmed) ?? 0) + Number(p.count || 0)
      )
    }
  }

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
