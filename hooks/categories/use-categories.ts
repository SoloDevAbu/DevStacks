import { useQuery } from "@tanstack/react-query"
import { fetchCategories, type CategoryFilterType } from "@/lib/api/categories"

export const CATEGORIES_QUERY_KEY = (q?: string, type: CategoryFilterType = "all") => [
  "categories",
  q ?? "",
  type,
]

export const useCategories = (q?: string, type: CategoryFilterType = "all") => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY(q, type),
    queryFn: () => fetchCategories(q, type),
    staleTime: 60_000,
  })
}
