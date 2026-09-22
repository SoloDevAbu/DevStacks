import type { Tier, Pricing } from "@/constants/plans"
import type { LucideIcon } from "lucide-react"

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
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
  freshnessDaysLeft?: number
  platforms?: string[]
  submitterId?: string | null
  submitterName?: string | null
  submitterUsername?: string | null
  submitterCountry?: string | null
  submitterAvatarUrl?: string | null
  images?: string[]
  demoVideoUrl?: string | null
  useCases?: string | null
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  description?: string | null
  status?: string
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
  githubUrl?: string | null
  twitterUrl?: string | null
  linkedinUrl?: string | null
  discordUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
  builtWithTools?: ProductBuiltWith[]
  freshnessDaysLeft?: number
  platforms?: string[]
  submitterId?: string | null
  submitterName?: string | null
  submitterUsername?: string | null
  submitterCountry?: string | null
  submitterAvatarUrl?: string | null
  images?: string[]
  demoVideoUrl?: string | null
  useCases?: string | null
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  description?: string | null
  status?: string
  createdAt?: Date
  updatedAt?: Date
}

export type EntityItem = DbTool | DbProduct

export type MakerFaqItem = {
  id: string
  question: string
  answer: string
  sortOrder: number
}

export type MakerProfile = {
  id: string
  name: string
  email?: string
  username: string
  avatarUrl?: string | null
  image?: string | null
  bio?: string | null
  description?: string | null
  country?: string | null
  state?: string | null
  websiteUrl?: string | null
  twitterUrl?: string | null
  githubUrl?: string | null
  linkedinUrl?: string | null
  createdAt: Date
  faqs: MakerFaqItem[]
  tools: DbTool[]
  products: DbProduct[]
  toolsCount: number
  productsCount: number
}

export type UserDashboardComment = {
  id: string
  body: string
  createdAt: Date
  targetKind: "tool" | "product"
  targetName: string
  targetSlug: string
  authorName?: string | null
  authorUsername?: string | null
  authorImage?: string | null
}

export type UserDashboardData = {
  tools: DbTool[]
  products: DbProduct[]
  comments: UserDashboardComment[]
  stats: {
    totalTools: number
    totalProducts: number
    totalUpvotesAndLikes: number
    totalComments: number
    totalViews: number
    totalBuilds: number
  }
}

export type Stat = {
  label: string
  value: string
  icon: LucideIcon | React.ComponentType<{ className?: string }>
  color: string
}


