import { db } from "@/db"
import { bookmarks, products } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getUserBookmarks = async (userId: string) => {
  return db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      logoUrl: products.logoUrl,
      pricing: products.pricing,
      tier: products.tier,
      upvotesCount: products.upvotesCount,
      buildsCount: products.buildsCount,
      tags: products.tags,
      bookmarkedAt: bookmarks.createdAt,
    })
    .from(bookmarks)
    .innerJoin(products, eq(bookmarks.productId, products.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(bookmarks.createdAt)
}
