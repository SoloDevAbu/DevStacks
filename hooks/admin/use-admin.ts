import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import {
  regenerateAdminBlog,
  reviewAdminRevision,
  reviewAdminSubmission,
  updateAdminAdStatus,
} from "@/lib/api/admin"

// Admin pages are Server Components, so a successful mutation re-renders them from the server.
const useAdminMutation = <TVariables, TData>(
  mutationFn: (variables: TVariables) => Promise<TData>
) => {
  const router = useRouter()
  return useMutation({ mutationFn, onSuccess: () => router.refresh() })
}

export const useReviewSubmission = () => useAdminMutation(reviewAdminSubmission)

export const useReviewRevision = () => useAdminMutation(reviewAdminRevision)

export const useUpdateAdStatus = () => useAdminMutation(updateAdminAdStatus)

export const useRegenerateBlog = () => useAdminMutation(regenerateAdminBlog)
