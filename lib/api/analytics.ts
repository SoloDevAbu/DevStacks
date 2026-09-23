import { apiClient } from "@/lib/api/axios-instance"

export interface TrackVisitPayload {
  itemType: "product" | "tool"
  id: string
  targetUrl: string
}

export const trackExternalVisit = async (payload: TrackVisitPayload) => {
  try {
    await apiClient.post("/track/visit", payload)
  } catch (error) {
    // Non-blocking: fail silently on tracking errors
    console.debug("Failed to record external visit", error)
  }
}
