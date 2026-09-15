import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { and, desc, eq, gte, sql } from "drizzle-orm"
import {
  DISCOVERY_WINDOW_DAYS,
  NEW_AND_RISING_WEIGHTS,
} from "@/constants/rankings"
import type { RankedItem, RankingOptions } from "./types"

export const calculateNewAndRisingScore = (
  createdAt: Date,
  activityCount: number,
  commentsCount: number,
  viewsCount: number,
  now = new Date()
) => {
  const ageMs = Math.max(0, now.getTime() - createdAt.getTime())
  const ageDays = ageMs / (1000 * 60 * 60 * 24)
  const ageHours = ageMs / (1000 * 60 * 60)

  const freshnessRatio = Math.max(0, 1 - ageDays / DISCOVERY_WINDOW_DAYS)
  const freshnessScore =
    freshnessRatio * NEW_AND_RISING_WEIGHTS.freshnessMaxScore

  const rawActivity =
    activityCount * NEW_AND_RISING_WEIGHTS.upvotesWeight +
    commentsCount * NEW_AND_RISING_WEIGHTS.commentsWeight +
    viewsCount * NEW_AND_RISING_WEIGHTS.viewsWeight

  const velocity = rawActivity / Math.pow(ageHours + 1, 0.5)
  const score = Math.round((freshnessScore + velocity) * 10) / 10

  const freshnessDaysLeft = Math.max(
    0,
    Math.ceil(DISCOVERY_WINDOW_DAYS - ageDays)
  )

  return { score, freshnessDaysLeft }
}

export const getNewAndRisingProducts = async ({
  limit = 10,
  page = 1,
}: RankingOptions = {}): Promise<RankedItem[]> => {
  const safeLimit = Math.min(50, Math.max(1, limit))
  const safePage = Math.max(1, page)
  const offset = (safePage - 1) * safeLimit
  const fetchLimit = safeLimit * safePage

  const now = new Date()
  const windowStartDate = new Date(
    now.getTime() - DISCOVERY_WINDOW_DAYS * 24 * 60 * 60 * 1000
  )

  const toolScoreSql = sql<number>`
    ROUND(
      (
        GREATEST(0.0, 1.0 - (EXTRACT(EPOCH FROM (NOW() - ${tools.createdAt})) / (86400.0 * ${DISCOVERY_WINDOW_DAYS}))) * ${NEW_AND_RISING_WEIGHTS.freshnessMaxScore}
        +
        (
          ${tools.upvotesCount} * ${NEW_AND_RISING_WEIGHTS.upvotesWeight} +
          ${tools.commentsCount} * ${NEW_AND_RISING_WEIGHTS.commentsWeight} +
          ${tools.viewsCount} * ${NEW_AND_RISING_WEIGHTS.viewsWeight}
        )
        /
        SQRT(GREATEST(0.0, EXTRACT(EPOCH FROM (NOW() - ${tools.createdAt})) / 3600.0) + 1.0)
      )::numeric,
      1
    )
  `

  const productScoreSql = sql<number>`
    ROUND(
      (
        GREATEST(0.0, 1.0 - (EXTRACT(EPOCH FROM (NOW() - ${products.createdAt})) / (86400.0 * ${DISCOVERY_WINDOW_DAYS}))) * ${NEW_AND_RISING_WEIGHTS.freshnessMaxScore}
        +
        (
          ${products.likesCount} * ${NEW_AND_RISING_WEIGHTS.upvotesWeight} +
          ${products.commentsCount} * ${NEW_AND_RISING_WEIGHTS.commentsWeight} +
          ${products.viewsCount} * ${NEW_AND_RISING_WEIGHTS.viewsWeight}
        )
        /
        SQRT(GREATEST(0.0, EXTRACT(EPOCH FROM (NOW() - ${products.createdAt})) / 3600.0) + 1.0)
      )::numeric,
      1
    )
  `

  let [candidateTools, candidateProducts] = await Promise.all([
    db
      .select({
        id: tools.id,
        slug: tools.slug,
        submitterId: tools.submitterId,
        name: tools.name,
        tagline: tools.tagline,
        description: tools.description,
        problemStatement: tools.problemStatement,
        solution: tools.solution,
        uniqueValue: tools.uniqueValue,
        websiteUrl: tools.websiteUrl,
        logoUrl: tools.logoUrl,
        githubUrl: tools.githubUrl,
        twitterUrl: tools.twitterUrl,
        linkedinUrl: tools.linkedinUrl,
        discordUrl: tools.discordUrl,
        appStoreUrl: tools.appStoreUrl,
        playStoreUrl: tools.playStoreUrl,
        chromeExtensionUrl: tools.chromeExtensionUrl,
        images: tools.images,
        demoVideoUrl: tools.demoVideoUrl,
        useCases: tools.useCases,
        keywords: tools.keywords,
        targetAudience: tools.targetAudience,
        metaTitle: tools.metaTitle,
        metaDescription: tools.metaDescription,
        aiContext: tools.aiContext,
        geoTarget: tools.geoTarget,
        asoCategory: tools.asoCategory,
        categoryId: tools.categoryId,
        tags: tools.tags,
        platforms: tools.platforms,
        pricing: tools.pricing,
        tier: tools.tier,
        status: tools.status,
        upvotesCount: tools.upvotesCount,
        buildsCount: tools.buildsCount,
        commentsCount: tools.commentsCount,
        viewsCount: tools.viewsCount,
        createdAt: tools.createdAt,
        updatedAt: tools.updatedAt,
        score: toolScoreSql,
      })
      .from(tools)
      .where(
        and(eq(tools.status, "approved"), gte(tools.createdAt, windowStartDate))
      )
      .orderBy(desc(toolScoreSql), desc(tools.id))
      .limit(fetchLimit),
    db
      .select({
        id: products.id,
        slug: products.slug,
        submitterId: products.submitterId,
        name: products.name,
        tagline: products.tagline,
        description: products.description,
        websiteUrl: products.websiteUrl,
        logoUrl: products.logoUrl,
        githubUrl: products.githubUrl,
        twitterUrl: products.twitterUrl,
        linkedinUrl: products.linkedinUrl,
        discordUrl: products.discordUrl,
        appStoreUrl: products.appStoreUrl,
        playStoreUrl: products.playStoreUrl,
        chromeExtensionUrl: products.chromeExtensionUrl,
        images: products.images,
        demoVideoUrl: products.demoVideoUrl,
        keywords: products.keywords,
        targetAudience: products.targetAudience,
        metaTitle: products.metaTitle,
        metaDescription: products.metaDescription,
        aiContext: products.aiContext,
        geoTarget: products.geoTarget,
        asoCategory: products.asoCategory,
        categoryId: products.categoryId,
        tags: products.tags,
        platforms: products.platforms,
        pricing: products.pricing,
        tier: products.tier,
        status: products.status,
        likesCount: products.likesCount,
        commentsCount: products.commentsCount,
        viewsCount: products.viewsCount,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        score: productScoreSql,
      })
      .from(products)
      .where(
        and(
          eq(products.status, "approved"),
          gte(products.createdAt, windowStartDate)
        )
      )
      .orderBy(desc(productScoreSql), desc(products.id))
      .limit(fetchLimit),
  ])

  if (candidateTools.length === 0 && candidateProducts.length === 0) {
    ;[candidateTools, candidateProducts] = await Promise.all([
      db
        .select({
          id: tools.id,
          slug: tools.slug,
          submitterId: tools.submitterId,
          name: tools.name,
          tagline: tools.tagline,
          description: tools.description,
          problemStatement: tools.problemStatement,
          solution: tools.solution,
          uniqueValue: tools.uniqueValue,
          websiteUrl: tools.websiteUrl,
          logoUrl: tools.logoUrl,
          githubUrl: tools.githubUrl,
          twitterUrl: tools.twitterUrl,
          linkedinUrl: tools.linkedinUrl,
          discordUrl: tools.discordUrl,
          appStoreUrl: tools.appStoreUrl,
          playStoreUrl: tools.playStoreUrl,
          chromeExtensionUrl: tools.chromeExtensionUrl,
          images: tools.images,
          demoVideoUrl: tools.demoVideoUrl,
          useCases: tools.useCases,
          keywords: tools.keywords,
          targetAudience: tools.targetAudience,
          metaTitle: tools.metaTitle,
          metaDescription: tools.metaDescription,
          aiContext: tools.aiContext,
          geoTarget: tools.geoTarget,
          asoCategory: tools.asoCategory,
          categoryId: tools.categoryId,
          tags: tools.tags,
          platforms: tools.platforms,
          pricing: tools.pricing,
          tier: tools.tier,
          status: tools.status,
          upvotesCount: tools.upvotesCount,
          buildsCount: tools.buildsCount,
          commentsCount: tools.commentsCount,
          viewsCount: tools.viewsCount,
          createdAt: tools.createdAt,
          updatedAt: tools.updatedAt,
          score: toolScoreSql,
        })
        .from(tools)
        .where(eq(tools.status, "approved"))
        .orderBy(desc(toolScoreSql), desc(tools.id))
        .limit(fetchLimit),
      db
        .select({
          id: products.id,
          slug: products.slug,
          submitterId: products.submitterId,
          name: products.name,
          tagline: products.tagline,
          description: products.description,
          websiteUrl: products.websiteUrl,
          logoUrl: products.logoUrl,
          githubUrl: products.githubUrl,
          twitterUrl: products.twitterUrl,
          linkedinUrl: products.linkedinUrl,
          discordUrl: products.discordUrl,
          appStoreUrl: products.appStoreUrl,
          playStoreUrl: products.playStoreUrl,
          chromeExtensionUrl: products.chromeExtensionUrl,
          images: products.images,
          demoVideoUrl: products.demoVideoUrl,
          keywords: products.keywords,
          targetAudience: products.targetAudience,
          metaTitle: products.metaTitle,
          metaDescription: products.metaDescription,
          aiContext: products.aiContext,
          geoTarget: products.geoTarget,
          asoCategory: products.asoCategory,
          categoryId: products.categoryId,
          tags: products.tags,
          platforms: products.platforms,
          pricing: products.pricing,
          tier: products.tier,
          status: products.status,
          likesCount: products.likesCount,
          commentsCount: products.commentsCount,
          viewsCount: products.viewsCount,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          score: productScoreSql,
        })
        .from(products)
        .where(eq(products.status, "approved"))
        .orderBy(desc(productScoreSql), desc(products.id))
        .limit(fetchLimit),
    ])
  }

  const scored: RankedItem[] = [
    ...candidateTools.map((t) => {
      const ageDays = Math.max(
        0,
        (now.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      const freshnessDaysLeft = Math.max(
        0,
        Math.ceil(DISCOVERY_WINDOW_DAYS - ageDays)
      )
      return {
        ...t,
        itemKind: "tool" as const,
        score: Number(t.score) || 0,
        freshnessDaysLeft,
      }
    }),
    ...candidateProducts.map((p) => {
      const ageDays = Math.max(
        0,
        (now.getTime() - p.createdAt.getTime()) / (1000 * 60 * 60 * 24)
      )
      const freshnessDaysLeft = Math.max(
        0,
        Math.ceil(DISCOVERY_WINDOW_DAYS - ageDays)
      )
      return {
        ...p,
        itemKind: "product" as const,
        score: Number(p.score) || 0,
        freshnessDaysLeft,
      }
    }),
  ]

  scored.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  return scored.slice(offset, offset + safeLimit)
}

