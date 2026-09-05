import { useQuery } from "@tanstack/react-query"
import {
  fetchPopularBuildingBlocks,
  type RankingQueryParams,
} from "@/lib/api/products"

export const POPULAR_BUILDING_BLOCKS_QUERY_KEY = (
  params: RankingQueryParams
) => ["products", "popular-building-blocks", params]

export const usePopularBuildingBlocks = (params: RankingQueryParams = {}) => {
  return useQuery({
    queryKey: POPULAR_BUILDING_BLOCKS_QUERY_KEY(params),
    queryFn: () => fetchPopularBuildingBlocks(params),
    staleTime: 60_000,
  })
}
