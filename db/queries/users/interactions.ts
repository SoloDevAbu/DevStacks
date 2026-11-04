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
  upvotedToolSlugs: string[]
  toolUpvoteCounts: Record<string, number>
  bookmarkedToolIds: string[]
  bookmarkedToolSlugs: string[]
  // Products
  likedProductSlugs: string[]
  productLikeCounts: Record<string, number>
  bookmarkedProductIds: string[]
  bookmarkedProductSlugs: string[]
}

export const EMPTY_USER_INTERACTIONS: UserInteractions = {
  upvotedToolSlugs: [],
  toolUpvoteCounts: {},
  bookmarkedToolIds: [],
  bookmarkedToolSlugs: [],
  likedProductSlugs: [],
  productLikeCounts: {},
  bookmarkedProductIds: [],
  bookmarkedProductSlugs: [],
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
      .select({ slug: tools.slug, count: tools.upvotesCount })
      .from(toolUpvotes)
      .innerJoin(tools, eq(toolUpvotes.toolId, tools.id))
      .where(and(eq(toolUpvotes.userId, userId), eq(tools.isDeleted, false))),
    db
      .select({ toolId: toolBookmarks.toolId, slug: tools.slug })
      .from(toolBookmarks)
      .innerJoin(tools, eq(toolBookmarks.toolId, tools.id))
      .where(and(eq(toolBookmarks.userId, userId), eq(tools.isDeleted, false))),
    db
      .select({ slug: products.slug, count: products.likesCount })
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
    upvotedToolSlugs: userToolUpvotes.map((u) => u.slug),
    toolUpvoteCounts: Object.fromEntries(
      userToolUpvotes.map((u) => [u.slug, u.count])
    ),
    bookmarkedToolIds: userToolBookmarks.map((b) => b.toolId),
    bookmarkedToolSlugs: userToolBookmarks.map((b) => b.slug),
    likedProductSlugs: userProductLikes.map((l) => l.slug),
    productLikeCounts: Object.fromEntries(
      userProductLikes.map((l) => [l.slug, l.count])
    ),
    bookmarkedProductIds: userProductBookmarks.map((b) => b.productId),
    bookmarkedProductSlugs: userProductBookmarks.map((b) => b.slug),
  }
}
