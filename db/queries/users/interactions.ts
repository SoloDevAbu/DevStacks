import { db } from "@/db"
import { upvotes, bookmarks, products } from "@/db/schema"
import { eq } from "drizzle-orm"

export type UserInteractions = {
  upvotedProductIds: string[]
  upvotedSlugs: string[]
  bookmarkedProductIds: string[]
  bookmarkedSlugs: string[]
}

export const getUserInteractions = async (
  userId: string
): Promise<UserInteractions> => {
  const [userUpvotes, userBookmarks] = await Promise.all([
    db
      .select({ productId: upvotes.productId, slug: products.slug })
      .from(upvotes)
      .innerJoin(products, eq(upvotes.productId, products.id))
      .where(eq(upvotes.userId, userId)),
    db
      .select({ productId: bookmarks.productId, slug: products.slug })
      .from(bookmarks)
      .innerJoin(products, eq(bookmarks.productId, products.id))
      .where(eq(bookmarks.userId, userId)),
  ])

  return {
    upvotedProductIds: userUpvotes.map((u) => u.productId),
    upvotedSlugs: userUpvotes.map((u) => u.slug),
    bookmarkedProductIds: userBookmarks.map((b) => b.productId),
    bookmarkedSlugs: userBookmarks.map((b) => b.slug),
  }
}
