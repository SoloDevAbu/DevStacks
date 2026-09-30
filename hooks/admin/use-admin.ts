import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchAdminSubmissions,
  fetchAdminSubmission,
  updateAdminSubmissionStatus,
  bulkUpdateAdminSubmissions,
  updateAdminSubmissionDetails,
  deleteAdminSubmission,
} from "@/lib/api/admin"
import type { AdminSubmissionsFilters } from "@/db/queries/admin/submissions"

export const ADMIN_QUERY_KEY = ["admin", "submissions"] as const

export const useAdminSubmissions = (filters: AdminSubmissionsFilters = {}) => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEY, filters],
    queryFn: () => fetchAdminSubmissions(filters),
    staleTime: 10_000,
  })
}

export const useAdminSubmission = (
  type: "tool" | "product",
  id: string,
  enabled = true
) => {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEY, type, id],
    queryFn: () => fetchAdminSubmission(type, id),
    enabled: Boolean(enabled && id),
  })
}

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      type,
      id,
      status,
    }: {
      type: "tool" | "product"
      id: string
      status: "pending" | "approved" | "rejected"
    }) => updateAdminSubmissionStatus(type, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY })
    },
  })
}

export const useBulkUpdateSubmissions = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      items: Array<{
        type: "tool" | "product"
        id: string
        status: "pending" | "approved" | "rejected"
      }>
    ) => bulkUpdateAdminSubmissions(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY })
    },
  })
}

export const useUpdateSubmissionDetails = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      type,
      id,
      data,
    }: {
      type: "tool" | "product"
      id: string
      data: Record<string, unknown>
    }) => updateAdminSubmissionDetails(type, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY })
    },
  })
}

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, id }: { type: "tool" | "product"; id: string }) =>
      deleteAdminSubmission(type, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEY })
    },
  })
}
