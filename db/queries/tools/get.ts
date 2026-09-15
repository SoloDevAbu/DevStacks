import { db } from "@/db"
import { tools, categories, users } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getToolBySlug = async (slug: string) => {
  const [row] = await db
    .select({
      id: tools.id,
      slug: tools.slug,
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
      tags: tools.tags,
      platforms: tools.platforms,
      pricing: tools.pricing,
      tier: tools.tier,
      status: tools.status,
      upvotesCount: tools.upvotesCount,
      buildsCount: tools.buildsCount,
      commentsCount: tools.commentsCount,
      viewsCount: tools.viewsCount,
      categoryId: tools.categoryId,
      category: categories.name,
      categorySlug: categories.slug,
      submitterId: tools.submitterId,
      submitterName: users.name,
      submitterUsername: users.username,
      submitterCountry: users.country,
      submitterState: users.state,
      submitterAvatarUrl: users.avatarUrl,
      createdAt: tools.createdAt,
      updatedAt: tools.updatedAt,
    })
    .from(tools)
    .leftJoin(categories, eq(tools.categoryId, categories.id))
    .leftJoin(users, eq(tools.submitterId, users.id))
    .where(eq(tools.slug, slug))
    .limit(1)

  return row ?? null
}
