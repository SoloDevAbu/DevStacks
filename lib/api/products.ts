import { apiClient } from "@/lib/api/axios-instance"

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
  const { data } = await apiClient.post(`/products/${slug}/bookmark`, {
    userId,
  })
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
