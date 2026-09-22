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
import { eq, desc, and } from "drizzle-orm"

export interface AnalyticsUser {
  id: string
  name: string
  username: string | null
  image: string | null
  avatarUrl?: string | null
  interactedAt: Date
}

export interface AnalyticsComment {
  id: string
  body: string
  createdAt: Date
  author: {
    id: string
    name: string
    username: string | null
    image: string | null
  }
}

export interface AnalyticsVisitor {
  id: string
  targetUrl: string
  visitedAt: Date
  user: {
    id: string
    name: string
    username: string | null
    image: string | null
  } | null
}

export interface SingleItemAnalyticsData {
  item: {
    id: string
    slug: string
    name: string
    tagline: string
    description: string
    websiteUrl: string
    logoUrl: string | null
    tier: "free" | "premium" | "premium+"
    status: string
    createdAt: Date
    itemType: "product" | "tool"
  }
  stats: {
    viewsCount: number
    likesCount: number
    commentsCount: number
    externalVisitsCount: number
    signedInVisitsCount: number
    anonymousVisitsCount: number
  }
  whoLiked: AnalyticsUser[]
  comments: AnalyticsComment[]
  visitors: AnalyticsVisitor[]
}

export const getProductAnalytics = async (
  slug: string,
  userId: string
): Promise<SingleItemAnalyticsData | null> => {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.submitterId, userId)))
    .limit(1)

  if (!product) return null

  const [likesRows, commentsRows, visitsRows] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        avatarUrl: users.avatarUrl,
        interactedAt: productLikes.createdAt,
      })
      .from(productLikes)
      .innerJoin(users, eq(productLikes.userId, users.id))
      .where(eq(productLikes.productId, product.id))
      .orderBy(desc(productLikes.createdAt)),

    db
      .select({
        id: productComments.id,
        body: productComments.body,
        createdAt: productComments.createdAt,
        userId: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      })
      .from(productComments)
      .innerJoin(users, eq(productComments.userId, users.id))
      .where(eq(productComments.productId, product.id))
      .orderBy(desc(productComments.createdAt)),

    db
      .select({
        id: externalLinkVisits.id,
        targetUrl: externalLinkVisits.targetUrl,
        visitedAt: externalLinkVisits.createdAt,
        userId: users.id,
        userName: users.name,
        userUsername: users.username,
        userImage: users.image,
      })
      .from(externalLinkVisits)
      .leftJoin(users, eq(externalLinkVisits.userId, users.id))
      .where(eq(externalLinkVisits.productId, product.id))
      .orderBy(desc(externalLinkVisits.createdAt))
      .limit(50),
  ])

  const signedInVisits = visitsRows.filter((v) => Boolean(v.userId))
  const anonymousVisitsCount = visitsRows.length - signedInVisits.length

  return {
    item: {
      id: product.id,
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      description: product.description,
      websiteUrl: product.websiteUrl,
      logoUrl: product.logoUrl,
      tier: product.tier as "free" | "premium" | "premium+",
      status: product.status,
      createdAt: product.createdAt,
      itemType: "product",
    },
    stats: {
      viewsCount: product.viewsCount || 0,
      likesCount: product.likesCount || 0,
      commentsCount: product.commentsCount || 0,
      externalVisitsCount: visitsRows.length,
      signedInVisitsCount: signedInVisits.length,
      anonymousVisitsCount,
    },
    whoLiked: likesRows.map((r) => ({
      id: r.id,
      name: r.name,
      username: r.username,
      image: r.avatarUrl || r.image,
      interactedAt: r.interactedAt,
    })),
    comments: commentsRows.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      author: {
        id: c.userId,
        name: c.name,
        username: c.username,
        image: c.image,
      },
    })),
    visitors: visitsRows.map((v) => ({
      id: v.id,
      targetUrl: v.targetUrl,
      visitedAt: v.visitedAt,
      user: v.userId
        ? {
            id: v.userId,
            name: v.userName ?? "Community Member",
            username: v.userUsername,
            image: v.userImage,
          }
        : null,
    })),
  }
}

export const getToolAnalytics = async (
  slug: string,
  userId: string
): Promise<SingleItemAnalyticsData | null> => {
  const [tool] = await db
    .select()
    .from(tools)
    .where(and(eq(tools.slug, slug), eq(tools.submitterId, userId)))
    .limit(1)

  if (!tool) return null

  const [upvotesRows, commentsRows, visitsRows] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
        avatarUrl: users.avatarUrl,
        interactedAt: toolUpvotes.createdAt,
      })
      .from(toolUpvotes)
      .innerJoin(users, eq(toolUpvotes.userId, users.id))
      .where(eq(toolUpvotes.toolId, tool.id))
      .orderBy(desc(toolUpvotes.createdAt)),

    db
      .select({
        id: toolComments.id,
        body: toolComments.body,
        createdAt: toolComments.createdAt,
        userId: users.id,
        name: users.name,
        username: users.username,
        image: users.image,
      })
      .from(toolComments)
      .innerJoin(users, eq(toolComments.userId, users.id))
      .where(eq(toolComments.toolId, tool.id))
      .orderBy(desc(toolComments.createdAt)),

    db
      .select({
        id: externalLinkVisits.id,
        targetUrl: externalLinkVisits.targetUrl,
        visitedAt: externalLinkVisits.createdAt,
        userId: users.id,
        userName: users.name,
        userUsername: users.username,
        userImage: users.image,
      })
      .from(externalLinkVisits)
      .leftJoin(users, eq(externalLinkVisits.userId, users.id))
      .where(eq(externalLinkVisits.toolId, tool.id))
      .orderBy(desc(externalLinkVisits.createdAt))
      .limit(50),
  ])

  const signedInVisits = visitsRows.filter((v) => Boolean(v.userId))
  const anonymousVisitsCount = visitsRows.length - signedInVisits.length

  return {
    item: {
      id: tool.id,
      slug: tool.slug,
      name: tool.name,
      tagline: tool.tagline,
      description: tool.description,
      websiteUrl: tool.websiteUrl,
      logoUrl: tool.logoUrl,
      tier: tool.tier as "free" | "premium" | "premium+",
      status: tool.status,
      createdAt: tool.createdAt,
      itemType: "tool",
    },
    stats: {
      viewsCount: tool.viewsCount || 0,
      likesCount: tool.upvotesCount || 0,
      commentsCount: tool.commentsCount || 0,
      externalVisitsCount: visitsRows.length,
      signedInVisitsCount: signedInVisits.length,
      anonymousVisitsCount,
    },
    whoLiked: upvotesRows.map((r) => ({
      id: r.id,
      name: r.name,
      username: r.username,
      image: r.avatarUrl || r.image,
      interactedAt: r.interactedAt,
    })),
    comments: commentsRows.map((c) => ({
      id: c.id,
      body: c.body,
      createdAt: c.createdAt,
      author: {
        id: c.userId,
        name: c.name,
        username: c.username,
        image: c.image,
      },
    })),
    visitors: visitsRows.map((v) => ({
      id: v.id,
      targetUrl: v.targetUrl,
      visitedAt: v.visitedAt,
      user: v.userId
        ? {
            id: v.userId,
            name: v.userName ?? "Community Member",
            username: v.userUsername,
            image: v.userImage,
          }
        : null,
    })),
  }
}
