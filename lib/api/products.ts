import { apiClient } from "@/lib/api/axios-instance"
import type { TimeframeOption } from "@/lib/rankings/types"

export type ProductListParams = {
  q?: string
  category?: string
  tag?: string
  pricing?: string
  tier?: string
  page?: number
  limit?: number
  sortBy?: "likes" | "recent" | "views"
}

export type ToolListParams = {
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

// Products (developer-built apps)
export const fetchProducts = async (params: ProductListParams = {}) => {
  const { data } = await apiClient.get("/products", { params })
  return data.data
}

export const fetchProduct = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}`)
  return data.data
}

export const submitProduct = async (payload: Record<string, unknown>) => {
  const { data } = await apiClient.post("/products", payload)
  return data.data
}

export const toggleProductLike = async (slug: string, userId: string) => {
  const { data } = await apiClient.post(`/products/${slug}/like`, { userId })
  return data.data as { action: "added" | "removed"; likesCount: number }
}

export const toggleProductBookmark = async (slug: string, userId: string) => {
  const { data } = await apiClient.post(`/products/${slug}/bookmark`, { userId })
  return data.data as { action: "added" | "removed" }
}

export const fetchProductComments = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}/comments`)
  return data.data
}

export const submitProductComment = async (
  slug: string,
  payload: { userId: string; body: string }
) => {
  const { data } = await apiClient.post(`/products/${slug}/comments`, payload)
  return data.data
}

// Tools (infrastructure/developer tools)
export const fetchTools = async (params: ToolListParams = {}) => {
  const { data } = await apiClient.get("/tools", { params })
  return data.data
}

export const fetchTool = async (slug: string) => {
  const { data } = await apiClient.get(`/tools/${slug}`)
  return data.data
}

export const submitTool = async (payload: Record<string, unknown>) => {
  const { data } = await apiClient.post("/tools", payload)
  return data.data
}

export const toggleToolUpvote = async (slug: string, userId: string) => {
  const { data } = await apiClient.post(`/tools/${slug}/upvote`, { userId })
  return data.data as { action: "added" | "removed"; upvotesCount: number }
}

export const toggleToolBookmark = async (slug: string, userId: string) => {
  const { data } = await apiClient.post(`/tools/${slug}/bookmark`, { userId })
  return data.data as { action: "added" | "removed" }
}

export const fetchToolComments = async (slug: string) => {
  const { data } = await apiClient.get(`/tools/${slug}/comments`)
  return data.data
}

export const submitToolComment = async (
  slug: string,
  payload: { userId: string; body: string }
) => {
  const { data } = await apiClient.post(`/tools/${slug}/comments`, payload)
  return data.data
}

// Ranking feeds (unchanged URL signatures)
export const fetchNewAndRising = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/products/new-and-rising", { params })
  return data.data
}

export const fetchRisingTools = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/products/rising-tools", { params })
  return data.data
}

export const fetchRisingProducts = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/products/rising-products", { params })
  return data.data
}

export const fetchPopularBuildingBlocks = async (params: RankingQueryParams = {}) => {
  const { data } = await apiClient.get("/products/popular-building-blocks", { params })
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
