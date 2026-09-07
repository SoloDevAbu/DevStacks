import { apiClient } from "@/lib/api/axios-instance"

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

export const fetchTools = async (params: ToolListParams = {}) => {
  const { data } = await apiClient.get("/tools", { params })
  return data.data
}

export const fetchTool = async (slug: string) => {
  const { data } = await apiClient.get(`/tools/${slug}`)
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
