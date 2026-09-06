import { useQuery } from "@tanstack/react-query"
import { fetchCategories } from "@/lib/api/categories"

export const CATEGORIES_QUERY_KEY = (q?: string) => ["categories", q ?? ""]

export const useCategories = (q?: string) => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY(q),
    queryFn: () => fetchCategories(q),
    staleTime: 60_000,
  })
}
