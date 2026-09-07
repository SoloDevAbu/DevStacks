import { db } from "@/db"
import { products } from "@/db/schema"
import { eq } from "drizzle-orm"
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
  createdAt?: Date | null
  updatedAt?: Date | null
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
      }
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
    const allProducts = await db
      .select()
      .from(products)
      .where(eq(products.status, "approved"))
      .limit(100)

    const normalizedSlug = toolSlug.toLowerCase()
    const normalizedName = toolName?.toLowerCase()

    const matching = allProducts.filter((p) => {
      const toolsList = p.builtWithTools ?? []
      return toolsList.some(
        (t) =>
          (t.toolSlug && t.toolSlug.toLowerCase() === normalizedSlug) ||
          (normalizedName && t.name.toLowerCase() === normalizedName)
      )
    })

    return matching.slice(0, limit) as unknown as DbProduct[]
  } catch {
    return []
  }
}
