import { useQuery } from "@tanstack/react-query"
import { fetchProducts, type ProductListParams } from "@/lib/api/products"

export const PRODUCTS_QUERY_KEY = (params: ProductListParams) => [
  "products",
  params,
]

export const useProducts = (params: ProductListParams = {}) => {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY(params),
    queryFn: () => fetchProducts(params),
    staleTime: 60_000,
  })
}
