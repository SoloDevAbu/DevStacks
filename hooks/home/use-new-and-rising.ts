import { useQuery } from "@tanstack/react-query"
import { fetchNewAndRising, type RankingQueryParams } from "@/lib/api/products"

export const NEW_AND_RISING_QUERY_KEY = (params: RankingQueryParams) => [
  "products",
  "new-and-rising",
  params,
]

export const useNewAndRising = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: NEW_AND_RISING_QUERY_KEY(params),
    queryFn: () => fetchNewAndRising(params),
    staleTime: 60_000,
  })
}
