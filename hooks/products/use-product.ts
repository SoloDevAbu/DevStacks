import { useQuery } from "@tanstack/react-query"
import { fetchProduct } from "@/lib/api/products"

export const PRODUCT_QUERY_KEY = (slug: string) => ["product", slug]

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEY(slug),
    queryFn: () => fetchProduct(slug),
    enabled: Boolean(slug),
    staleTime: 30_000,
  })
}
