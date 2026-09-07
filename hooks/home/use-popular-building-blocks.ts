import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import {
  fetchPopularBuildingBlocks,
  type RankingQueryParams,
} from "@/lib/api/products"
import type { FeedItem } from "@/components/shared/feed-card"

export const POPULAR_BUILDING_BLOCKS_QUERY_KEY = (
  params: RankingQueryParams
) => ["products", "popular-building-blocks", params]

export const POPULAR_BUILDING_BLOCKS_INFINITE_QUERY_KEY = (limit: number) => [
  "products",
  "popular-building-blocks",
  "infinite",
  limit,
]

export const usePopularBuildingBlocks = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: POPULAR_BUILDING_BLOCKS_QUERY_KEY(params),
    queryFn: () => fetchPopularBuildingBlocks(params),
    staleTime: 60_000,
  })
}

export const useInfinitePopularBuildingBlocks = ({
  limit = 20,
  initialData,
}: {
  limit?: number
  initialData?: FeedItem[]
} = {}) => {
  return useInfiniteQuery({
    queryKey: POPULAR_BUILDING_BLOCKS_INFINITE_QUERY_KEY(limit),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchPopularBuildingBlocks({ page: pageParam, limit })
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

