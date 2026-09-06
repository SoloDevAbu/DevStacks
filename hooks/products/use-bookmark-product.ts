"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleProductBookmark } from "@/lib/api/products"
import type { UserInteractionsData } from "@/lib/api/users"

export const useBookmarkProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleProductBookmark(slug, userId),
    onSuccess: (data, { slug, userId }) => {
      queryClient.setQueryData(
        ["user-interactions", userId],
        (old: UserInteractionsData | undefined) => {
          if (!old) return old
          const bookmarkedProductSlugs =
            data.action === "added"
              ? [...new Set([...old.bookmarkedProductSlugs, slug])]
              : old.bookmarkedProductSlugs.filter((s) => s !== slug)

          return { ...old, bookmarkedProductSlugs }
        }
      )
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({
        queryKey: ["user-interactions", vars?.userId],
      })
    },
  })
}
