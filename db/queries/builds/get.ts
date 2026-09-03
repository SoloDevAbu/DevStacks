import { db } from "@/db"
import { builds, buildProducts, products, users } from "@/db/schema"
import { eq, inArray, sql } from "drizzle-orm"

export const getBuildById = async (id: string) => {
  const [build] = await db
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
      updatedAt: builds.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(builds)
    .leftJoin(users, eq(builds.authorId, users.id))
    .where(eq(builds.id, id))
    .limit(1)

  if (!build) return null

  // Increment view count (fire-and-forget)
  db.update(builds)
    .set({ viewsCount: sql`${builds.viewsCount} + 1` })
    .where(eq(builds.id, id))
    .catch(() => {})

  // Fetch related products
  const productLinks = await db
    .select({
      name: products.name,
      slug: products.slug,
      logoUrl: products.logoUrl,
    })
    .from(buildProducts)
    .innerJoin(products, eq(buildProducts.productId, products.id))
    .where(eq(buildProducts.buildId, id))

  return { ...build, builtWith: productLinks }
}
