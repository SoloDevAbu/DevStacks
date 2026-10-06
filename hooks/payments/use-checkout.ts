"use client"

import { useMutation } from "@tanstack/react-query"
import { initiateCheckout, type CheckoutResponse } from "@/lib/api/payments"
import type { CheckoutRequestInput } from "@/lib/validation/payment"
import { toast } from "@/components/ui/toast"
import { trackBeginCheckout } from "@/lib/analytics/events"

export const useCheckout = () => {
  return useMutation<CheckoutResponse, Error, CheckoutRequestInput>({
    mutationFn: (payload: CheckoutRequestInput) => initiateCheckout(payload),
    onSuccess: (data, variables) => {
      if (data.checkoutUrl) {
        const isAd = variables.paymentType === "ad"
        trackBeginCheckout({
          currency: "USD",
          paymentType: variables.paymentType,
          itemName: isAd
            ? `Ad Sponsorship (${variables.placement})`
            : `Listing Upgrade (${variables.tier})`,
          placement: isAd ? variables.placement : undefined,
          tier: !isAd ? variables.tier : undefined,
        })
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
