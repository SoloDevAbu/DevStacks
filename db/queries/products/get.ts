import { db } from "@/db"
import { products, users } from "@/db/schema"
import { eq, sql } from "drizzle-orm"

export const getProductBySlug = async (slug: string) => {
  const [product] = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      tagline: products.tagline,
      description: products.description,
      problemStatement: products.problemStatement,
      solution: products.solution,
      uniqueValue: products.uniqueValue,
      websiteUrl: products.websiteUrl,
      logoUrl: products.logoUrl,
      githubUrl: products.githubUrl,
      twitterUrl: products.twitterUrl,
      linkedinUrl: products.linkedinUrl,
      discordUrl: products.discordUrl,
      keywords: products.keywords,
      targetAudience: products.targetAudience,
      metaTitle: products.metaTitle,
      metaDescription: products.metaDescription,
      aiContext: products.aiContext,
      geoTarget: products.geoTarget,
      asoCategory: products.asoCategory,
      category: products.category,
      tags: products.tags,
      platforms: products.platforms,
      pricing: products.pricing,
      tier: products.tier,
      status: products.status,
      upvotesCount: products.upvotesCount,
      buildsCount: products.buildsCount,
      commentsCount: products.commentsCount,
      viewsCount: products.viewsCount,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      submitter: {
        id: users.id,
        name: users.name,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(products)
    .leftJoin(users, eq(products.submitterId, users.id))
    .where(eq(products.slug, slug))
    .limit(1)

  if (!product) return null

  // Increment view count (fire-and-forget)
  db.update(products)
    .set({ viewsCount: sql`${products.viewsCount} + 1` })
    .where(eq(products.slug, slug))
    .catch(() => {})

  return product
}
