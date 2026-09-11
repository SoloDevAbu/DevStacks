import { db } from "@/db"
import { products, users, categories, productTools, tools } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import type { ProductBuiltWith } from "@/types/entities"

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
      tags: products.tags,
      platforms: products.platforms,
      pricing: products.pricing,
      tier: products.tier,
      status: products.status,
      likesCount: products.likesCount,
      commentsCount: products.commentsCount,
      viewsCount: products.viewsCount,
      categoryId: products.categoryId,
      category: categories.name,
      categorySlug: categories.slug,
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
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1)

  if (!product) return null

  // Fetch built with tools
  const toolsData = await db
    .select({
      name: productTools.name,
      toolId: productTools.toolId,
      toolSlug: tools.slug,
    })
    .from(productTools)
    .leftJoin(tools, eq(productTools.toolId, tools.id))
    .where(eq(productTools.productId, product.id))

  const builtWithTools: ProductBuiltWith[] = toolsData.map((t) => ({
    name: t.name,
    toolSlug: t.toolSlug ?? null,
    toolId: t.toolId ?? null,
  }))

  // Increment view count (fire-and-forget)
  db.update(products)
    .set({ viewsCount: sql`${products.viewsCount} + 1` })
    .where(eq(products.slug, slug))
    .catch(() => {})

  return {
    ...product,
    builtWithTools,
  }
}
