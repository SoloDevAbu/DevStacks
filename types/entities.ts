import type { Tier, Pricing } from "@/constants/plans"

export type ProductBuiltWith = {
  name: string
  toolSlug?: string | null
  toolId?: string | null
}

export type DbTool = {
  id: string
  slug: string
  name: string
  tagline: string
  tags: string[]
  upvotesCount: number
  buildsCount: number
  commentsCount: number
  viewsCount: number
  pricing: Pricing
  tier: Tier
  logoUrl?: string | null
  category?: string | null
  categoryId?: string | null
  categorySlug?: string | null
  websiteUrl?: string | null
  freshnessDaysLeft?: number
  platforms?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export type DbProduct = {
  id: string
  slug: string
  name: string
  tagline: string
  tags: string[]
  likesCount: number
  commentsCount: number
  viewsCount: number
  pricing: Pricing
  tier: Tier
  logoUrl?: string | null
  category?: string | null
  categoryId?: string | null
  categorySlug?: string | null
  websiteUrl?: string | null
  builtWithTools?: ProductBuiltWith[]
  freshnessDaysLeft?: number
  platforms?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export type EntityItem = DbTool | DbProduct
