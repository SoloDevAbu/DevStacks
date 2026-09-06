import type { Tool, Product } from "@/db/schema"

export type RankingOptions = {
  limit?: number
  page?: number
}

export type RankedTool = Tool & {
  score?: number
  freshnessDaysLeft?: number
  itemKind: "tool"
}

export type RankedProduct = Product & {
  score?: number
  freshnessDaysLeft?: number
  itemKind: "product"
}

export type RankedItem = RankedTool | RankedProduct

export type TimeframeOption = "today" | "this-week" | "this-month" | "all-time"
