import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchTools, type ToolListParams } from "@/lib/api/tools"
import type { DbTool } from "@/types/entities"

export const TOOLS_QUERY_KEY = (params: ToolListParams) => ["tools", params]

export const TOOLS_INFINITE_QUERY_KEY = (
  params: ToolListParams & { initialPage?: number }
) => ["tools", "infinite", params]

export const useTools = (
  params: ToolListParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery<DbTool[]>({
    queryKey: TOOLS_QUERY_KEY(params),
    queryFn: () => fetchTools(params),
    staleTime: 60_000,
    ...options,
  })
}

export const useInfiniteTools = ({
  category,
  q,
  tag,
  platform,
  pricing,
  tier,
  sortBy,
  limit = 20,
  initialPage = 1,
  totalPages,
  initialData,
}: ToolListParams & {
  initialPage?: number
  totalPages?: number
  initialData?: DbTool[]
} = {}) => {
  const queryFilterParams = {
    category,
    q,
    tag,
    platform,
    pricing,
    tier,
    sortBy,
    limit,
    initialPage,
  }

  return useInfiniteQuery({
    queryKey: TOOLS_INFINITE_QUERY_KEY(queryFilterParams),
    queryFn: async ({ pageParam = initialPage }) => {
      const data = await fetchTools({
        ...queryFilterParams,
        page: pageParam,
      })
      return (data ?? []) as DbTool[]
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage || lastPage.length < limit) return undefined
      const next = (lastPageParam as number) + 1
      if (totalPages && next > totalPages) return undefined
      return next
    },
    initialData: initialData
      ? {
          pages: [initialData],
          pageParams: [initialPage],
        }
      : undefined,
    staleTime: 60_000,
  })
}
