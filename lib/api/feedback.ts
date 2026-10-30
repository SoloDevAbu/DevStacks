import { apiClient } from "@/lib/api/axios-instance"
import type { FeedbackType } from "@/constants/feedback"

export interface SubmitFeedbackPayload {
  type: FeedbackType
  title?: string | null
  message: string
  email?: string | null
  pageUrl?: string | null
}

export const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  const { data } = await apiClient.post<{ success: boolean; data: unknown }>(
    "/feedback",
    payload
  )
  return data
}
