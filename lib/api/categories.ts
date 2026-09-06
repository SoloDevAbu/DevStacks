import { apiClient } from "@/lib/api/axios-instance"
import type { DbCategoryItem } from "@/db/queries/categories/list"

export const fetchCategories = async (
  q?: string
): Promise<DbCategoryItem[]> => {
  const { data } = await apiClient.get("/categories", {
    params: q && q.trim() ? { q: q.trim() } : undefined,
  })
  return data.data ?? []
}
