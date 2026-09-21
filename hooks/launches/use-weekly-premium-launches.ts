"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchWeeklyPremiumLaunches } from "@/lib/api/launches"
import type { FeedItem } from "@/components/shared/feed-card"

export const useWeeklyPremiumLaunches = (year?: number, week?: number) =>
  useQuery<FeedItem[]>({
    queryKey: ["weekly-premium-launches", year, week],
    queryFn: () => fetchWeeklyPremiumLaunches(year, week),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  })
