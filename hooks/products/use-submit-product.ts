"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitProduct } from "@/lib/api/products"
import type { SubmitProductInput } from "@/lib/validation/product"

export const useSubmitProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SubmitProductInput) => submitProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
  })
}
