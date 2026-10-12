import { db } from "@/db"
import {
  toolUpvotes,
  toolBookmarks,
  productLikes,
  productBookmarks,
  tools,
  products,
} from "@/db/schema"
import { and, eq } from "drizzle-orm"

export type UserInteractions = {
  // Tools
  upvotedToolIds: string[]
  upvotedToolSlugs: string[]
  bookmarkedToolIds: string[]
  bookmarkedToolSlugs: string[]
  // Products
  likedProductIds: string[]
  likedProductSlugs: string[]
  bookmarkedProductIds: string[]
  bookmarkedProductSlugs: string[]
}

export const getUserInteractions = async (
  userId: string
): Promise<UserInteractions> => {
  const [
    userToolUpvotes,
    userToolBookmarks,
    userProductLikes,
    userProductBookmarks,
  ] = await Promise.all([
    db
      .select({ toolId: toolUpvotes.toolId, slug: tools.slug })
      .from(toolUpvotes)
      .innerJoin(tools, eq(toolUpvotes.toolId, tools.id))
      .where(and(eq(toolUpvotes.userId, userId), eq(tools.isDeleted, false))),
    db
      .select({ toolId: toolBookmarks.toolId, slug: tools.slug })
      .from(toolBookmarks)
      .innerJoin(tools, eq(toolBookmarks.toolId, tools.id))
      .where(and(eq(toolBookmarks.userId, userId), eq(tools.isDeleted, false))),
    db
      .select({ productId: productLikes.productId, slug: products.slug })
      .from(productLikes)
      .innerJoin(products, eq(productLikes.productId, products.id))
      .where(
        and(eq(productLikes.userId, userId), eq(products.isDeleted, false))
      ),
    db
      .select({ productId: productBookmarks.productId, slug: products.slug })
      .from(productBookmarks)
      .innerJoin(products, eq(productBookmarks.productId, products.id))
      .where(
        and(eq(productBookmarks.userId, userId), eq(products.isDeleted, false))
      ),
  ])

  return {
    upvotedToolIds: userToolUpvotes.map((u) => u.toolId),
    upvotedToolSlugs: userToolUpvotes.map((u) => u.slug),
    bookmarkedToolIds: userToolBookmarks.map((b) => b.toolId),
    bookmarkedToolSlugs: userToolBookmarks.map((b) => b.slug),
    likedProductIds: userProductLikes.map((l) => l.productId),
    likedProductSlugs: userProductLikes.map((l) => l.slug),
    bookmarkedProductIds: userProductBookmarks.map((b) => b.productId),
    bookmarkedProductSlugs: userProductBookmarks.map((b) => b.slug),
  }
}
