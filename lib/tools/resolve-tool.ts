import { db } from "@/db"
import { products, productTools, tools, categories } from "@/db/schema"
import { and, eq, ilike, or } from "drizzle-orm"
import { getToolBySlug } from "@/db/queries/tools/get"
import type { DbTool, DbProduct } from "@/types/entities"

export interface FullTool extends DbTool {
  description: string
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  keywords?: string | null
  targetAudience?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  aiContext?: string | null
  geoTarget?: string | null
  asoCategory?: string | null
  platforms: string[]
  createdAt?: Date
  updatedAt?: Date
}

export const resolveTool = async (slug: string): Promise<FullTool | null> => {
  try {
    const dbTool = await getToolBySlug(slug)
    if (dbTool) {
      return {
        ...dbTool,
        pricing: dbTool.pricing as FullTool["pricing"],
        tier: dbTool.tier as FullTool["tier"],
        platforms: dbTool.platforms ?? [],
        tags: dbTool.tags ?? [],
      } as FullTool
    }
  } catch {
    return null
  }

  return null
}

export const getProductsBuiltWithTool = async (
  toolSlug: string,
  toolName?: string,
  limit = 10
): Promise<DbProduct[]> => {
  try {
    const conditions = [eq(products.status, "approved")]

    if (toolName && toolName.trim()) {
      conditions.push(
        or(eq(tools.slug, toolSlug), ilike(productTools.name, toolName.trim()))!
      )
    } else {
      conditions.push(eq(tools.slug, toolSlug))
    }

    const rows = await db
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
        categoryId: products.categoryId,
        category: categories.name,
        categorySlug: categories.slug,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .innerJoin(productTools, eq(products.id, productTools.productId))
      .leftJoin(tools, eq(productTools.toolId, tools.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .limit(limit)

    return rows as unknown as DbProduct[]
  } catch {
    return []
  }
}
