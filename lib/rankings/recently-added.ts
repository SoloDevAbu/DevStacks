import { db } from "@/db"
import { products } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { getBuilds } from "@/db/queries/builds/list"
import type { RankingOptions } from "./types"

export const getRecentlyAddedProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}) => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit
  const fetchCount = safeLimit * safePage

  const [recentProducts, recentBuilds] = await Promise.all([
    db
      .select()
      .from(products)
      .where(eq(products.status, "approved"))
      .orderBy(desc(products.createdAt))
      .limit(fetchCount),
    getBuilds({
      limit: fetchCount,
      sortBy: "recent",
    }),
  ])

  const taggedProducts = recentProducts.map((p) => ({
    ...p,
    itemType: "product" as const,
  }))

  const taggedBuilds = recentBuilds.map((b) => ({
    ...b,
    itemType: "build" as const,
  }))

  const combined = [...taggedProducts, ...taggedBuilds].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return combined.slice(offset, offset + safeLimit)
}
