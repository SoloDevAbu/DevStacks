"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitTool } from "@/lib/api/tools"
import type { SubmitToolInput } from "@/lib/validation/tool"

export const useSubmitTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitToolInput) => submitTool(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}
