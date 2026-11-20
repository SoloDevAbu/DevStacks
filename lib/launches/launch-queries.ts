import { db } from "@/db"
import { tools, products, categories, productTools } from "@/db/schema"
import { and, desc, eq, inArray, type SQL } from "drizzle-orm"
import { compareByCommunityVotes } from "@/lib/rankings/compare"
import type { RankedItem, RankedProduct } from "@/lib/rankings/types"
import type { ProductBuiltWith } from "@/types/entities"
import { launchedByNow } from "@/lib/catalog/visibility"

const rankedToolColumns = {
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
}

const rankedProductColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  tagline: products.tagline,
  tags: products.tags,
  platforms: products.platforms,
  likesCount: products.likesCount,
  commentsCount: products.commentsCount,
  viewsCount: products.viewsCount,
  pricing: products.pricing,
  tier: products.tier,
  logoUrl: products.logoUrl,
  websiteUrl: products.websiteUrl,
  categoryId: products.categoryId,
  category: categories.name,
  categorySlug: categories.slug,
  createdAt: products.createdAt,
  updatedAt: products.updatedAt,
}

// Tools and products are ranked together by their community votes (upvotes and likes), with
// comment count as the tie-breaker. With a limit, each table is sorted and cut in SQL first: the
// top N of the merged list always comes from the top N of each side, so at most 2N rows are read.
export const selectRankedLaunches = async ({
  toolFilter,
  productFilter,
  limit,
}: {
  toolFilter?: SQL
  productFilter?: SQL
  limit?: number
}): Promise<RankedItem[]> => {
  const toolQuery = db
    .select(rankedToolColumns)
    .from(tools)
    .leftJoin(categories, eq(tools.categoryId, categories.id))
    .where(
      and(
        eq(tools.status, "approved"),
        launchedByNow(tools),
        eq(tools.isDeleted, false),
        toolFilter
      )
    )
    .orderBy(desc(tools.upvotesCount), desc(tools.commentsCount))
    .$dynamic()
  const productQuery = db
    .select(rankedProductColumns)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.status, "approved"),
        launchedByNow(products),
        eq(products.isDeleted, false),
        productFilter
      )
    )
    .orderBy(desc(products.likesCount), desc(products.commentsCount))
    .$dynamic()

  const [toolRows, productRows] = await Promise.all([
    limit ? toolQuery.limit(limit) : toolQuery,
    limit ? productQuery.limit(limit) : productQuery,
  ])

  const combined: RankedItem[] = [
    ...toolRows.map((tool) => ({ ...tool, itemKind: "tool" as const })),
    ...productRows.map((product) => ({
      ...product,
      itemKind: "product" as const,
    })),
  ]

  const ranked = combined.sort(compareByCommunityVotes)
  return limit ? ranked.slice(0, limit) : ranked
}

export const attachBuiltWithTools = async (
  items: RankedItem[]
): Promise<void> => {
  const productIds = items
    .filter((item): item is RankedProduct => item.itemKind === "product")
    .map((product) => product.id)

  if (productIds.length === 0) return

  const rows = await db
    .select({
      productId: productTools.productId,
      name: productTools.name,
      toolId: productTools.toolId,
      toolSlug: tools.slug,
    })
    .from(productTools)
    .leftJoin(
      tools,
      and(eq(productTools.toolId, tools.id), eq(tools.isDeleted, false))
    )
    .where(inArray(productTools.productId, productIds))

  const toolsByProduct = new Map<string, ProductBuiltWith[]>()
  for (const row of rows) {
    const list = toolsByProduct.get(row.productId) ?? []
    list.push({
      name: row.name,
      toolSlug: row.toolSlug ?? null,
      toolId: row.toolId ?? null,
    })
    toolsByProduct.set(row.productId, list)
  }

  for (const item of items) {
    if (item.itemKind === "product") {
      item.builtWithTools = toolsByProduct.get(item.id) ?? []
    }
  }
}

export const selectRankedLaunchPage = async (
  filters: Omit<Parameters<typeof selectRankedLaunches>[0], "limit">,
  limit: number
): Promise<RankedItem[]> => {
  const pageItems = await selectRankedLaunches({ ...filters, limit })
  await attachBuiltWithTools(pageItems)
  return pageItems
}
