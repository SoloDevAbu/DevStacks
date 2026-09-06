import { useQuery } from "@tanstack/react-query"
import { fetchRisingTools, type RankingQueryParams } from "@/lib/api/products"

export const RISING_TOOLS_QUERY_KEY = (params: RankingQueryParams) => [
  "tools",
  "rising",
  params,
]

export const useRisingTools = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: RISING_TOOLS_QUERY_KEY(params),
    queryFn: () => fetchRisingTools(params),
    staleTime: 60_000,
  })
}
