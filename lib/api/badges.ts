import { apiClient } from "@/lib/api/axios-instance"
import type { BadgeCheckOutcome } from "@/constants/badges"
import type { ListingKind } from "@/db/queries/badges/badge-listings"
import type { WeeklyPlacement } from "@/lib/badges/weekly-placement"

export interface BadgeStatus {
  badgeVerified: boolean
  badgeUrl: string | null
  badgeCheckedAt: string | null
  badgeCheckFailures: number
  placement: WeeklyPlacement | null
}

export interface VerifyBadgePayload {
  slug: string
  type: ListingKind
  url: string
}

export interface VerifyBadgeResponse {
  verified: boolean
  outcome: BadgeCheckOutcome
  message: string
}

export const fetchBadgeStatus = async (slug: string, type: ListingKind) => {
  const { data } = await apiClient.get<BadgeStatus>("/badge/verify", {
    params: { slug, type },
  })
  return data
}

export const verifyBadge = async (payload: VerifyBadgePayload) => {
  const { data } = await apiClient.post<VerifyBadgeResponse>(
    "/badge/verify",
    payload
  )
  return data
}
