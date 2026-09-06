import { useQuery } from "@tanstack/react-query"
import { fetchRisingProducts, type RankingQueryParams } from "@/lib/api/products"

export const RISING_PRODUCTS_QUERY_KEY = (params: RankingQueryParams) => [
  "products",
  "rising",
  params,
]

export const useRisingProducts = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: RISING_PRODUCTS_QUERY_KEY(params),
    queryFn: () => fetchRisingProducts(params),
    staleTime: 60_000,
  })
}
