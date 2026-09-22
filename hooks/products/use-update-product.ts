"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProductApi } from "@/lib/api/products"

export const useUpdateProduct = (slug: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      updateProductApi(slug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product", slug] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] })
    },
  })
}
