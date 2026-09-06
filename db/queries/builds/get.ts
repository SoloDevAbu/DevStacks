import { db } from "@/db"
import { products, users } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const getBuildById = async (id: string) => {
  const [product] = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      tier: products.tier,
      viewsCount: products.viewsCount,
      likesCount: products.likesCount,
      builtWithTools: products.builtWithTools,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      author: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(products)
    .leftJoin(users, eq(products.submitterId, users.id))
    .where(eq(products.id, id))
    .limit(1)

  if (!product) return null

  // Fire-and-forget view count increment
  db.update(products)
    .set({ viewsCount: sql`${products.viewsCount} + 1` })
    .where(eq(products.id, id))
    .catch(() => {})

  return {
    ...product,
    logoText: product.name.slice(0, 2).toUpperCase(),
    logoBg: "bg-slate-900 text-white",
    builtWith: product.builtWithTools ?? [],
  }
}
