"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleToolBookmark } from "@/lib/api/products"
import type { UserInteractionsData } from "@/lib/api/users"

export const useBookmarkTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleToolBookmark(slug, userId),
    onSuccess: (data, { slug, userId }) => {
      queryClient.setQueryData(
        ["user-interactions", userId],
        (old: UserInteractionsData | undefined) => {
          if (!old) return old
          const bookmarkedToolSlugs =
            data.action === "added"
              ? [...new Set([...old.bookmarkedToolSlugs, slug])]
              : old.bookmarkedToolSlugs.filter((s) => s !== slug)

          return { ...old, bookmarkedToolSlugs }
        }
      )
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["tools"] })
      queryClient.invalidateQueries({
        queryKey: ["user-interactions", vars?.userId],
      })
    },
  })
}
