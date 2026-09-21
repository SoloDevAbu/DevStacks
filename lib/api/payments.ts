import { apiClient } from "@/lib/api/axios-instance"
import type { CheckoutRequestInput } from "@/lib/validation/payment"

export interface CheckoutResponse {
  checkoutUrl: string | null
  sessionId: string
  paymentId: string
  adId?: string
}

export const initiateCheckout = async (
  payload: CheckoutRequestInput
): Promise<CheckoutResponse> => {
  const idempotencyKey =
    payload.idempotencyKey ||
    (typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : undefined)

  const finalPayload = idempotencyKey
    ? { ...payload, idempotencyKey }
    : payload

  const headers = idempotencyKey
    ? { "x-idempotency-key": idempotencyKey }
    : undefined

  const { data } = await apiClient.post<CheckoutResponse>(
    "/checkout",
    finalPayload,
    { headers }
  )
  return data
}
