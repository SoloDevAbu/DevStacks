import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import type { RankedItem, RankingOptions } from "./types"

export const getRecentlyAddedProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit
  const fetchCount = safeLimit * safePage

  const [recentTools, recentProducts] = await Promise.all([
    db
      .select()
      .from(tools)
      .where(eq(tools.status, "approved"))
      .orderBy(desc(tools.createdAt))
      .limit(fetchCount),
    db
      .select()
      .from(products)
      .where(eq(products.status, "approved"))
      .orderBy(desc(products.createdAt))
      .limit(fetchCount),
  ])

  const combined: RankedItem[] = [
    ...recentTools.map((t) => ({ ...t, itemKind: "tool" as const })),
    ...recentProducts.map((p) => ({ ...p, itemKind: "product" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return combined.slice(offset, offset + safeLimit)
}
