"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateToolApi } from "@/lib/api/tools"

export const useUpdateTool = (slug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      updateToolApi(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tool", slug] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-tools"] })
    },
  })
}
