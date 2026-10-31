import { apiClient } from "@/lib/api/axios-instance"
import type { AdminSubmissionItem } from "@/db/queries/admin/submissions"
import type { Blog } from "@/db/schema"

export interface FetchAdminSubmissionsParams {
  status?: "pending" | "approved" | "rejected" | "all"
  search?: string
}

export const fetchAdminSubmissions = async (
  params?: FetchAdminSubmissionsParams
): Promise<AdminSubmissionItem[]> => {
  const { data } = await apiClient.get<{ data: AdminSubmissionItem[] }>(
    "/admin/submissions",
    { params }
  )
  return data.data
}

export const updateAdminSubmissionStatus = async ({
  type,
  id,
  status,
}: {
  type: "tool" | "product"
  id: string
  status: "pending" | "approved" | "rejected"
}): Promise<{
  data: any
  blog?: Blog
  blogError?: string
}> => {
  const { data } = await apiClient.patch<{
    data: any
    blog?: Blog
    blogError?: string
  }>(`/admin/submissions/${type}/${id}`, { status })
  return data
}

export const regenerateAdminBlog = async ({
  itemType,
  itemId,
}: {
  itemType: "tool" | "product"
  itemId: string
}): Promise<Blog> => {
  const { data } = await apiClient.post<{ success: boolean; blog: Blog }>(
    "/admin/blogs/regenerate",
    { itemType, itemId }
  )
  return data.blog
}

