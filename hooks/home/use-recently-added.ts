import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchRecentlyAdded, type RankingQueryParams } from "@/lib/api/products"
import type { FeedItem } from "@/components/shared/feed-card"

export const RECENTLY_ADDED_QUERY_KEY = (
  params: RankingQueryParams | number
) => ["products", "recently-added", params]

export const RECENTLY_ADDED_INFINITE_QUERY_KEY = (limit: number) => [
  "products",
  "recently-added",
  "infinite",
  limit,
]

export const useRecentlyAdded = (params: RankingQueryParams | number = 6) => {
  return useQuery({
    queryKey: RECENTLY_ADDED_QUERY_KEY(params),
    queryFn: () => fetchRecentlyAdded(params),
    staleTime: 60_000,
  })
}

export const useInfiniteRecentlyAdded = ({
  limit = 20,
  initialData,
}: {
  limit?: number
  initialData?: FeedItem[]
} = {}) => {
  return useInfiniteQuery({
    queryKey: RECENTLY_ADDED_INFINITE_QUERY_KEY(limit),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchRecentlyAdded({ page: pageParam, limit })
      return (data ?? []) as FeedItem[]
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || lastPage.length < limit) return undefined
      return allPages.length + 1
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [1],
        }
      : undefined,
    staleTime: 60_000,
  })
}

