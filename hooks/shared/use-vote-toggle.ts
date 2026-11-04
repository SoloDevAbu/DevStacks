"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "@/components/ui/toast"
import type { ItemKind } from "@/constants/items"
import type { UserInteractionsData, VoteResult } from "@/lib/api/users"
import {
  getUserInteractionsQueryKey,
  loadUserInteractions,
} from "@/hooks/users/use-user-interactions"
import { cacheInteractions } from "@/utils/cached-interactions"
import { rememberRecentVote } from "@/utils/recent-votes"

type VotedSlugsField = "likedProductSlugs" | "upvotedToolSlugs"
type VoteCountsField = "productLikeCounts" | "toolUpvoteCounts"

interface VoteToggleConfig {
  kind: ItemKind
  slug: string
  votedSlugsField: VotedSlugsField
  countsField: VoteCountsField
  sendVote: (slug: string, voted: boolean) => Promise<VoteResult>
  listQueryKey: readonly string[]
  errorTitle: string
}

interface VoteVariables {
  userId: string
  voted: boolean
  displayedCount: number
}

const ERROR_DESCRIPTION = "Please check your connection and try again."

export const useVoteToggle = ({
  kind,
  slug,
  votedSlugsField,
  countsField,
  sendVote,
  listQueryKey,
  errorTitle,
}: VoteToggleConfig) => {
  const queryClient = useQueryClient()
  const mutationKey = ["vote", kind, slug]

  const writeVote = (userId: string, { voted, count }: VoteResult) => {
    const updated = queryClient.setQueryData<UserInteractionsData>(
      getUserInteractionsQueryKey(userId),
      (old) =>
        old && {
          ...old,
          [votedSlugsField]: voted
            ? [...new Set([...old[votedSlugsField], slug])]
            : old[votedSlugsField].filter((votedSlug) => votedSlug !== slug),
          [countsField]: { ...old[countsField], [slug]: count },
        }
    )
    if (updated) cacheInteractions(userId, updated)
  }

  // While another click on this item is queued, its optimistic state is the newest one.
  const isLastInQueue = () => queryClient.isMutating({ mutationKey }) === 1

  const { mutate } = useMutation({
    mutationKey,
    // Clicks on one item must reach the server in order, or an earlier click could win.
    scope: { id: mutationKey.join(":") },
    mutationFn: ({ voted }: VoteVariables) => sendVote(slug, voted),
    onMutate: async ({ userId, voted, displayedCount }) => {
      const queryKey = getUserInteractionsQueryKey(userId)
      await queryClient.cancelQueries({ queryKey })

      const previous = queryClient.getQueryData<UserInteractionsData>(queryKey)
      const currentCount = previous?.[countsField][slug] ?? displayedCount
      writeVote(userId, {
        voted,
        count: Math.max(currentCount + (voted ? 1 : -1), 0),
      })

      return { previous }
    },
    onSuccess: (result, { userId }) => {
      rememberRecentVote(kind, slug, result.count)
      if (isLastInQueue()) writeVote(userId, result)
    },
    onError: (_error, { userId }, context) => {
      toast.error(errorTitle, ERROR_DESCRIPTION)
      if (isLastInQueue() && context?.previous) {
        queryClient.setQueryData(
          getUserInteractionsQueryKey(userId),
          context.previous
        )
      }
    },
    onSettled: (_data, error, { userId }) => {
      if (!isLastInQueue()) return

      queryClient.invalidateQueries({
        queryKey: listQueryKey,
        refetchType: "none",
      })
      if (error) {
        queryClient.invalidateQueries({
          queryKey: getUserInteractionsQueryKey(userId),
        })
      }
    },
  })

  const toggle = async (userId: string, displayedCount: number) => {
    const queryKey = getUserInteractionsQueryKey(userId)

    try {
      // A click's direction is unknown until the user's votes have loaded. This reads the cache
      // rather than render state so a fast second click sees the first one.
      const interactions = await queryClient.ensureQueryData({
        queryKey,
        queryFn: () => loadUserInteractions(userId),
      })

      mutate({
        userId,
        voted: !interactions[votedSlugsField].includes(slug),
        displayedCount,
      })
    } catch {
      toast.error(errorTitle, ERROR_DESCRIPTION)
    }
  }

  return { toggle }
}
