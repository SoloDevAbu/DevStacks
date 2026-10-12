"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteProductApi } from "@/lib/api/products"

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (slug: string) => deleteProductApi(slug),
    onSuccess: (_, slug) => {
      queryClient.invalidateQueries({ queryKey: ["product", slug] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["user-submissions"] })
    },
  })
}
