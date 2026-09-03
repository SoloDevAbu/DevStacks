"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitBuild } from "@/lib/api/builds"
import type { SubmitBuildInput } from "@/lib/validation/build"

export const useSubmitBuild = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitBuildInput) => submitBuild(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["builds"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
