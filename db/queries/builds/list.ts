import { db } from "@/db"
import { products, users } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"

export type BuildListFilters = {
  authorId?: string
  page?: number
  limit?: number
  sortBy?: "recent" | "likes" | "views"
}

export const getBuilds = async ({
  authorId,
  page = 1,
  limit = 20,
  sortBy = "recent",
}: BuildListFilters = {}) => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(50, Math.max(1, limit))
  const offset = (safePage - 1) * safeLimit

  const conditions = [eq(products.status, "approved")]
  if (authorId) conditions.push(eq(products.submitterId, authorId))

  const orderMap = {
    recent: desc(products.createdAt),
    likes: desc(products.likesCount),
    views: desc(products.viewsCount),
  }

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      description: products.description,
      tier: products.tier,
      viewsCount: products.viewsCount,
      likesCount: products.likesCount,
      builtWithTools: products.builtWithTools,
      createdAt: products.createdAt,
      author: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(products)
    .leftJoin(users, eq(products.submitterId, users.id))
    .where(and(...conditions))
    .orderBy(orderMap[sortBy] ?? desc(products.createdAt))
    .limit(safeLimit)
    .offset(offset)

  return rows.map((p) => ({
    ...p,
    logoText: p.name.slice(0, 2).toUpperCase(),
    logoBg: "bg-slate-900 text-white",
    builtWith: p.builtWithTools ?? [],
  }))
}
