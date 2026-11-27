import { apiClient } from "@/lib/api/axios-instance"
import type { Blog } from "@/db/schema"
import type { LaunchItemType } from "@/constants/launches"
import type {
  AdStatusUpdateInput,
  RevisionReviewInput,
  SubmissionReviewInput,
} from "@/lib/validation/admin"

export const reviewAdminSubmission = async ({
  type,
  id,
  ...review
}: SubmissionReviewInput & { type: LaunchItemType; id: string }) => {
  const { data } = await apiClient.patch<{ success: boolean; blogError?: string }>(
    `/admin/submissions/${type}/${id}`,
    review
  )
  return data
}

export const reviewAdminRevision = async ({
  id,
  ...review
}: RevisionReviewInput & { id: string }) => {
  const { data } = await apiClient.patch<{ success: boolean }>(
    `/admin/edits/${id}`,
    review
  )
  return data
}

export const updateAdminAdStatus = async ({
  id,
  status,
}: AdStatusUpdateInput & { id: string }) => {
  const { data } = await apiClient.patch<{ success: boolean }>(`/admin/ads/${id}`, {
    status,
  })
  return data
}

export const regenerateAdminBlog = async ({
  itemType,
  itemId,
}: {
  itemType: LaunchItemType
  itemId: string
}): Promise<Blog> => {
  const { data } = await apiClient.post<{ success: boolean; blog: Blog }>(
    "/admin/blogs/regenerate",
    { itemType, itemId }
  )
  return data.blog
}
