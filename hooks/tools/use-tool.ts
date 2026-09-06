import { useQuery } from "@tanstack/react-query"
import { fetchTool } from "@/lib/api/products"

export const TOOL_QUERY_KEY = (slug: string) => ["tool", slug]

export const useTool = (slug: string) => {
  return useQuery({
    queryKey: TOOL_QUERY_KEY(slug),
    queryFn: () => fetchTool(slug),
    enabled: Boolean(slug),
    staleTime: 60_000,
  })
}
