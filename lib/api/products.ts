import { apiClient } from "@/lib/api/axios-instance"
import type { SubmitProductInput } from "@/lib/validation/product"
import type { TimeframeOption } from "@/lib/rankings/types"

export type ProductListParams = {
  q?: string
  category?: string
  tag?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "upvotes" | "builds" | "recent" | "views"
}

export type RankingQueryParams = {
  limit?: number
  page?: number
}

export const fetchProducts = async (params: ProductListParams = {}) => {
  const { data } = await apiClient.get("/products", { params })
  return data.data
}

export const fetchProduct = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}`)
  return data.data
}

export const fetchNewAndRising = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/products/new-and-rising", { params })
  return data.data
}

export const fetchRisingProducts = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/products/rising-products", { params })
  return data.data
}

export const fetchPopularBuildingBlocks = async (
  params: RankingQueryParams = {}
) => {
  const { data } = await apiClient.get("/products/popular-building-blocks", {
    params,
  })
  return data.data
}

export const fetchTrending = async (
  limit = 10,
  timeframe: TimeframeOption = "today"
) => {
  const { data } = await apiClient.get("/products/trending", {
    params: { limit, timeframe },
  })
  return data.data
}

export const fetchRecentlyAdded = async (
  params: RankingQueryParams | number = 6
) => {
  const queryParams =
    typeof params === "number" ? { limit: params, page: 1 } : params
  const { data } = await apiClient.get("/products/recently-added", {
    params: queryParams,
  })
  return data.data
}

export const submitProduct = async (payload: SubmitProductInput) => {
  const { data } = await apiClient.post("/products", payload)
  return data.data
}

export const toggleUpvote = async (slug: string, userId: string) => {
  const { data } = await apiClient.post(`/products/${slug}/upvote`, { userId })
  return data.data as { action: "added" | "removed"; upvotesCount: number }
}

export const toggleBookmark = async (slug: string, userId: string) => {
  const { data } = await apiClient.post(`/products/${slug}/bookmark`, { userId })
  return data.data as { action: "added" | "removed" }
}

export const fetchComments = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}/comments`)
  return data.data
}

export const submitComment = async (
  slug: string,
  payload: { userId: string; body: string }
) => {
  const { data } = await apiClient.post(`/products/${slug}/comments`, payload)
  return data.data
}
