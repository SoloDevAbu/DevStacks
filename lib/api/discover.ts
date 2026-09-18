import { apiClient } from "@/lib/api/axios-instance"
import type { TimeframeOption } from "@/lib/rankings/types"

export type RankingQueryParams = {
  limit?: number
  page?: number
}

export const fetchPopularBuildingBlocks = async (
  params: RankingQueryParams = {}
) => {
  const { data } = await apiClient.get("/discover/popular-building-blocks", {
    params,
  })
  return data.data
}

export const fetchTrending = async (
  limit = 10,
  timeframe: TimeframeOption = "today",
  category?: string
) => {
  const { data } = await apiClient.get("/trending", {
    params: {
      limit,
      timeframe,
      category: category && category !== "all" ? category : undefined,
    },
  })
  return data.data
}
