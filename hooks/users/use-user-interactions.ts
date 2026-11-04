"use client"

import { useQuery } from "@tanstack/react-query"
import { ITEM_KIND, type ItemKind } from "@/constants/items"
import { useHasMounted } from "@/hooks/shared/use-has-mounted"
import { useSession } from "@/lib/auth/client"
import { fetchUserInteractions } from "@/lib/api/users"
import {
  cacheInteractions,
  getCachedInteractions,
} from "@/utils/cached-interactions"
import { getRecentVoteCount } from "@/utils/recent-votes"

export const USER_INTERACTIONS_QUERY_KEY = ["user-interactions"]

export const getUserInteractionsQueryKey = (userId?: string) => [
  ...USER_INTERACTIONS_QUERY_KEY,
  userId,
]

export const loadUserInteractions = async (userId?: string) => {
  const interactions = await fetchUserInteractions(userId)
  if (userId) cacheInteractions(userId, interactions)
  return interactions
}

export const useUserInteractions = () => {
  const { data: session, isPending: isSessionPending } = useSession()
  const hasMounted = useHasMounted()
  const userId = session?.user?.id

  const query = useQuery({
    queryKey: getUserInteractionsQueryKey(userId),
    queryFn: () => loadUserInteractions(userId),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  })

  // Cached pages can't know who is viewing, so returning users would otherwise wait for the session
  // and then their votes. hasMounted keeps the first client render equal to the server HTML.
  const canUseCache = hasMounted && (isSessionPending || Boolean(userId))
  const interactions =
    query.data ?? (canUseCache ? getCachedInteractions(userId) : undefined)

  const isToolUpvoted = (slug: string): boolean =>
    interactions?.upvotedToolSlugs.includes(slug) ?? false

  const isToolBookmarked = (
    toolId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!interactions) return false
    if (toolId && interactions.bookmarkedToolIds?.includes(toolId)) return true
    if (slug && interactions.bookmarkedToolSlugs?.includes(slug)) return true
    return false
  }

  const isProductLiked = (slug: string): boolean =>
    interactions?.likedProductSlugs.includes(slug) ?? false

  const isProductBookmarked = (
    productId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!interactions) return false
    if (productId && interactions.bookmarkedProductIds?.includes(productId))
      return true
    if (slug && interactions.bookmarkedProductSlugs?.includes(slug)) return true
    return false
  }

  const resolveCount = (
    kind: ItemKind,
    counts: Record<string, number> | undefined,
    slug: string,
    serverCount: number
  ): number => {
    if (!hasMounted) return serverCount
    return counts?.[slug] ?? getRecentVoteCount(kind, slug) ?? serverCount
  }

  const getProductLikes = (slug: string, serverCount: number): number =>
    resolveCount(
      ITEM_KIND.PRODUCT,
      query.data?.productLikeCounts,
      slug,
      serverCount
    )

  const getToolUpvotes = (slug: string, serverCount: number): number =>
    resolveCount(
      ITEM_KIND.TOOL,
      query.data?.toolUpvoteCounts,
      slug,
      serverCount
    )

  return {
    ...query,
    isToolUpvoted,
    isToolBookmarked,
    isProductLiked,
    isProductBookmarked,
    getProductLikes,
    getToolUpvotes,
  }
}
