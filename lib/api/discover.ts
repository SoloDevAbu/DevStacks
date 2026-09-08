import { apiClient } from "@/lib/api/axios-instance"
import type { TimeframeOption } from "@/lib/rankings/types"

export type RankingQueryParams = {
  limit?: number
  page?: number
}

export const fetchNewAndRising = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/discover/new-and-rising", { params })
  return data.data
}

export const fetchRisingTools = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/discover/rising-tools", { params })
  return data.data
}

export const fetchRisingProducts = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/discover/rising-products", { params })
  return data.data
}

export const fetchPopularBuildingBlocks = async (
  params: RankingQueryParams = {}
) => {
  const { data } = await apiClient.get("/discover/popular-building-blocks", {
    params,
  })
  return data.data
}

export const fetchRecentlyAdded = async (
  params: RankingQueryParams | number = 6
) => {
  const queryParams =
    typeof params === "number" ? { limit: params, page: 1 } : params
  const { data } = await apiClient.get("/discover/recently-added", {
    params: queryParams,
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
