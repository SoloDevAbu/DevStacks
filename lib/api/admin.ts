import { apiClient } from "@/lib/api/axios-instance"
import type {
  AdminSubmissionItem,
  AdminSubmissionsFilters,
  AdminSubmissionsResult,
} from "@/db/queries/admin/submissions"

export const fetchAdminSubmissions = async (
  params: AdminSubmissionsFilters = {}
): Promise<AdminSubmissionsResult> => {
  const { data } = await apiClient.get("/admin/submissions", { params })
  return data.data as AdminSubmissionsResult
}

export const fetchAdminSubmission = async (
  type: "tool" | "product",
  id: string
): Promise<AdminSubmissionItem> => {
  const { data } = await apiClient.get(`/admin/submissions/${type}/${id}`)
  return data.data as AdminSubmissionItem
}

export const updateAdminSubmissionStatus = async (
  type: "tool" | "product",
  id: string,
  status: "pending" | "approved" | "rejected"
) => {
  const { data } = await apiClient.patch(`/admin/submissions/${type}/${id}`, {
    status,
  })
  return data.data
}

export const bulkUpdateAdminSubmissions = async (
  items: Array<{
    type: "tool" | "product"
    id: string
    status: "pending" | "approved" | "rejected"
  }>
) => {
  const { data } = await apiClient.patch("/admin/submissions", { items })
  return data
}

export const updateAdminSubmissionDetails = async (
  type: "tool" | "product",
  id: string,
  payload: Record<string, unknown>
) => {
  const { data } = await apiClient.patch(
    `/admin/submissions/${type}/${id}`,
    payload
  )
  return data.data as AdminSubmissionItem
}

export const deleteAdminSubmission = async (
  type: "tool" | "product",
  id: string
) => {
  const { data } = await apiClient.delete(`/admin/submissions/${type}/${id}`)
  return data
}
