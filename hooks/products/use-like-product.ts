"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleProductLike } from "@/lib/api/products"
import type { UserInteractionsData } from "@/lib/api/users"

export const useLikeProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleProductLike(slug, userId),
    onSuccess: (data, { slug, userId }) => {
      queryClient.setQueryData(
        ["user-interactions", userId],
        (old: UserInteractionsData | undefined) => {
          if (!old) return old
          const likedProductSlugs =
            data.action === "added"
              ? [...new Set([...old.likedProductSlugs, slug])]
              : old.likedProductSlugs.filter((s) => s !== slug)

          return { ...old, likedProductSlugs }
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
