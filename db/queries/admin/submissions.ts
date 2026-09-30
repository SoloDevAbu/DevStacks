import { db } from "@/db"
import { tools, products, categories, users, launches } from "@/db/schema"
import { eq, or, ilike, and, sql } from "drizzle-orm"
import { getOrCreateCategory } from "@/db/queries/categories/list"
import { getISOWeekRange } from "@/utils/iso-weeks"
import type { Tier, Pricing } from "@/constants/plans"

export type AdminSubmissionItem = {
  id: string
  slug: string
  itemType: "tool" | "product"
  name: string
  tagline: string
  description: string
  websiteUrl: string
  logoUrl?: string | null
  images: string[]
  demoVideoUrl?: string | null
  category?: string | null
  categoryId?: string | null
  categorySlug?: string | null
  tags: string[]
  platforms: string[]
  pricing: Pricing
  tier: Tier
  status: "pending" | "approved" | "rejected"
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
  useCases?: string | null
  keywords?: string | null
  targetAudience?: string | null
  launchYear?: number | null
  launchWeek?: number | null
  launchDate?: Date | null
  createdAt: Date
  updatedAt: Date
  submitterId?: string | null
  submitterEmail?: string | null
  submitterName?: string | null
  submitterUsername?: string | null
  submitterAvatarUrl?: string | null
  submitterCountry?: string | null
  metrics: {
    votesOrLikes: number
    commentsCount: number
    viewsCount: number
    buildsCount?: number
  }
}

export type AdminSubmissionsFilters = {
  status?: "pending" | "approved" | "rejected" | "all"
  itemType?: "tool" | "product" | "all"
  search?: string
  sortBy?: "recent" | "name"
  page?: number
  limit?: number
}

export type AdminSubmissionsStats = {
  totalPending: number
  totalApproved: number
  totalRejected: number
  toolsPending: number
  productsPending: number
  totalAll: number
}

export type AdminSubmissionsResult = {
  items: AdminSubmissionItem[]
  stats: AdminSubmissionsStats
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
  }
}

export const getAdminSubmissions = async ({
  status = "pending",
  itemType = "all",
  search,
  sortBy = "recent",
  page = 1,
  limit = 20,
}: AdminSubmissionsFilters = {}): Promise<AdminSubmissionsResult> => {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(100, Math.max(1, limit))

  // 1. Compute aggregate statistics across database
  const [
    toolPendingCount,
    toolApprovedCount,
    toolRejectedCount,
    toolTotalCount,
    prodPendingCount,
    prodApprovedCount,
    prodRejectedCount,
    prodTotalCount,
  ] = await Promise.all([
    db
      .select({ count: sql<number>`count(${tools.id})::int` })
      .from(tools)
      .where(eq(tools.status, "pending")),
    db
      .select({ count: sql<number>`count(${tools.id})::int` })
      .from(tools)
      .where(eq(tools.status, "approved")),
    db
      .select({ count: sql<number>`count(${tools.id})::int` })
      .from(tools)
      .where(eq(tools.status, "rejected")),
    db
      .select({ count: sql<number>`count(${tools.id})::int` })
      .from(tools),
    db
      .select({ count: sql<number>`count(${products.id})::int` })
      .from(products)
      .where(eq(products.status, "pending")),
    db
      .select({ count: sql<number>`count(${products.id})::int` })
      .from(products)
      .where(eq(products.status, "approved")),
    db
      .select({ count: sql<number>`count(${products.id})::int` })
      .from(products)
      .where(eq(products.status, "rejected")),
    db
      .select({ count: sql<number>`count(${products.id})::int` })
      .from(products),
  ])

  const tPending = toolPendingCount[0]?.count ?? 0
  const tApproved = toolApprovedCount[0]?.count ?? 0
  const tRejected = toolRejectedCount[0]?.count ?? 0
  const tTotal = toolTotalCount[0]?.count ?? 0

  const pPending = prodPendingCount[0]?.count ?? 0
  const pApproved = prodApprovedCount[0]?.count ?? 0
  const pRejected = prodRejectedCount[0]?.count ?? 0
  const pTotal = prodTotalCount[0]?.count ?? 0

  const stats: AdminSubmissionsStats = {
    totalPending: tPending + pPending,
    totalApproved: tApproved + pApproved,
    totalRejected: tRejected + pRejected,
    toolsPending: tPending,
    productsPending: pPending,
    totalAll: tTotal + pTotal,
  }

  // 2. Build Tool Query
  const toolConditions: any[] = []
  if (status && status !== "all") {
    toolConditions.push(eq(tools.status, status))
  }
  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`
    toolConditions.push(
      or(
        ilike(tools.name, pattern),
        ilike(tools.tagline, pattern),
        ilike(tools.description, pattern),
        ilike(tools.slug, pattern),
        ilike(users.email, pattern),
        ilike(users.name, pattern),
        ilike(users.username, pattern)
      )
    )
  }

  // 3. Build Product Query
  const productConditions: any[] = []
  if (status && status !== "all") {
    productConditions.push(eq(products.status, status))
  }
  if (search && search.trim()) {
    const pattern = `%${search.trim()}%`
    productConditions.push(
      or(
        ilike(products.name, pattern),
        ilike(products.tagline, pattern),
        ilike(products.description, pattern),
        ilike(products.slug, pattern),
        ilike(users.email, pattern),
        ilike(users.name, pattern),
        ilike(users.username, pattern)
      )
    )
  }

  const queries: Promise<AdminSubmissionItem[]>[] = []

  if (itemType === "all" || itemType === "tool") {
    const toolQuery = db
      .select({
        id: tools.id,
        slug: tools.slug,
        name: tools.name,
        tagline: tools.tagline,
        description: tools.description,
        websiteUrl: tools.websiteUrl,
        logoUrl: tools.logoUrl,
        images: tools.images,
        demoVideoUrl: tools.demoVideoUrl,
        categoryId: tools.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        tags: tools.tags,
        platforms: tools.platforms,
        pricing: tools.pricing,
        tier: tools.tier,
        status: tools.status,
        problemStatement: tools.problemStatement,
        solution: tools.solution,
        uniqueValue: tools.uniqueValue,
        githubUrl: tools.githubUrl,
        twitterUrl: tools.twitterUrl,
        linkedinUrl: tools.linkedinUrl,
        discordUrl: tools.discordUrl,
        appStoreUrl: tools.appStoreUrl,
        playStoreUrl: tools.playStoreUrl,
        chromeExtensionUrl: tools.chromeExtensionUrl,
        useCases: tools.useCases,
        keywords: tools.keywords,
        targetAudience: tools.targetAudience,
        launchYear: tools.launchYear,
        launchWeek: tools.launchWeek,
        launchDate: tools.launchDate,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
        submitterId: tools.submitterId,
        submitterEmail: users.email,
        submitterName: users.name,
        submitterUsername: users.username,
        submitterAvatarUrl: users.avatarUrl,
        submitterCountry: users.country,
        upvotesCount: tools.upvotesCount,
        buildsCount: tools.buildsCount,
        commentsCount: tools.commentsCount,
        viewsCount: tools.viewsCount,
      })
      .from(tools)
      .leftJoin(users, eq(tools.submitterId, users.id))
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(toolConditions.length > 0 ? and(...toolConditions) : undefined)

    queries.push(
      toolQuery.then((rows) =>
        rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          itemType: "tool" as const,
          name: row.name,
          tagline: row.tagline,
          description: row.description,
          websiteUrl: row.websiteUrl,
          logoUrl: row.logoUrl,
          images: row.images ?? [],
          demoVideoUrl: row.demoVideoUrl,
          category: row.categoryName,
          categoryId: row.categoryId,
          categorySlug: row.categorySlug,
          tags: row.tags ?? [],
          platforms: (row.platforms ?? []) as string[],
          pricing: row.pricing as Pricing,
          tier: row.tier as Tier,
          status: row.status as "pending" | "approved" | "rejected",
          problemStatement: row.problemStatement,
          solution: row.solution,
          uniqueValue: row.uniqueValue,
          githubUrl: row.githubUrl,
          twitterUrl: row.twitterUrl,
          linkedinUrl: row.linkedinUrl,
          discordUrl: row.discordUrl,
          appStoreUrl: row.appStoreUrl,
          playStoreUrl: row.playStoreUrl,
          chromeExtensionUrl: row.chromeExtensionUrl,
          useCases: row.useCases,
          keywords: row.keywords,
          targetAudience: row.targetAudience,
          launchYear: row.launchYear,
          launchWeek: row.launchWeek,
          launchDate: row.launchDate,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          submitterId: row.submitterId,
          submitterEmail: row.submitterEmail,
          submitterName: row.submitterName,
          submitterUsername: row.submitterUsername,
          submitterAvatarUrl: row.submitterAvatarUrl,
          submitterCountry: row.submitterCountry,
          metrics: {
            votesOrLikes: row.upvotesCount ?? 0,
            buildsCount: row.buildsCount ?? 0,
            commentsCount: row.commentsCount ?? 0,
            viewsCount: row.viewsCount ?? 0,
          },
        }))
      )
    )
  }

  if (itemType === "all" || itemType === "product") {
    const productQuery = db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        tagline: products.tagline,
        description: products.description,
        websiteUrl: products.websiteUrl,
        logoUrl: products.logoUrl,
        images: products.images,
        demoVideoUrl: products.demoVideoUrl,
        categoryId: products.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        tags: products.tags,
        platforms: products.platforms,
        pricing: products.pricing,
        tier: products.tier,
        status: products.status,
        problemStatement: products.problemStatement,
        solution: products.solution,
        uniqueValue: products.uniqueValue,
        githubUrl: products.githubUrl,
        twitterUrl: products.twitterUrl,
        linkedinUrl: products.linkedinUrl,
        discordUrl: products.discordUrl,
        appStoreUrl: products.appStoreUrl,
        playStoreUrl: products.playStoreUrl,
        chromeExtensionUrl: products.chromeExtensionUrl,
        useCases: products.useCases,
        keywords: products.keywords,
        targetAudience: products.targetAudience,
        launchYear: products.launchYear,
        launchWeek: products.launchWeek,
        launchDate: products.launchDate,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        submitterId: products.submitterId,
        submitterEmail: users.email,
        submitterName: users.name,
        submitterUsername: users.username,
        submitterAvatarUrl: users.avatarUrl,
        submitterCountry: users.country,
        likesCount: products.likesCount,
        commentsCount: products.commentsCount,
        viewsCount: products.viewsCount,
      })
      .from(products)
      .leftJoin(users, eq(products.submitterId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(
        productConditions.length > 0 ? and(...productConditions) : undefined
      )

    queries.push(
      productQuery.then((rows) =>
        rows.map((row) => ({
          id: row.id,
          slug: row.slug,
          itemType: "product" as const,
          name: row.name,
          tagline: row.tagline,
          description: row.description,
          websiteUrl: row.websiteUrl,
          logoUrl: row.logoUrl,
          images: row.images ?? [],
          demoVideoUrl: row.demoVideoUrl,
          category: row.categoryName,
          categoryId: row.categoryId,
          categorySlug: row.categorySlug,
          tags: row.tags ?? [],
          platforms: (row.platforms ?? []) as string[],
          pricing: row.pricing as Pricing,
          tier: row.tier as Tier,
          status: row.status as "pending" | "approved" | "rejected",
          problemStatement: row.problemStatement,
          solution: row.solution,
          uniqueValue: row.uniqueValue,
          githubUrl: row.githubUrl,
          twitterUrl: row.twitterUrl,
          linkedinUrl: row.linkedinUrl,
          discordUrl: row.discordUrl,
          appStoreUrl: row.appStoreUrl,
          playStoreUrl: row.playStoreUrl,
          chromeExtensionUrl: row.chromeExtensionUrl,
          useCases: row.useCases,
          keywords: row.keywords,
          targetAudience: row.targetAudience,
          launchYear: row.launchYear,
          launchWeek: row.launchWeek,
          launchDate: row.launchDate,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          submitterId: row.submitterId,
          submitterEmail: row.submitterEmail,
          submitterName: row.submitterName,
          submitterUsername: row.submitterUsername,
          submitterAvatarUrl: row.submitterAvatarUrl,
          submitterCountry: row.submitterCountry,
          metrics: {
            votesOrLikes: row.likesCount ?? 0,
            commentsCount: row.commentsCount ?? 0,
            viewsCount: row.viewsCount ?? 0,
          },
        }))
      )
    )
  }

  const results = await Promise.all(queries)
  const combined = results.flat()

  // Sort items
  if (sortBy === "name") {
    combined.sort((a, b) => a.name.localeCompare(b.name))
  } else {
    combined.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  const totalCount = combined.length
  const totalPages = Math.ceil(totalCount / safeLimit) || 1
  const offset = (safePage - 1) * safeLimit
  const paginatedItems = combined.slice(offset, offset + safeLimit)

  return {
    items: paginatedItems,
    stats,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalCount,
      totalPages,
    },
  }
}

export const getAdminSubmissionById = async (
  type: "tool" | "product",
  id: string
): Promise<AdminSubmissionItem | null> => {
  if (type === "tool") {
    const [row] = await db
      .select({
        id: tools.id,
        slug: tools.slug,
        name: tools.name,
        tagline: tools.tagline,
        description: tools.description,
        websiteUrl: tools.websiteUrl,
        logoUrl: tools.logoUrl,
        images: tools.images,
        demoVideoUrl: tools.demoVideoUrl,
        categoryId: tools.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
        tags: tools.tags,
        platforms: tools.platforms,
        pricing: tools.pricing,
        tier: tools.tier,
        status: tools.status,
        problemStatement: tools.problemStatement,
        solution: tools.solution,
        uniqueValue: tools.uniqueValue,
        githubUrl: tools.githubUrl,
        twitterUrl: tools.twitterUrl,
        linkedinUrl: tools.linkedinUrl,
        discordUrl: tools.discordUrl,
        appStoreUrl: tools.appStoreUrl,
        playStoreUrl: tools.playStoreUrl,
        chromeExtensionUrl: tools.chromeExtensionUrl,
        useCases: tools.useCases,
        keywords: tools.keywords,
        targetAudience: tools.targetAudience,
        launchYear: tools.launchYear,
        launchWeek: tools.launchWeek,
        launchDate: tools.launchDate,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
        submitterId: tools.submitterId,
        submitterEmail: users.email,
        submitterName: users.name,
        submitterUsername: users.username,
        submitterAvatarUrl: users.avatarUrl,
        submitterCountry: users.country,
        upvotesCount: tools.upvotesCount,
        buildsCount: tools.buildsCount,
        commentsCount: tools.commentsCount,
        viewsCount: tools.viewsCount,
      })
      .from(tools)
      .leftJoin(users, eq(tools.submitterId, users.id))
      .leftJoin(categories, eq(tools.categoryId, categories.id))
      .where(eq(tools.id, id))
      .limit(1)

    if (!row) return null

    return {
      id: row.id,
      slug: row.slug,
      itemType: "tool",
      name: row.name,
      tagline: row.tagline,
      description: row.description,
      websiteUrl: row.websiteUrl,
      logoUrl: row.logoUrl,
      images: row.images ?? [],
      demoVideoUrl: row.demoVideoUrl,
      category: row.categoryName,
      categoryId: row.categoryId,
      categorySlug: row.categorySlug,
      tags: row.tags ?? [],
      platforms: (row.platforms ?? []) as string[],
      pricing: row.pricing as Pricing,
      tier: row.tier as Tier,
      status: row.status as "pending" | "approved" | "rejected",
      problemStatement: row.problemStatement,
      solution: row.solution,
      uniqueValue: row.uniqueValue,
      githubUrl: row.githubUrl,
      twitterUrl: row.twitterUrl,
      linkedinUrl: row.linkedinUrl,
      discordUrl: row.discordUrl,
      appStoreUrl: row.appStoreUrl,
      playStoreUrl: row.playStoreUrl,
      chromeExtensionUrl: row.chromeExtensionUrl,
      useCases: row.useCases,
      keywords: row.keywords,
      targetAudience: row.targetAudience,
      launchYear: row.launchYear,
      launchWeek: row.launchWeek,
      launchDate: row.launchDate,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      submitterId: row.submitterId,
      submitterEmail: row.submitterEmail,
      submitterName: row.submitterName,
      submitterUsername: row.submitterUsername,
      submitterAvatarUrl: row.submitterAvatarUrl,
      submitterCountry: row.submitterCountry,
      metrics: {
        votesOrLikes: row.upvotesCount ?? 0,
        buildsCount: row.buildsCount ?? 0,
        commentsCount: row.commentsCount ?? 0,
        viewsCount: row.viewsCount ?? 0,
      },
    }
  }

  const [row] = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      description: products.description,
      websiteUrl: products.websiteUrl,
      logoUrl: products.logoUrl,
      images: products.images,
      demoVideoUrl: products.demoVideoUrl,
      categoryId: products.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      tags: products.tags,
      platforms: products.platforms,
      pricing: products.pricing,
      tier: products.tier,
      status: products.status,
      problemStatement: products.problemStatement,
      solution: products.solution,
      uniqueValue: products.uniqueValue,
      githubUrl: products.githubUrl,
      twitterUrl: products.twitterUrl,
      linkedinUrl: products.linkedinUrl,
      discordUrl: products.discordUrl,
      appStoreUrl: products.appStoreUrl,
      playStoreUrl: products.playStoreUrl,
      chromeExtensionUrl: products.chromeExtensionUrl,
      useCases: products.useCases,
      keywords: products.keywords,
      targetAudience: products.targetAudience,
      launchYear: products.launchYear,
      launchWeek: products.launchWeek,
      launchDate: products.launchDate,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      submitterId: products.submitterId,
      submitterEmail: users.email,
      submitterName: users.name,
      submitterUsername: users.username,
      submitterAvatarUrl: users.avatarUrl,
      submitterCountry: users.country,
      likesCount: products.likesCount,
      commentsCount: products.commentsCount,
      viewsCount: products.viewsCount,
    })
    .from(products)
    .leftJoin(users, eq(products.submitterId, users.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1)

  if (!row) return null

  return {
    id: row.id,
    slug: row.slug,
    itemType: "product",
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    websiteUrl: row.websiteUrl,
    logoUrl: row.logoUrl,
    images: row.images ?? [],
    demoVideoUrl: row.demoVideoUrl,
    category: row.categoryName,
    categoryId: row.categoryId,
    categorySlug: row.categorySlug,
    tags: row.tags ?? [],
    platforms: (row.platforms ?? []) as string[],
    pricing: row.pricing as Pricing,
    tier: row.tier as Tier,
    status: row.status as "pending" | "approved" | "rejected",
    problemStatement: row.problemStatement,
    solution: row.solution,
    uniqueValue: row.uniqueValue,
    githubUrl: row.githubUrl,
    twitterUrl: row.twitterUrl,
    linkedinUrl: row.linkedinUrl,
    discordUrl: row.discordUrl,
    appStoreUrl: row.appStoreUrl,
    playStoreUrl: row.playStoreUrl,
    chromeExtensionUrl: row.chromeExtensionUrl,
    useCases: row.useCases,
    keywords: row.keywords,
    targetAudience: row.targetAudience,
    launchYear: row.launchYear,
    launchWeek: row.launchWeek,
    launchDate: row.launchDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    submitterId: row.submitterId,
    submitterEmail: row.submitterEmail,
    submitterName: row.submitterName,
    submitterUsername: row.submitterUsername,
    submitterAvatarUrl: row.submitterAvatarUrl,
    submitterCountry: row.submitterCountry,
    metrics: {
      votesOrLikes: row.likesCount ?? 0,
      commentsCount: row.commentsCount ?? 0,
      viewsCount: row.viewsCount ?? 0,
    },
  }
}

export const updateAdminSubmissionStatus = async (
  type: "tool" | "product",
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
  const table = type === "tool" ? tools : products
  const now = new Date()

  const [updated] = await db
    .update(table)
    .set({
      status,
      updatedAt: now,
    })
    .where(eq(table.id, id))
    .returning()

  if (!updated) {
    throw new Error(`${type} with id "${id}" not found.`)
  }

  // Synchronize launches status
  if (type === "tool") {
    await db
      .update(launches)
      .set({ status, updatedAt: now })
      .where(eq(launches.toolId, id))
  } else {
    await db
      .update(launches)
      .set({ status, updatedAt: now })
      .where(eq(launches.productId, id))
  }

  return updated
}

export const bulkUpdateAdminSubmissionStatus = async (
  items: Array<{
    type: "tool" | "product"
    id: string
    status: "pending" | "approved" | "rejected"
  }>
) => {
  const results = await Promise.all(
    items.map((item) =>
      updateAdminSubmissionStatus(item.type, item.id, item.status)
    )
  )
  return results
}

export type AdminUpdateSubmissionData = {
  name?: string
  tagline?: string
  description?: string
  websiteUrl?: string
  logoUrl?: string | null
  images?: string[]
  demoVideoUrl?: string | null
  category?: string | null
  tags?: string[]
  platforms?: any[]
  pricing?: Pricing
  tier?: Tier
  status?: "pending" | "approved" | "rejected"
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
  useCases?: string | null
  keywords?: string | null
  targetAudience?: string | null
  launchYear?: number | null
  launchWeek?: number | null
}

export const updateAdminSubmissionDetails = async (
  type: "tool" | "product",
  id: string,
  data: AdminUpdateSubmissionData
) => {
  const table = type === "tool" ? tools : products
  const now = new Date()

  let categoryId: string | null | undefined = undefined
  if (data.category !== undefined) {
    if (data.category && data.category.trim()) {
      categoryId = await getOrCreateCategory(data.category)
    } else {
      categoryId = null
    }
  }

  let launchDate: Date | undefined = undefined
  if (data.launchYear && data.launchWeek) {
    const range = getISOWeekRange(data.launchYear, data.launchWeek)
    launchDate = range.startDate
  }

  const updateFields: Record<string, any> = {
    updatedAt: now,
  }

  if (data.name !== undefined) updateFields.name = data.name.trim()
  if (data.tagline !== undefined) updateFields.tagline = data.tagline.trim()
  if (data.description !== undefined)
    updateFields.description = data.description.trim()
  if (data.websiteUrl !== undefined)
    updateFields.websiteUrl = data.websiteUrl.trim()
  if (data.logoUrl !== undefined) updateFields.logoUrl = data.logoUrl
  if (data.images !== undefined) updateFields.images = data.images
  if (data.demoVideoUrl !== undefined)
    updateFields.demoVideoUrl = data.demoVideoUrl?.trim() || null
  if (categoryId !== undefined) updateFields.categoryId = categoryId
  if (data.tags !== undefined) updateFields.tags = data.tags
  if (data.platforms !== undefined) updateFields.platforms = data.platforms
  if (data.pricing !== undefined) updateFields.pricing = data.pricing
  if (data.tier !== undefined) updateFields.tier = data.tier
  if (data.status !== undefined) updateFields.status = data.status
  if (data.problemStatement !== undefined)
    updateFields.problemStatement = data.problemStatement?.trim() || null
  if (data.solution !== undefined)
    updateFields.solution = data.solution?.trim() || null
  if (data.uniqueValue !== undefined)
    updateFields.uniqueValue = data.uniqueValue?.trim() || null
  if (data.githubUrl !== undefined)
    updateFields.githubUrl = data.githubUrl?.trim() || null
  if (data.twitterUrl !== undefined)
    updateFields.twitterUrl = data.twitterUrl?.trim() || null
  if (data.linkedinUrl !== undefined)
    updateFields.linkedinUrl = data.linkedinUrl?.trim() || null
  if (data.discordUrl !== undefined)
    updateFields.discordUrl = data.discordUrl?.trim() || null
  if (data.appStoreUrl !== undefined)
    updateFields.appStoreUrl = data.appStoreUrl?.trim() || null
  if (data.playStoreUrl !== undefined)
    updateFields.playStoreUrl = data.playStoreUrl?.trim() || null
  if (data.chromeExtensionUrl !== undefined)
    updateFields.chromeExtensionUrl = data.chromeExtensionUrl?.trim() || null
  if (data.useCases !== undefined)
    updateFields.useCases = data.useCases?.trim() || null
  if (data.keywords !== undefined)
    updateFields.keywords = data.keywords?.trim() || null
  if (data.targetAudience !== undefined)
    updateFields.targetAudience = data.targetAudience?.trim() || null
  if (data.launchYear !== undefined) updateFields.launchYear = data.launchYear
  if (data.launchWeek !== undefined) updateFields.launchWeek = data.launchWeek
  if (launchDate !== undefined) updateFields.launchDate = launchDate

  const [updated] = await db
    .update(table)
    .set(updateFields)
    .where(eq(table.id, id))
    .returning()

  if (!updated) {
    throw new Error(`${type} with id "${id}" not found.`)
  }

  // Update launches row if launch or status or tier changed
  const launchUpdate: Record<string, any> = { updatedAt: now }
  if (data.status !== undefined) launchUpdate.status = data.status
  if (data.tier !== undefined) launchUpdate.tier = data.tier
  if (data.launchYear !== undefined && data.launchYear !== null)
    launchUpdate.isoYear = data.launchYear
  if (data.launchWeek !== undefined && data.launchWeek !== null)
    launchUpdate.isoWeek = data.launchWeek
  if (data.launchYear && data.launchWeek) {
    const range = getISOWeekRange(data.launchYear, data.launchWeek)
    launchUpdate.startDate = range.startDate
    launchUpdate.endDate = range.endDate
  }

  if (Object.keys(launchUpdate).length > 1) {
    if (type === "tool") {
      await db
        .update(launches)
        .set(launchUpdate)
        .where(eq(launches.toolId, id))
    } else {
      await db
        .update(launches)
        .set(launchUpdate)
        .where(eq(launches.productId, id))
    }
  }

  return getAdminSubmissionById(type, id)
}

export const deleteAdminSubmission = async (
  type: "tool" | "product",
  id: string
) => {
  const table = type === "tool" ? tools : products
  const [deleted] = await db
    .delete(table)
    .where(eq(table.id, id))
    .returning()

  if (!deleted) {
    throw new Error(`${type} with id "${id}" not found.`)
  }

  return deleted
}
