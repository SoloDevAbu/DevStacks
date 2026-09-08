import { getProductBySlug } from "@/db/queries/products/get"
import type { DbProduct } from "@/types/entities"

export interface FullProduct extends DbProduct {
  description: string
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  websiteUrl: string
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

export const resolveProduct = async (
  slug: string
): Promise<FullProduct | null> => {
  try {
    const dbProduct = await getProductBySlug(slug)
    if (dbProduct) {
      return {
        ...dbProduct,
        pricing: dbProduct.pricing as FullProduct["pricing"],
        tier: dbProduct.tier as FullProduct["tier"],
        platforms: dbProduct.platforms ?? [],
        tags: dbProduct.tags ?? [],
      }
    }
  } catch {
    return null
  }

  return null
}
