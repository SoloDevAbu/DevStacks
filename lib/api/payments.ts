import { apiClient } from "@/lib/api/axios-instance"
import type { CheckoutRequestInput } from "@/lib/validation/payment"

export interface CheckoutResponse {
  checkoutUrl: string
  sessionId: string
  paymentId: string
  adId?: string
}

export const initiateCheckout = async (
  payload: CheckoutRequestInput
): Promise<CheckoutResponse> => {
  const { data } = await apiClient.post<CheckoutResponse>("/checkout", payload)
  return data
}
