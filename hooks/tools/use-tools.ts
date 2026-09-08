import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchTools, type ToolListParams } from "@/lib/api/tools"
import type { DbTool } from "@/types/entities"

export const TOOLS_QUERY_KEY = (params: ToolListParams) => ["tools", params]

export const TOOLS_INFINITE_QUERY_KEY = (params: ToolListParams) => [
  "tools",
  "infinite",
  params,
]

export const useTools = (params: ToolListParams = {}) => {
  return useQuery({
    queryKey: TOOLS_QUERY_KEY(params),
    queryFn: () => fetchTools(params),
    staleTime: 60_000,
  })
}

export const useInfiniteTools = ({
  category,
  q,
  tag,
  pricing,
  tier,
  sortBy,
  limit = 20,
  initialData,
}: ToolListParams & { initialData?: DbTool[] } = {}) => {
  const queryFilterParams = { category, q, tag, pricing, tier, sortBy, limit }

  return useInfiniteQuery({
    queryKey: TOOLS_INFINITE_QUERY_KEY(queryFilterParams),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchTools({
        ...queryFilterParams,
        page: pageParam,
      })
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
