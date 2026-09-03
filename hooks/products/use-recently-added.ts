import { useQuery } from "@tanstack/react-query"
import { fetchRecentlyAdded } from "@/lib/api/products"

export const RECENTLY_ADDED_QUERY_KEY = (limit: number) => [
  "products",
  "recently-added",
  limit,
]

export const useRecentlyAdded = (limit = 6) => {
  return useQuery({
    queryKey: RECENTLY_ADDED_QUERY_KEY(limit),
    queryFn: () => fetchRecentlyAdded(limit),
    staleTime: 60_000,
  })
}
