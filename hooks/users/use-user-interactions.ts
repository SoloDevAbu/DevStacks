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

  const isToolUpvoted = (
    toolId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!query.data) return false
    if (toolId && query.data.upvotedToolIds?.includes(toolId)) return true
    if (slug && query.data.upvotedToolSlugs?.includes(slug)) return true
    return false
  }

  const isToolBookmarked = (
    toolId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!query.data) return false
    if (toolId && query.data.bookmarkedToolIds?.includes(toolId)) return true
    if (slug && query.data.bookmarkedToolSlugs?.includes(slug)) return true
    return false
  }

  const isProductLiked = (
    productId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!query.data) return false
    if (productId && query.data.likedProductIds?.includes(productId))
      return true
    if (slug && query.data.likedProductSlugs?.includes(slug)) return true
    return false
  }

  const isProductBookmarked = (
    productId?: string | null,
    slug?: string | null
  ): boolean => {
    if (!query.data) return false
    if (productId && query.data.bookmarkedProductIds?.includes(productId))
      return true
    if (slug && query.data.bookmarkedProductSlugs?.includes(slug)) return true
    return false
  }

  return {
    ...query,
    isToolUpvoted,
    isToolBookmarked,
    isProductLiked,
    isProductBookmarked,
  }
}
