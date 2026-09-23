import { db } from "@/db"
import { products, categories, externalLinkVisits } from "@/db/schema"
import { eq, desc, inArray } from "drizzle-orm"
import type { DbProduct } from "@/types/entities"

export interface UserDashboardProduct extends DbProduct {
  externalVisitsCount: number
}

export const getUserProducts = async (
  userId: string
): Promise<UserDashboardProduct[]> => {
  const userProducts = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      description: products.description,
      problemStatement: products.problemStatement,
      solution: products.solution,
      uniqueValue: products.uniqueValue,
      tags: products.tags,
      platforms: products.platforms,
      likesCount: products.likesCount,
      commentsCount: products.commentsCount,
      viewsCount: products.viewsCount,
      pricing: products.pricing,
      tier: products.tier,
      status: products.status,
      logoUrl: products.logoUrl,
      websiteUrl: products.websiteUrl,
      githubUrl: products.githubUrl,
      twitterUrl: products.twitterUrl,
      linkedinUrl: products.linkedinUrl,
      discordUrl: products.discordUrl,
      appStoreUrl: products.appStoreUrl,
      playStoreUrl: products.playStoreUrl,
      chromeExtensionUrl: products.chromeExtensionUrl,
      images: products.images,
      demoVideoUrl: products.demoVideoUrl,
      useCases: products.useCases,
      categoryId: products.categoryId,
      category: categories.name,
      categorySlug: categories.slug,
      submitterId: products.submitterId,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.submitterId, userId))
    .orderBy(desc(products.createdAt))

  const productIds = userProducts.map((p) => p.id)

  const visits =
    productIds.length > 0
      ? await db
          .select({
            productId: externalLinkVisits.productId,
          })
          .from(externalLinkVisits)
          .where(inArray(externalLinkVisits.productId, productIds))
      : []

  const visitCounts = new Map<string, number>()
  for (const v of visits) {
    if (v.productId) {
      visitCounts.set(v.productId, (visitCounts.get(v.productId) || 0) + 1)
    }
  }

  return userProducts.map((p) => ({
    ...(p as unknown as DbProduct),
    externalVisitsCount: visitCounts.get(p.id) || 0,
  }))
}
