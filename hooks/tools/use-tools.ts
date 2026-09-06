import { useQuery } from "@tanstack/react-query"
import { fetchTools, type ToolListParams } from "@/lib/api/products"

export const TOOLS_QUERY_KEY = (params: ToolListParams) => [
  "tools",
  params,
]

export const useTools = (params: ToolListParams = {}) => {
  return useQuery({
    queryKey: TOOLS_QUERY_KEY(params),
    queryFn: () => fetchTools(params),
    staleTime: 60_000,
  })
}
