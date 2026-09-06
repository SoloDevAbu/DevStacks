import { db } from "@/db"
import { toolBookmarks, productBookmarks, tools, products } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getUserToolBookmarks = async (userId: string) => {
  return db
    .select({
      id: tools.id,
      slug: tools.slug,
      name: tools.name,
      tagline: tools.tagline,
      logoUrl: tools.logoUrl,
      pricing: tools.pricing,
      tier: tools.tier,
      upvotesCount: tools.upvotesCount,
      buildsCount: tools.buildsCount,
      tags: tools.tags,
      bookmarkedAt: toolBookmarks.createdAt,
    })
    .from(toolBookmarks)
    .innerJoin(tools, eq(toolBookmarks.toolId, tools.id))
    .where(eq(toolBookmarks.userId, userId))
    .orderBy(toolBookmarks.createdAt)
}

export const getUserProductBookmarks = async (userId: string) => {
  return db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      logoUrl: products.logoUrl,
      pricing: products.pricing,
      tier: products.tier,
      likesCount: products.likesCount,
      tags: products.tags,
      builtWithTools: products.builtWithTools,
      bookmarkedAt: productBookmarks.createdAt,
    })
    .from(productBookmarks)
    .innerJoin(products, eq(productBookmarks.productId, products.id))
    .where(eq(productBookmarks.userId, userId))
    .orderBy(productBookmarks.createdAt)
}
