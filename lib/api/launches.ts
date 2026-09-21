import { apiClient } from "@/lib/api/axios-instance"
import type { FeedItem } from "@/components/shared/feed-card"

export const fetchWeeklyLaunches = async (
  year: number,
  week: number
): Promise<FeedItem[]> => {
  const { data } = await apiClient.get<FeedItem[]>("/launches/weekly", {
    params: { year, week },
  })
  return data
}

export const fetchWeeklyPremiumLaunches = async (
  year?: number,
  week?: number
): Promise<FeedItem[]> => {
  const params = year !== undefined && week !== undefined ? { year, week } : {}
  const { data } = await apiClient.get<FeedItem[]>("/launches/premium", {
    params,
  })
  return data
}
