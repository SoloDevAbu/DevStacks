import { db } from "@/db"
import { products } from "@/db/schema"
import { desc, eq } from "drizzle-orm"

export const getRecentlyAddedProducts = async (limit = 6) => {
  const safeLimit = Math.min(50, Math.max(1, limit))

  return db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.createdAt))
    .limit(safeLimit)
}
