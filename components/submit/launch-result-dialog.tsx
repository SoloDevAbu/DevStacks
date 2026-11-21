"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  BadgeCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { PLANS, isPaidTier } from "@/constants/plans"
import { ROUTES, SUBMIT_LAUNCH_PARAMS } from "@/constants/routes"
import { useCheckout } from "@/hooks/payments/use-checkout"
import { useApplyPremiumFields } from "@/hooks/submit/use-apply-premium-fields"
import { trackLaunchFunnel } from "@/lib/analytics/events"
import { getCheckoutReturnStatus } from "@/utils/checkout-status"
import {
  clearPendingLaunch,
  readPendingLaunch,
  type PendingLaunch,
} from "@/utils/submit/pending-launch"
import { scheduleModalContainer, scheduleIconBox } from "@/utils/styles"

interface LaunchResultDialogProps {
  onShowBadge: (launch: PendingLaunch) => void
}

// Shown on /submit when an in-flow listing checkout returns. The listing already exists as a
// Free launch; a successful payment upgrades it through the webhook.
export const LaunchResultDialog = ({
  onShowBadge,
}: LaunchResultDialogProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const itemId = searchParams.get(SUBMIT_LAUNCH_PARAMS.ID)
  const itemType = searchParams.get(SUBMIT_LAUNCH_PARAMS.TYPE)
  const tierParam = searchParams.get(SUBMIT_LAUNCH_PARAMS.TIER)
  const isSucceeded = getCheckoutReturnStatus(searchParams) === "succeeded"

  const [pending] = useState(() => (itemId ? readPendingLaunch(itemId) : null))
  const checkout = useCheckout()
  const { mutate: applyPremiumFields, isPending: isApplyingFields } =
    useApplyPremiumFields()
  const hasApplied = useRef(false)

  useEffect(() => {
    if (!isSucceeded || !pending || hasApplied.current) return
    hasApplied.current = true
    applyPremiumFields(pending, {
      onSettled: () => clearPendingLaunch(pending.id),
    })
  }, [isSucceeded, pending, applyPremiumFields])

  if (!itemId || (itemType !== "product" && itemType !== "tool")) return null

  const tier = isPaidTier(tierParam) ? tierParam : undefined
  const plan = tier ? PLANS[tier] : undefined
  const name = pending?.name ?? `Your ${itemType}`

  const close = () => router.replace(ROUTES.SUBMIT)

  const retryPayment = () => {
    if (!tier) return
    trackLaunchFunnel("launch_payment_retry", { itemType, tier })
    checkout.mutate({
      paymentType: "listing",
      tier,
      itemType,
      itemId,
      returnToSubmit: true,
    })
  }

  const showBadge = () => {
    if (!pending) return
    onShowBadge(pending)
    close()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && close()}>
      <DialogContent className={scheduleModalContainer}>
        <DialogHeader className="p-0 text-left">
          <div className="flex items-start gap-3.5 pr-8">
            <div className={scheduleIconBox}>
              {isSucceeded ? (
                <CheckCircle2 className="size-5" />
              ) : (
                <CalendarCheck className="size-5" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-bold text-slate-900">
                {isSucceeded
                  ? `${name} is launching with ${plan?.name ?? "Premium"}`
                  : `${name} is scheduled as a free launch`}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                {isSucceeded
                  ? "Payment confirmed. Your listing link is permanently Do-Follow, and your launch blog is written once the listing is approved."
                  : "The payment wasn't completed, so nothing was charged. Your launch is saved and you can still upgrade, or earn a Do-Follow link with our badge."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isSucceeded && isApplyingFields && (
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Spinner className="size-3.5" /> Saving your FAQs and SEO fields…
          </p>
        )}

        <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {isSucceeded ? (
            <>
              <Button
                variant="outline"
                className="text-xs"
                onClick={() => router.replace(ROUTES.DASHBOARD)}
              >
                Go to dashboard
              </Button>
              <Button className="text-xs font-semibold" onClick={close}>
                Launch another
              </Button>
            </>
          ) : (
            <>
              {pending && (
                <Button
                  variant="outline"
                  className="gap-1.5 text-xs"
                  onClick={showBadge}
                >
                  <BadgeCheck className="size-3.5" />
                  Get the badge instead
                </Button>
              )}
              {plan && (
                <Button
                  className="gap-1.5 text-xs font-semibold"
                  disabled={checkout.isPending}
                  onClick={retryPayment}
                >
                  {checkout.isPending ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <CreditCard className="size-3.5" />
                  )}
                  Complete payment ({plan.price})
                </Button>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
