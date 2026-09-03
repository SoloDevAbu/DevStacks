import { useQuery } from "@tanstack/react-query"
import { fetchBuild } from "@/lib/api/builds"

export const BUILD_QUERY_KEY = (id: string) => ["build", id]

export const useBuild = (id: string) => {
  return useQuery({
    queryKey: BUILD_QUERY_KEY(id),
    queryFn: () => fetchBuild(id),
    enabled: Boolean(id),
    staleTime: 30_000,
  })
}
