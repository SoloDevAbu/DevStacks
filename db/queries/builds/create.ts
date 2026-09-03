import { db } from "@/db"
import { builds, buildProducts, products } from "@/db/schema"
import { inArray, sql } from "drizzle-orm"
import type { NewBuild } from "@/db/schema"

export const createBuild = async (
  data: Omit<NewBuild, "id" | "viewsCount" | "likesCount" | "createdAt" | "updatedAt">,
  productIds: string[]
) => {
  const [build] = await db.insert(builds).values(data).returning()

  if (productIds.length > 0) {
    // Validate product IDs exist
    const existingProducts = await db
      .select({ id: products.id })
      .from(products)
      .where(inArray(products.id, productIds))

    const validIds = existingProducts.map((p) => p.id)

    if (validIds.length > 0) {
      await db.insert(buildProducts).values(
        validIds.map((productId) => ({ buildId: build.id, productId }))
      )

      // Increment buildsCount for each linked product
      await db
        .update(products)
        .set({ buildsCount: sql`${products.buildsCount} + 1` })
        .where(inArray(products.id, validIds))
    }
  }

  return build
}
