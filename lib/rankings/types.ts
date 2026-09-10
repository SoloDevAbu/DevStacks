import type { DbTool, DbProduct } from "@/types/entities"

export type RankingOptions = {
  limit?: number
  page?: number
}

export type RankedTool = DbTool & {
  score?: number
  freshnessDaysLeft?: number
  itemKind: "tool"
}

export type RankedProduct = DbProduct & {
  score?: number
  freshnessDaysLeft?: number
  itemKind: "product"
}

export type RankedItem = RankedTool | RankedProduct

export type TimeframeOption = "today" | "this-week" | "this-month" | "all-time"
