import { apiClient } from "@/lib/api/axios-instance"
import type { SubmitBuildInput } from "@/lib/validation/build"

export type BuildListParams = {
  productId?: string
  authorId?: string
  page?: number
  limit?: number
}

export const fetchBuilds = async (params: BuildListParams = {}) => {
  const { data } = await apiClient.get("/builds", { params })
  return data.data
}

export const fetchBuild = async (id: string) => {
  const { data } = await apiClient.get(`/builds/${id}`)
  return data.data
}

export const submitBuild = async (payload: SubmitBuildInput) => {
  const { data } = await apiClient.post("/builds", payload)
  return data.data
}
