"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toggleToolUpvote } from "@/lib/api/tools"
import type { UserInteractionsData } from "@/lib/api/users"

export const useUpvoteTool = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ slug, userId }: { slug: string; userId: string }) =>
      toggleToolUpvote(slug, userId),
    onSuccess: (data, { slug, userId }) => {
      queryClient.setQueryData(
        ["user-interactions", userId],
        (old: UserInteractionsData | undefined) => {
          if (!old) return old
          const upvotedToolSlugs =
            data.action === "added"
              ? [...new Set([...old.upvotedToolSlugs, slug])]
              : old.upvotedToolSlugs.filter((s) => s !== slug)

          return { ...old, upvotedToolSlugs }
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
