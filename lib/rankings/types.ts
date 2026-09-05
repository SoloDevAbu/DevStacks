import type { Product } from "@/db/schema"

export type RankingOptions = {
  limit?: number
  page?: number
}

export type RankedProduct = Product & {
  score?: number
  freshnessDaysLeft?: number
  builtWith?: { name: string; slug?: string }[]
}

export type TimeframeOption = "today" | "this-week" | "this-month" | "all-time"
