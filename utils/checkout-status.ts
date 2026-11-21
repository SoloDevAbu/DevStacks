export type CheckoutReturnStatus = "succeeded" | "failed" | "cancelled"

interface ReadableParams {
  get: (name: string) => string | null
}

// The payment provider appends `status` (and sometimes `error`) to the return URL.
export const getCheckoutReturnStatus = (
  params: ReadableParams
): CheckoutReturnStatus | null => {
  const status = params.get("status")?.toLowerCase()
  if (status === "succeeded" || status === "success") return "succeeded"
  if (status === "failed" || status === "failure" || params.get("error"))
    return "failed"
  if (status === "cancelled" || status === "canceled") return "cancelled"
  return null
}
