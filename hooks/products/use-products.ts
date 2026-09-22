import { useInfiniteQuery } from "@tanstack/react-query"
import { fetchProducts, type ProductListParams } from "@/lib/api/products"
import type { DbProduct } from "@/types/entities"

export const PRODUCTS_INFINITE_QUERY_KEY = (params: ProductListParams) => [
  "products",
  "infinite",
  params,
]

export const useInfiniteProducts = ({
  category,
  q,
  tag,
  platform,
  pricing,
  tier,
  sortBy,
  limit = 20,
  initialData,
}: ProductListParams & { initialData?: DbProduct[] } = {}) => {
  const queryFilterParams = {
    category,
    q,
    tag,
    platform,
    pricing,
    tier,
    sortBy,
    limit,
  }

  return useInfiniteQuery({
    queryKey: PRODUCTS_INFINITE_QUERY_KEY(queryFilterParams),
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchProducts({
        ...queryFilterParams,
        page: pageParam,
      })
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
