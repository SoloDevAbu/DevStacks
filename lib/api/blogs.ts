import { apiClient } from "@/lib/api/axios-instance"
import type { BlogListItem } from "@/types/blog"

export interface BlogListParams {
  page?: number
  limit?: number
}

export const fetchBlogs = async (
  params: BlogListParams = {}
): Promise<BlogListItem[]> => {
  const { data } = await apiClient.get("/blogs", { params })
  return (data.data ?? []) as BlogListItem[]
}

