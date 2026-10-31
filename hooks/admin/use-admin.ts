import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  fetchAdminSubmissions,
  updateAdminSubmissionStatus,
  regenerateAdminBlog,
  type FetchAdminSubmissionsParams,
} from "@/lib/api/admin"

export const ADMIN_SUBMISSIONS_KEY = (params?: FetchAdminSubmissionsParams) => [
  "admin",
  "submissions",
  params,
]

export const useAdminSubmissions = (params?: FetchAdminSubmissionsParams) => {
  return useQuery({
    queryKey: ADMIN_SUBMISSIONS_KEY(params),
    queryFn: () => fetchAdminSubmissions(params),
    staleTime: 30_000,
  })
}

export const useUpdateSubmissionStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAdminSubmissionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] })
    },
  })
}

export const useRegenerateBlog = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: regenerateAdminBlog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "submissions"] })
    },
  })
}

