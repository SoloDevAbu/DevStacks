"use client"

import { useMutation } from "@tanstack/react-query"
import { submitFeedback, type SubmitFeedbackPayload } from "@/lib/api/feedback"

export const useSubmitFeedback = () => {
  return useMutation({
    mutationFn: (payload: SubmitFeedbackPayload) => submitFeedback(payload),
  })
}
