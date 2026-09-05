import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleUpvote } from "@/lib/api/products"
import type { UserInteractionsData } from "@/lib/api/users"

export const useUpvote = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleUpvote(slug, userId),
    onSuccess: (data, { slug, userId }) => {
      queryClient.setQueryData(
        ["user-interactions", userId],
        (old: UserInteractionsData | undefined) => {
          if (!old) return old
          const upvotedSlugs =
            data.action === "added"
              ? [...new Set([...old.upvotedSlugs, slug])]
              : old.upvotedSlugs.filter((s) => s !== slug)

          return {
            ...old,
            upvotedSlugs,
          }
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

