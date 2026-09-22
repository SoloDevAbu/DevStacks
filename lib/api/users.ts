import { apiClient } from "@/lib/api/axios-instance"

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

