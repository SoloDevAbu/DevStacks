import { apiClient } from "@/lib/api/axios-instance"
import type { SubmitBuildInput } from "@/lib/validation/build"

export const submitBuild = async (payload: SubmitBuildInput) => {
  const { data } = await apiClient.post("/builds", payload)
  return data.data
}

