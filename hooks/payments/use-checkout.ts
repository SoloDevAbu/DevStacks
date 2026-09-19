"use client"

import { useMutation } from "@tanstack/react-query"
import { initiateCheckout, type CheckoutResponse } from "@/lib/api/payments"
import type { CheckoutRequestInput } from "@/lib/validation/payment"
import { toast } from "@/components/ui/toast"

export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, CheckoutRequestInput>({
    mutationFn: (payload: CheckoutRequestInput) => initiateCheckout(payload),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    },
    onError: (error) => {
      toast.error(
        "Checkout Error",
        error.message || "Failed to initiate payment session. Please try again."
      )
    },
  })
}
