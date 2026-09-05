import { useQuery } from "@tanstack/react-query"
import { fetchTrending } from "@/lib/api/products"
import type { TimeframeOption } from "@/lib/rankings/types"

export const TRENDING_QUERY_KEY = (
  limit: number,
  timeframe: TimeframeOption = "today"
) => ["products", "trending", limit, timeframe]

export const useTrending = (
  limit = 10,
  timeframe: TimeframeOption = "today"
) => {
  return useQuery({
    queryKey: TRENDING_QUERY_KEY(limit, timeframe),
    queryFn: () => fetchTrending(limit, timeframe),
    staleTime: 60_000,
  })
}
