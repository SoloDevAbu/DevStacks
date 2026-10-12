"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteToolApi } from "@/lib/api/tools"

export const useDeleteTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteToolApi(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ["tool", slug] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-tools"] })
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      queryClient.invalidateQueries({ queryKey: ["user-submissions"] })
    },
  })
}
