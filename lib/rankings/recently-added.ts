import { db } from "@/db"
import { products } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import type { RankingOptions } from "./types"

export const getRecentlyAddedProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}) => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit

  return db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.createdAt))
    .limit(safeLimit)
    .offset(offset)
}
