import { useQuery } from "@tanstack/react-query"
import { fetchRecentlyAdded, type RankingQueryParams } from "@/lib/api/products"

export const RECENTLY_ADDED_QUERY_KEY = (
  params: RankingQueryParams | number
) => ["products", "recently-added", params]

export const useRecentlyAdded = (params: RankingQueryParams | number = 6) => {
  return useQuery({
    queryKey: RECENTLY_ADDED_QUERY_KEY(params),
    queryFn: () => fetchRecentlyAdded(params),
    staleTime: 60_000,
  })
}
