import { db } from "@/db"
import { builds, buildProducts, products, users } from "@/db/schema"
import { and, desc, eq, inArray } from "drizzle-orm"

export type BuildListFilters = {
  productId?: string
  authorId?: string
  page?: number
  limit?: number
  sortBy?: "recent" | "likes" | "views"
}

export const getBuilds = async ({
  productId,
  authorId,
  page = 1,
  limit = 20,
  sortBy = "recent",
}: BuildListFilters = {}) => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(50, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit

  const conditions = []
  if (authorId) conditions.push(eq(builds.authorId, authorId))

  // If filtering by productId, first get build IDs via join table
  if (productId) {
    const links = await db
      .select({ buildId: buildProducts.buildId })
      .from(buildProducts)
      .where(eq(buildProducts.productId, productId))
    const buildIds = links.map((l) => l.buildId)
    if (buildIds.length === 0) return []
    conditions.push(inArray(builds.id, buildIds))
  }

  const orderMap = {
    recent: desc(builds.createdAt),
    likes: desc(builds.likesCount),
    views: desc(builds.viewsCount),
  }

  const rows = await db
    .select({
      id: builds.id,
      name: builds.name,
      description: builds.description,
      logoText: builds.logoText,
      logoBg: builds.logoBg,
      tier: builds.tier,
      viewsCount: builds.viewsCount,
      likesCount: builds.likesCount,
      createdAt: builds.createdAt,
      author: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(builds)
    .leftJoin(users, eq(builds.authorId, users.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(orderMap[sortBy] ?? desc(builds.createdAt))
    .limit(safeLimit)
    .offset(offset)

  // Fetch product names for each build
  const buildIds = rows.map((b) => b.id)
  if (buildIds.length === 0) return []

  const productLinks = await db
    .select({
      buildId: buildProducts.buildId,
      name: products.name,
      slug: products.slug,
    })
    .from(buildProducts)
    .innerJoin(products, eq(buildProducts.productId, products.id))
    .where(inArray(buildProducts.buildId, buildIds))

  const productsByBuild: Record<string, { name: string; slug: string }[]> = {}
  for (const link of productLinks) {
    if (!productsByBuild[link.buildId]) productsByBuild[link.buildId] = []
    productsByBuild[link.buildId].push({ name: link.name, slug: link.slug })
  }

  return rows.map((b) => ({
    ...b,
    builtWith: productsByBuild[b.id] ?? [],
  }))
}
