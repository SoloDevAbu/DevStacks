import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { fetchProducts, type ProductListParams } from "@/lib/api/products"
import type { DbProduct } from "@/types/entities"

export const PRODUCTS_QUERY_KEY = (params: ProductListParams) => [
  "products",
  params,
]

export const useProducts = (
  params: ProductListParams = {},
  options?: { enabled?: boolean }
) => {
  return useQuery<DbProduct[]>({
    queryKey: PRODUCTS_QUERY_KEY(params),
    queryFn: () => fetchProducts(params),
    staleTime: 60_000,
    ...options,
  })
}

export const PRODUCTS_INFINITE_QUERY_KEY = (
  params: ProductListParams & { initialPage?: number }
) => ["products", "infinite", params]

export const useInfiniteProducts = ({
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
}: ProductListParams & {
  initialPage?: number
  totalPages?: number
  initialData?: DbProduct[]
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
    queryKey: PRODUCTS_INFINITE_QUERY_KEY(queryFilterParams),
    queryFn: async ({ pageParam = initialPage }) => {
      const data = await fetchProducts({
        ...queryFilterParams,
        page: pageParam,
      })
      return (data ?? []) as DbProduct[]
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
