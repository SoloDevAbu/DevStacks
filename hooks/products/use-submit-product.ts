"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { submitProduct } from "@/lib/api/products"
import type {
  SubmitProductInput,
  SubmitProductData,
} from "@/lib/validation/product"

export type ClientSubmitProductInput =
  | Omit<SubmitProductInput, "submitterId">
  | Omit<SubmitProductData, "submitterId">
  | Record<string, unknown>

export const useSubmitProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: ClientSubmitProductInput) =>
      submitProduct(payload as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["feed"] })
    },
  })
}
