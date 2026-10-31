import { apiClient } from "@/lib/api/axios-instance"
import type { Tier } from "@/constants/plans"

export type UserInteractionsData = {
  upvotedToolIds: string[]
  upvotedToolSlugs: string[]
  bookmarkedToolIds: string[]
  bookmarkedToolSlugs: string[]
  likedProductIds: string[]
  likedProductSlugs: string[]
  bookmarkedProductIds: string[]
  bookmarkedProductSlugs: string[]
}

export const fetchUserInteractions = async (
  userId?: string
): Promise<UserInteractionsData> => {
  const { data } = await apiClient.get("/users/interactions", {
    params: userId ? { userId } : {},
  })
  return data.data
}

export type CheckUsernameResponse = {
  available: boolean
  isCurrent?: boolean
  message?: string
}

export const checkUsernameAvailability = async (
  username: string
): Promise<CheckUsernameResponse> => {
  const { data } = await apiClient.get<CheckUsernameResponse>(
    "/users/check-username",
    {
      params: { username },
    }
  )
  return data
}

export interface UserListingCreditDto {
  id: string
  tier: Tier
  amount: number
  createdAt: string
}

export const fetchUserListingCredit = async (): Promise<UserListingCreditDto | null> => {
  const { data } = await apiClient.get<{ data: UserListingCreditDto | null }>(
    "/users/credits"
  )
  return data.data
}
