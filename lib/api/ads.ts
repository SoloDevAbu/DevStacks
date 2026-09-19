import { apiClient } from "@/lib/api/axios-instance"
import type { AdPlacement } from "@/constants/ads"

export interface ActiveAdDto {
  id: string
  placement: AdPlacement
  title: string
  description: string
  badgeText: string
  imageUrl?: string | null
  ctaText: string
  ctaUrl: string
}

export const fetchActiveAds = async (
  placement: AdPlacement = "sidebar",
  limit = 5
): Promise<ActiveAdDto[]> => {
  const { data } = await apiClient.get<{ data: ActiveAdDto[] }>("/ads", {
    params: { placement, limit },
  })
  return data.data
}

export const recordAdImpression = async (adId: string): Promise<void> => {
  try {
    await apiClient.post(`/ads/${adId}/impression`)
  } catch {
    // Non-critical tracking failure is swallowed
  }
}
