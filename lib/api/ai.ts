import { apiClient } from "@/lib/api/axios-instance"
import type { ExtractedAiData } from "@/db/schema"

export interface AutofillResponse {
  success: boolean
  cached: boolean
  data: ExtractedAiData
}

export const autofillWithAi = async (
  url: string,
  forceRefresh = false
): Promise<AutofillResponse> => {
  const { data } = await apiClient.post<AutofillResponse>("/ai/autofill", {
    url,
    forceRefresh,
  })
  return data
}

