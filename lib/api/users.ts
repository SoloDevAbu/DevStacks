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
