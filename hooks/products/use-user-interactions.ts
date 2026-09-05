"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "@/lib/auth/client"
import { fetchUserInteractions } from "@/lib/api/users"

export const USER_INTERACTIONS_QUERY_KEY = ["user-interactions"]

export const useUserInteractions = () => {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const query = useQuery({
    queryKey: [...USER_INTERACTIONS_QUERY_KEY, userId],
    queryFn: () => fetchUserInteractions(userId),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  })

  const isUpvoted = (
    productId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!query.data) return false
    if (productId && query.data.upvotedProductIds?.includes(productId)) return true
    if (slug && query.data.upvotedSlugs?.includes(slug)) return true
    return false
  }

  const isBookmarked = (
    productId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!query.data) return false
    if (productId && query.data.bookmarkedProductIds?.includes(productId))
      return true
    if (slug && query.data.bookmarkedSlugs?.includes(slug)) return true
    return false
  }

  return {
    ...query,
    isUpvoted,
    isBookmarked,
  }
}
