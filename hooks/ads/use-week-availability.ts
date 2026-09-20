"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchWeekAvailability } from "@/lib/api/ads"
import type { WeekAvailability } from "@/db/queries/ads/availability"
import type { AdPlacement } from "@/constants/ads"

export const useWeekAvailability = (placement: AdPlacement) =>
  useQuery<WeekAvailability[]>({
    queryKey: ["ad-availability", placement],
    queryFn: () => fetchWeekAvailability(placement),
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  })
