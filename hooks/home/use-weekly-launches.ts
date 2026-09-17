import { useQuery } from "@tanstack/react-query"
import { fetchWeeklyLaunches } from "@/lib/api/launches"
import type { FeedItem } from "@/components/shared/feed-card"

export const useWeeklyLaunches = (year: number, week: number) =>
  useQuery<FeedItem[]>({
    queryKey: ["weekly-launches", year, week],
    queryFn: () => fetchWeeklyLaunches(year, week),
    staleTime: 60 * 1000,
  })
