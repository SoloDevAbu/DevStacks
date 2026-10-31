import { apiClient } from "@/lib/api/axios-instance"
import type { AdPlacement } from "@/constants/ads"
import type { WeekAvailability } from "@/db/queries/ads/availability"
import type { Tier } from "@/constants/plans"

export interface ActiveAdDto {
  id: string
  placement: AdPlacement
  name: string
  tagline: string
  logoUrl: string | null
  websiteUrl: string
  slug: string
  ctaText: string
  type: "tool" | "product"
  tier?: Tier
}

export interface UserSubmissionDto {
  id: string
  name: string
  tagline: string
  logoUrl: string | null
  websiteUrl: string
  slug: string
  tier: Tier
  type: "tool" | "product"
  status?: string
  badgeVerified?: boolean
}

export const fetchActiveAds = async (
  placement: AdPlacement = "sidebar",
  limit = 3
): Promise<ActiveAdDto[]> => {
  const { data } = await apiClient.get<{ data: ActiveAdDto[] }>("/ads", {
    params: { placement, limit },
  })
  return data.data
}

export const fetchWeekAvailability = async (
  placement: AdPlacement
): Promise<WeekAvailability[]> => {
  const { data } = await apiClient.get<{ data: WeekAvailability[] }>(
    "/ads/availability",
    { params: { placement } }
  )
  return data.data
}

export const fetchUserSubmissions = async (
  includePending = false
): Promise<UserSubmissionDto[]> => {
  const { data } = await apiClient.get<{ data: UserSubmissionDto[] }>(
    "/users/submissions",
    {
      params: includePending ? { includePending: true } : {},
    }
  )
  return data.data
}

export const recordAdImpression = async (adId: string): Promise<void> => {
  try {
    await apiClient.post(`/ads/${adId}/impression`)
  } catch {
    // Non-critical tracking failure is swallowed
  }
}

export const recordAdClick = async (adId: string): Promise<void> => {
  try {
    await apiClient.post(`/ads/${adId}/click`)
  } catch {
    // Non-critical tracking failure is swallowed
  }
}
