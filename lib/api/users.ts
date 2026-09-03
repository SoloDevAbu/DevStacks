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
