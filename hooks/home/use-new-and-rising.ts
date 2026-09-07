import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchNewAndRising, type RankingQueryParams } from "@/lib/api/products"
import type { FeedItem } from "@/components/shared/feed-card"

export const NEW_AND_RISING_QUERY_KEY = (params: RankingQueryParams) => [
  "products",
  "new-and-rising",
  params,
]

export const NEW_AND_RISING_INFINITE_QUERY_KEY = (limit: number) => [
  "products",
  "new-and-rising",
  "infinite",
  limit,
]

export const useNewAndRising = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: NEW_AND_RISING_QUERY_KEY(params),
    queryFn: () => fetchNewAndRising(params),
    staleTime: 60_000,
  })
}

export const useInfiniteNewAndRising = ({
  limit = 20,
  initialData,
}: {
  limit?: number
  initialData?: FeedItem[]
} = {}) => {
  return useInfiniteQuery({
    queryKey: NEW_AND_RISING_INFINITE_QUERY_KEY(limit),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchNewAndRising({ page: pageParam, limit })
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
