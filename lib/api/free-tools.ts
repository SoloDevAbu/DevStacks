import { apiClient } from "@/lib/api/axios-instance"
import { FREE_TOOL_FETCH } from "@/constants/free-tools"
import type {
  AiReadinessReport,
  DomainRatingResponse,
} from "@/types/free-tools"

export const checkDomainRatings = async (domains: string[]) => {
  const { data } = await apiClient.post<DomainRatingResponse>(
    "/free-tools/domain-rating",
    { domains },
    { timeout: FREE_TOOL_FETCH.CLIENT_TIMEOUT_MS }
  )
  return data
}

export const checkAiReadiness = async (url: string) => {
  const { data } = await apiClient.post<AiReadinessReport>(
    "/free-tools/ai-readiness",
    { url },
    { timeout: FREE_TOOL_FETCH.CLIENT_TIMEOUT_MS }
  )
  return data
}
