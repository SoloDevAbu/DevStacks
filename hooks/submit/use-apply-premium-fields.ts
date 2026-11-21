"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProductApi } from "@/lib/api/products"
import { updateToolApi } from "@/lib/api/tools"
import type { PendingLaunch } from "@/utils/submit/pending-launch"

export const useApplyPremiumFields = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ type, slug, premiumFields }: PendingLaunch) =>
      type === "product"
        ? updateProductApi(slug, premiumFields)
        : updateToolApi(slug, premiumFields),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
    },
  })
}
