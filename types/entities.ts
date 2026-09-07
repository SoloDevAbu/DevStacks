import type { BuiltWithTool } from "@/db/schema"
import type { Tier, Pricing } from "@/constants/tiers"

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
  websiteUrl?: string | null
  freshnessDaysLeft?: number
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
  websiteUrl?: string | null
  builtWithTools?: BuiltWithTool[]
  freshnessDaysLeft?: number
}

export type EntityItem = DbTool | DbProduct
