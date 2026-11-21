import { apiClient } from "@/lib/api/axios-instance"
import type { FeedItem } from "@/components/shared/feed-card"

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

export interface LaunchWeekSlot {
  isoYear: number
  isoWeek: number
  startDate: string
  endDate: string
  weekLabel: string
  dateRange: string
  freeSlotsUsed: number
  freeSlotsRemaining: number
  isFreeFull: boolean
}

export interface LaunchAvailabilityResponse {
  weeks: LaunchWeekSlot[]
}

export const fetchLaunchAvailability =
  async (): Promise<LaunchAvailabilityResponse> => {
    const { data } = await apiClient.get<{ data: LaunchAvailabilityResponse }>(
      "/launches/availability"
    )
    return data.data
  }
