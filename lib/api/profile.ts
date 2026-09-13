import { apiClient } from "@/lib/api/axios-instance"
import type { UpdateProfileInput } from "@/lib/validation/profile"
import type { MakerProfile } from "@/types/entities"

export const fetchCurrentUserProfile = async (): Promise<MakerProfile> => {
  const { data } = await apiClient.get("/users/profile")
  return data.data
}

export const updateUserProfileApi = async (
  input: UpdateProfileInput
): Promise<MakerProfile> => {
  const { data } = await apiClient.patch("/users/profile", input)
  return data.data
}
