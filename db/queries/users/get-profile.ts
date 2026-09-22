import { db } from "@/db"
import { users, makerFaqs, tools, products, categories } from "@/db/schema"
import { eq, desc, asc, and, isNotNull, sql, inArray } from "drizzle-orm"
import type { MakerProfile, DbTool, DbProduct } from "@/types/entities"

export const generateUniqueUsername = async (
  name?: string | null,
  email?: string | null
): Promise<string> => {
  const seed =
    (name || email?.split("@")[0] || "maker")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 15) || "maker"

  let candidate = seed
  let attempts = 0

  while (attempts < 20) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(sql`lower(${users.username})`, candidate.toLowerCase()))
      .limit(1)

    if (!existing) {
      return candidate
    }

    attempts++
    const randomSuffix = Math.floor(100 + Math.random() * 900)
    candidate = `${seed}${randomSuffix}`
  }

  return `${seed}_${Date.now().toString(36).slice(-4)}`
}

export const getMakerProfile = async (
  username: string
): Promise<MakerProfile | null> => {
  const cleanUsername = decodeURIComponent(username)
    .replace(/^@/, "")
    .trim()
    .toLowerCase()

  if (!cleanUsername) return null

  const [user] = await db
    .select()
    .from(users)
    .where(eq(sql`lower(${users.username})`, cleanUsername))
    .limit(1)

  if (!user) return null

  const [faqs, userTools, userProducts] = await Promise.all([
    db
      .select({
        id: makerFaqs.id,
        question: makerFaqs.question,
        answer: makerFaqs.answer,
        sortOrder: makerFaqs.sortOrder,
      })
      .from(makerFaqs)
      .where(eq(makerFaqs.userId, user.id))
      .orderBy(asc(makerFaqs.sortOrder), asc(makerFaqs.createdAt)),

    db
      .select({
        id: tools.id,
        slug: tools.slug,
        name: tools.name,
        tagline: tools.tagline,
        tags: tools.tags,
        platforms: tools.platforms,
        upvotesCount: tools.upvotesCount,
        buildsCount: tools.buildsCount,
        commentsCount: tools.commentsCount,
        viewsCount: tools.viewsCount,
        pricing: tools.pricing,
        tier: tools.tier,
        logoUrl: tools.logoUrl,
        websiteUrl: tools.websiteUrl,
        images: tools.images,
        demoVideoUrl: tools.demoVideoUrl,
        useCases: tools.useCases,
        categoryId: tools.categoryId,
        category: categories.name,
        categorySlug: categories.slug,
        submitterId: tools.submitterId,
        submitterName: users.name,
        submitterUsername: users.username,
        submitterCountry: users.country,
        submitterAvatarUrl: users.avatarUrl,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
      })
      .from(tools)
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .leftJoin(users, eq(tools.submitterId, users.id))
      .where(and(eq(tools.submitterId, user.id), eq(tools.status, "approved")))
      .orderBy(desc(tools.upvotesCount)),

    db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        tagline: products.tagline,
        tags: products.tags,
        platforms: products.platforms,
        likesCount: products.likesCount,
        commentsCount: products.commentsCount,
        viewsCount: products.viewsCount,
        pricing: products.pricing,
        tier: products.tier,
        logoUrl: products.logoUrl,
        websiteUrl: products.websiteUrl,
        images: products.images,
        demoVideoUrl: products.demoVideoUrl,
        useCases: products.useCases,
        categoryId: products.categoryId,
        category: categories.name,
        categorySlug: categories.slug,
        submitterId: products.submitterId,
        submitterName: users.name,
        submitterUsername: users.username,
        submitterCountry: users.country,
        submitterAvatarUrl: users.avatarUrl,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(users, eq(products.submitterId, users.id))
      .where(
        and(eq(products.submitterId, user.id), eq(products.status, "approved"))
      )
      .orderBy(desc(products.likesCount)),
  ])

  return {
    id: user.id,
    name: user.name,
    username: user.username ?? username,
    avatarUrl: user.avatarUrl ?? user.image,
    image: user.image,
    bio: user.bio,
    description: user.description,
    country: user.country,
    state: user.state,
    websiteUrl: user.websiteUrl,
    twitterUrl: user.twitterUrl,
    githubUrl: user.githubUrl,
    linkedinUrl: user.linkedinUrl,
    createdAt: user.createdAt,
    faqs,
    tools: userTools as unknown as DbTool[],
    products: userProducts as unknown as DbProduct[],
    toolsCount: userTools.length,
    productsCount: userProducts.length,
  }
}

export const getCurrentUserProfile = async (userId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) return null

  const faqs = await db
    .select({
      id: makerFaqs.id,
      question: makerFaqs.question,
      answer: makerFaqs.answer,
      sortOrder: makerFaqs.sortOrder,
    })
    .from(makerFaqs)
    .where(eq(makerFaqs.userId, user.id))
    .orderBy(asc(makerFaqs.sortOrder), asc(makerFaqs.createdAt))

  return {
    ...user,
    faqs,
  }
}

export const getAllMakers = async (limit = 5000) => {
  return db
    .select({
      username: users.username,
      updatedAt: users.updatedAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(isNotNull(users.username))
    .limit(limit)
}

export interface MakerDirectoryItem {
  id: string
  name: string
  username: string | null
  avatarUrl: string | null
  image: string | null
  bio: string | null
  description: string | null
  country: string | null
  state: string | null
  websiteUrl: string | null
  twitterUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  createdAt: Date
  toolsCount: number
  productsCount: number
}

export const getMakersDirectory = async (
  limit = 100
): Promise<MakerDirectoryItem[]> => {
  const makers = await db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatarUrl: users.avatarUrl,
      image: users.image,
      bio: users.bio,
      description: users.description,
      country: users.country,
      state: users.state,
      websiteUrl: users.websiteUrl,
      twitterUrl: users.twitterUrl,
      githubUrl: users.githubUrl,
      linkedinUrl: users.linkedinUrl,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(isNotNull(users.username))
    .orderBy(desc(users.createdAt))
    .limit(limit)

  const makerIds = makers.map((m) => m.id)
  if (makerIds.length === 0) return []

  const [toolCounts, productCounts] = await Promise.all([
    db
      .select({
        submitterId: tools.submitterId,
        count: sql<number>`count(*)::int`,
      })
      .from(tools)
      .where(
        and(eq(tools.status, "approved"), inArray(tools.submitterId, makerIds))
      )
      .groupBy(tools.submitterId),
    db
      .select({
        submitterId: products.submitterId,
        count: sql<number>`count(*)::int`,
      })
      .from(products)
      .where(
        and(
          eq(products.status, "approved"),
          inArray(products.submitterId, makerIds)
        )
      )
      .groupBy(products.submitterId),
  ])

  const toolCountMap = new Map<string, number>(
    toolCounts
      .filter((tc) => tc.submitterId !== null)
      .map((tc) => [tc.submitterId!, Number(tc.count)])
  )
  const productCountMap = new Map<string, number>(
    productCounts
      .filter((pc) => pc.submitterId !== null)
      .map((pc) => [pc.submitterId!, Number(pc.count)])
  )

  return makers.map((maker) => ({
    ...maker,
    toolsCount: toolCountMap.get(maker.id) ?? 0,
    productsCount: productCountMap.get(maker.id) ?? 0,
  }))
}

