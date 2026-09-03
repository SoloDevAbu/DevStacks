import { useQuery } from "@tanstack/react-query"
import { fetchBuilds, type BuildListParams } from "@/lib/api/builds"

export const BUILDS_QUERY_KEY = (params: BuildListParams) => ["builds", params]

export const useBuilds = (params: BuildListParams = {}) => {
  return useQuery({
    queryKey: BUILDS_QUERY_KEY(params),
    queryFn: () => fetchBuilds(params),
    staleTime: 60_000,
  })
}
