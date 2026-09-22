import { db } from "@/db"
import { tools, categories, externalLinkVisits } from "@/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import type { DbTool } from "@/types/entities"

export interface UserDashboardTool extends DbTool {
  externalVisitsCount: number
}

export const getUserTools = async (
  userId: string
): Promise<UserDashboardTool[]> => {
  const userTools = await db
    .select({
      id: tools.id,
      slug: tools.slug,
      name: tools.name,
      tagline: tools.tagline,
      description: tools.description,
      problemStatement: tools.problemStatement,
      solution: tools.solution,
      uniqueValue: tools.uniqueValue,
      tags: tools.tags,
      platforms: tools.platforms,
      upvotesCount: tools.upvotesCount,
      buildsCount: tools.buildsCount,
      commentsCount: tools.commentsCount,
      viewsCount: tools.viewsCount,
      pricing: tools.pricing,
      tier: tools.tier,
      status: tools.status,
      logoUrl: tools.logoUrl,
      websiteUrl: tools.websiteUrl,
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
      categoryId: tools.categoryId,
      category: categories.name,
      categorySlug: categories.slug,
      submitterId: tools.submitterId,
      createdAt: tools.createdAt,
      updatedAt: tools.updatedAt,
    })
    .from(tools)
    .leftJoin(categories, eq(tools.categoryId, categories.id))
    .where(eq(tools.submitterId, userId))
    .orderBy(desc(tools.createdAt))

  const toolIds = userTools.map((t) => t.id)

  const visits =
    toolIds.length > 0
      ? await db
          .select({
            toolId: externalLinkVisits.toolId,
          })
          .from(externalLinkVisits)
          .where(inArray(externalLinkVisits.toolId, toolIds))
      : []

  const visitCounts = new Map<string, number>()
  for (const v of visits) {
    if (v.toolId) {
      visitCounts.set(v.toolId, (visitCounts.get(v.toolId) || 0) + 1)
    }
  }

  return userTools.map((t) => ({
    ...(t as unknown as DbTool),
    externalVisitsCount: visitCounts.get(t.id) || 0,
  }))
}
