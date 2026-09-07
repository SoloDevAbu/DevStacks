import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchRisingProducts, type RankingQueryParams } from "@/lib/api/products"
import type { DbProduct } from "@/components/shared/product-card"

export const RISING_PRODUCTS_QUERY_KEY = (params: RankingQueryParams) => [
  "products",
  "rising",
  params,
]

export const RISING_PRODUCTS_INFINITE_QUERY_KEY = (limit: number) => [
  "products",
  "rising",
  "infinite",
  limit,
]

export const useRisingProducts = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: RISING_PRODUCTS_QUERY_KEY(params),
    queryFn: () => fetchRisingProducts(params),
    staleTime: 60_000,
  })
}

export const useInfiniteRisingProducts = ({
  limit = 20,
  initialData,
}: {
  limit?: number
  initialData?: DbProduct[]
} = {}) => {
  return useInfiniteQuery({
    queryKey: RISING_PRODUCTS_INFINITE_QUERY_KEY(limit),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchRisingProducts({ page: pageParam, limit })
      return (data ?? []) as DbProduct[]
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

