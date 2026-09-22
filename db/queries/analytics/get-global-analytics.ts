import { db } from "@/db"
import {
  tools,
  products,
  toolUpvotes,
  productLikes,
  toolComments,
  productComments,
  externalLinkVisits,
  users,
} from "@/db/schema"
import { eq, desc, inArray } from "drizzle-orm"

export interface ItemPerformanceSummary {
  id: string
  slug: string
  name: string
  logoUrl: string | null
  itemType: "product" | "tool"
  tier: "free" | "premium" | "premium+"
  viewsCount: number
  likesCount: number
  commentsCount: number
  externalVisitsCount: number
  ctr: number
}

export interface RecentInteraction {
  id: string
  type: "like" | "comment" | "visit"
  itemType: "product" | "tool"
  itemName: string
  itemSlug: string
  user: {
    name: string
    username: string | null
    image: string | null
  } | null
  content?: string
  createdAt: Date
}

export interface GlobalAnalyticsData {
  stats: {
    totalItems: number
    totalProducts: number
    totalTools: number
    totalViews: number
    totalLikesAndUpvotes: number
    totalComments: number
    totalExternalVisits: number
    totalSignedInVisits: number
    overallCtr: number
  }
  items: ItemPerformanceSummary[]
  recentInteractions: RecentInteraction[]
}

export const getGlobalAnalytics = async (
  userId: string
): Promise<GlobalAnalyticsData> => {
  const [userProducts, userTools] = await Promise.all([
    db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        logoUrl: products.logoUrl,
        tier: products.tier,
        viewsCount: products.viewsCount,
        likesCount: products.likesCount,
        commentsCount: products.commentsCount,
      })
      .from(products)
      .where(eq(products.submitterId, userId))
      .orderBy(desc(products.createdAt)),

    db
      .select({
        id: tools.id,
        slug: tools.slug,
        name: tools.name,
        logoUrl: tools.logoUrl,
        tier: tools.tier,
        viewsCount: tools.viewsCount,
        upvotesCount: tools.upvotesCount,
        commentsCount: tools.commentsCount,
      })
      .from(tools)
      .where(eq(tools.submitterId, userId))
      .orderBy(desc(tools.createdAt)),
  ])

  const productIds = userProducts.map((p) => p.id)
  const toolIds = userTools.map((t) => t.id)

  const [productVisits, toolVisits, recentLikes, recentUpvotes, recentProdComments, recentToolComments] =
    await Promise.all([
      productIds.length > 0
        ? db
            .select({
              id: externalLinkVisits.id,
              productId: externalLinkVisits.productId,
              userId: externalLinkVisits.userId,
              createdAt: externalLinkVisits.createdAt,
              userName: users.name,
              userUsername: users.username,
              userImage: users.image,
            })
            .from(externalLinkVisits)
            .leftJoin(users, eq(externalLinkVisits.userId, users.id))
            .where(inArray(externalLinkVisits.productId, productIds))
            .orderBy(desc(externalLinkVisits.createdAt))
            .limit(100)
        : Promise.resolve([]),

      toolIds.length > 0
        ? db
            .select({
              id: externalLinkVisits.id,
              toolId: externalLinkVisits.toolId,
              userId: externalLinkVisits.userId,
              createdAt: externalLinkVisits.createdAt,
              userName: users.name,
              userUsername: users.username,
              userImage: users.image,
            })
            .from(externalLinkVisits)
            .leftJoin(users, eq(externalLinkVisits.userId, users.id))
            .where(inArray(externalLinkVisits.toolId, toolIds))
            .orderBy(desc(externalLinkVisits.createdAt))
            .limit(100)
        : Promise.resolve([]),

      productIds.length > 0
        ? db
            .select({
              id: productLikes.id,
              productId: productLikes.productId,
              productName: products.name,
              productSlug: products.slug,
              createdAt: productLikes.createdAt,
              userName: users.name,
              userUsername: users.username,
              userImage: users.image,
            })
            .from(productLikes)
            .innerJoin(products, eq(productLikes.productId, products.id))
            .innerJoin(users, eq(productLikes.userId, users.id))
            .where(inArray(productLikes.productId, productIds))
            .orderBy(desc(productLikes.createdAt))
            .limit(15)
        : Promise.resolve([]),

      toolIds.length > 0
        ? db
            .select({
              id: toolUpvotes.id,
              toolId: toolUpvotes.toolId,
              toolName: tools.name,
              toolSlug: tools.slug,
              createdAt: toolUpvotes.createdAt,
              userName: users.name,
              userUsername: users.username,
              userImage: users.image,
            })
            .from(toolUpvotes)
            .innerJoin(tools, eq(toolUpvotes.toolId, tools.id))
            .innerJoin(users, eq(toolUpvotes.userId, users.id))
            .where(inArray(toolUpvotes.toolId, toolIds))
            .orderBy(desc(toolUpvotes.createdAt))
            .limit(15)
        : Promise.resolve([]),

      productIds.length > 0
        ? db
            .select({
              id: productComments.id,
              productId: productComments.productId,
              productName: products.name,
              productSlug: products.slug,
              body: productComments.body,
              createdAt: productComments.createdAt,
              userName: users.name,
              userUsername: users.username,
              userImage: users.image,
            })
            .from(productComments)
            .innerJoin(products, eq(productComments.productId, products.id))
            .innerJoin(users, eq(productComments.userId, users.id))
            .where(inArray(productComments.productId, productIds))
            .orderBy(desc(productComments.createdAt))
            .limit(15)
        : Promise.resolve([]),

      toolIds.length > 0
        ? db
            .select({
              id: toolComments.id,
              toolId: toolComments.toolId,
              toolName: tools.name,
              toolSlug: tools.slug,
              body: toolComments.body,
              createdAt: toolComments.createdAt,
              userName: users.name,
              userUsername: users.username,
              userImage: users.image,
            })
            .from(toolComments)
            .innerJoin(tools, eq(toolComments.toolId, tools.id))
            .innerJoin(users, eq(toolComments.userId, users.id))
            .where(inArray(toolComments.toolId, toolIds))
            .orderBy(desc(toolComments.createdAt))
            .limit(15)
        : Promise.resolve([]),
    ])

  const productVisitsMap = new Map<string, number>()
  for (const v of productVisits) {
    if (v.productId) {
      productVisitsMap.set(v.productId, (productVisitsMap.get(v.productId) || 0) + 1)
    }
  }

  const toolVisitsMap = new Map<string, number>()
  for (const v of toolVisits) {
    if (v.toolId) {
      toolVisitsMap.set(v.toolId, (toolVisitsMap.get(v.toolId) || 0) + 1)
    }
  }

  const items: ItemPerformanceSummary[] = [
    ...userProducts.map((p) => {
      const visits = productVisitsMap.get(p.id) || 0
      const views = p.viewsCount || 0
      const ctr = views > 0 ? Number(((visits / views) * 100).toFixed(1)) : 0
      return {
        id: p.id,
        slug: p.slug,
        name: p.name,
        logoUrl: p.logoUrl,
        itemType: "product" as const,
        tier: p.tier as "free" | "premium" | "premium+",
        viewsCount: views,
        likesCount: p.likesCount || 0,
        commentsCount: p.commentsCount || 0,
        externalVisitsCount: visits,
        ctr,
      }
    }),
    ...userTools.map((t) => {
      const visits = toolVisitsMap.get(t.id) || 0
      const views = t.viewsCount || 0
      const ctr = views > 0 ? Number(((visits / views) * 100).toFixed(1)) : 0
      return {
        id: t.id,
        slug: t.slug,
        name: t.name,
        logoUrl: t.logoUrl,
        itemType: "tool" as const,
        tier: t.tier as "free" | "premium" | "premium+",
        viewsCount: views,
        likesCount: t.upvotesCount || 0,
        commentsCount: t.commentsCount || 0,
        externalVisitsCount: visits,
        ctr,
      }
    }),
  ].sort((a, b) => b.viewsCount - a.viewsCount)

  const totalViews = items.reduce((acc, i) => acc + i.viewsCount, 0)
  const totalLikesAndUpvotes = items.reduce((acc, i) => acc + i.likesCount, 0)
  const totalComments = items.reduce((acc, i) => acc + i.commentsCount, 0)
  const totalExternalVisits = productVisits.length + toolVisits.length
  const totalSignedInVisits =
    productVisits.filter((v) => Boolean(v.userId)).length +
    toolVisits.filter((v) => Boolean(v.userId)).length
  const overallCtr =
    totalViews > 0 ? Number(((totalExternalVisits / totalViews) * 100).toFixed(1)) : 0

  const recentInteractions: RecentInteraction[] = [
    ...recentLikes.map((l) => ({
      id: `like-${l.id}`,
      type: "like" as const,
      itemType: "product" as const,
      itemName: l.productName,
      itemSlug: l.productSlug,
      user: {
        name: l.userName,
        username: l.userUsername,
        image: l.userImage,
      },
      createdAt: l.createdAt,
    })),
    ...recentUpvotes.map((u) => ({
      id: `upvote-${u.id}`,
      type: "like" as const,
      itemType: "tool" as const,
      itemName: u.toolName,
      itemSlug: u.toolSlug,
      user: {
        name: u.userName,
        username: u.userUsername,
        image: u.userImage,
      },
      createdAt: u.createdAt,
    })),
    ...recentProdComments.map((c) => ({
      id: `comment-${c.id}`,
      type: "comment" as const,
      itemType: "product" as const,
      itemName: c.productName,
      itemSlug: c.productSlug,
      user: {
        name: c.userName,
        username: c.userUsername,
        image: c.userImage,
      },
      content: c.body,
      createdAt: c.createdAt,
    })),
    ...recentToolComments.map((c) => ({
      id: `comment-${c.id}`,
      type: "comment" as const,
      itemType: "tool" as const,
      itemName: c.toolName,
      itemSlug: c.toolSlug,
      user: {
        name: c.userName,
        username: c.userUsername,
        image: c.userImage,
      },
      content: c.body,
      createdAt: c.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return {
    stats: {
      totalItems: items.length,
      totalProducts: userProducts.length,
      totalTools: userTools.length,
      totalViews,
      totalLikesAndUpvotes,
      totalComments,
      totalExternalVisits,
      totalSignedInVisits,
      overallCtr,
    },
    items,
    recentInteractions: recentInteractions.slice(0, 30),
  }
}
