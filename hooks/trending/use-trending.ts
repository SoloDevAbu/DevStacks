import { useQuery } from "@tanstack/react-query"
import { fetchTrending } from "@/lib/api/discover"
import type { TimeframeOption } from "@/lib/rankings/types"

export const TRENDING_QUERY_KEY = (
  limit: number,
  timeframe: TimeframeOption = "today",
  category?: string
) => ["trending", limit, timeframe, category ?? "all"]

export const useTrending = (
  limit = 10,
  timeframe: TimeframeOption = "today",
  category?: string
) => {
  return useQuery({
    queryKey: TRENDING_QUERY_KEY(limit, timeframe, category),
    queryFn: () => fetchTrending(limit, timeframe, category),
    staleTime: 60_000,
  })
}
