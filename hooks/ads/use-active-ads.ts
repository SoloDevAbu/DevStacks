"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchActiveAds, type ActiveAdDto } from "@/lib/api/ads"
import { AD_PLACEMENT, type AdPlacement } from "@/constants/ads"

export const useActiveAds = (placement: AdPlacement = AD_PLACEMENT.SIDEBAR) =>
  useQuery<ActiveAdDto[]>({
    queryKey: ["ads", placement],
    queryFn: () => fetchActiveAds(placement),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  })
