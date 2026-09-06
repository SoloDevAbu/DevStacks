import { apiClient } from "@/lib/api/axios-instance"

export type SyncUserPayload = {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export const syncUser = async (payload: SyncUserPayload) => {
  const { data } = await apiClient.post("/users/sync", payload)
  return data.data
}

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
