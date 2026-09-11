import { apiClient } from "@/lib/api/axios-instance"
import type { DbCategoryItem } from "@/db/queries/categories/list"

export type CategoryFilterType = "tools" | "products" | "all"

export const fetchCategories = async (
  q?: string,
  type: CategoryFilterType = "all"
): Promise<DbCategoryItem[]> => {
  const params: Record<string, string> = {}
  if (q && q.trim()) params.q = q.trim()
  if (type && type !== "all") params.type = type

  const { data } = await apiClient.get("/categories", {
    params: Object.keys(params).length > 0 ? params : undefined,
  })
  return data.data ?? []
}
