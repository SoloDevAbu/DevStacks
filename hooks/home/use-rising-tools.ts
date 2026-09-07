import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchRisingTools, type RankingQueryParams } from "@/lib/api/products"
import type { DbTool } from "@/components/shared/tool-card"

export const RISING_TOOLS_QUERY_KEY = (params: RankingQueryParams) => [
  "tools",
  "rising",
  params,
]

export const RISING_TOOLS_INFINITE_QUERY_KEY = (limit: number) => [
  "tools",
  "rising",
  "infinite",
  limit,
]

export const useRisingTools = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: RISING_TOOLS_QUERY_KEY(params),
    queryFn: () => fetchRisingTools(params),
    staleTime: 60_000,
  })
}

export const useInfiniteRisingTools = ({
  limit = 20,
  initialData,
}: {
  limit?: number
  initialData?: DbTool[]
} = {}) => {
  return useInfiniteQuery({
    queryKey: RISING_TOOLS_INFINITE_QUERY_KEY(limit),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchRisingTools({ page: pageParam, limit })
      return (data ?? []) as DbTool[]
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

