import { useQuery } from "@tanstack/react-query"
import { fetchTrending } from "@/lib/api/products"

export const TRENDING_QUERY_KEY = (limit: number) => ["products", "trending", limit]

export const useTrending = (limit = 10) => {
  return useQuery({
    queryKey: TRENDING_QUERY_KEY(limit),
    queryFn: () => fetchTrending(limit),
    staleTime: 60_000,
  })
}
