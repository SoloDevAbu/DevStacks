import { apiClient } from "@/lib/api/axios-instance"
import type { SubmitProductInput } from "@/lib/validation/product"

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

export const fetchProducts = async (params: ProductListParams = {}) => {
  const { data } = await apiClient.get("/products", { params })
  return data.data
}

export const fetchProduct = async (slug: string) => {
  const { data } = await apiClient.get(`/products/${slug}`)
  return data.data
}

export const fetchTrending = async (limit = 10) => {
  const { data } = await apiClient.get("/products/trending", {
    params: { limit },
  })
  return data.data
}

export const fetchRecentlyAdded = async (limit = 6) => {
  const { data } = await apiClient.get("/products/recently-added", {
    params: { limit },
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
