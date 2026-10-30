"use client"

import { useMutation } from "@tanstack/react-query"
import { autofillWithAi, type AutofillResponse } from "@/lib/api/ai"

export const useAiAutofill = () => {
  return useMutation<
    AutofillResponse,
    Error,
    { url: string; forceRefresh?: boolean }
  >({
    mutationFn: ({ url, forceRefresh }) => autofillWithAi(url, forceRefresh),
  })
}

