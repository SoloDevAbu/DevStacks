import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleBookmark } from "@/lib/api/products"
import type { UserInteractionsData } from "@/lib/api/users"

export const useBookmark = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleBookmark(slug, userId),
    onSuccess: (data, { slug, userId }) => {
      queryClient.setQueryData(
        ["user-interactions", userId],
        (old: UserInteractionsData | undefined) => {
          if (!old) return old
          const bookmarkedSlugs =
            data.action === "added"
              ? [...new Set([...old.bookmarkedSlugs, slug])]
              : old.bookmarkedSlugs.filter((s) => s !== slug)

          return {
            ...old,
            bookmarkedSlugs,
          }
        }
      )
    },
    onSettled: (_data, _err, vars) => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] })
      queryClient.invalidateQueries({
        queryKey: ["user-interactions", vars?.userId],
      })
    },
  })
}

