"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBookmark } from "@/lib/api/products"

export const useBookmark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleBookmark(slug, userId),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
    },
  })
}
