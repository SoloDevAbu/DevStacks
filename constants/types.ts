import type { Tier, Pricing } from "@/constants/tiers"

export type Product = {
  id: string
  rank: number
  name: string
  tagline: string
  comments: number
  tags: string[]
  upvotes: number
  builds: number
  logo: {
    text: string
    bgColor: string
    textColor: string
    borderColor?: string
  }
}

export type DeveloperBuild = {
  name: string
  desc: string
  builtWith: string[]
  views: number
  likes: number
  logo: string
  logoBg: string
  tier: Tier
}

export type BuildingBlock = {
  name: string
  builds: number
  category: string
  logo: string
  logoBg: string
  tier: Tier
}

export type RecentItem = {
  name: string
  desc: string
  category: string
  logo: string
  logoBg: string
  tier: Tier
}

export type Category = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export type Stat = {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}
