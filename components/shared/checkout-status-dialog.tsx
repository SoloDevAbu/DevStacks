"use client"

import { Suspense, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  LayoutDashboard,
  Home,
  RefreshCw,
  Sparkles,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"

const CheckoutStatusDialogInner = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawStatus = searchParams.get("status")
  const status = rawStatus?.toLowerCase()
  const paymentId =
    searchParams.get("payment_id") || searchParams.get("subscription_id")
  const email = searchParams.get("email")
  const customMessage =
    searchParams.get("message") || searchParams.get("error")

  const isFailed =
    status === "failed" || status === "failure" || Boolean(searchParams.get("error"))
  const isCancelled = status === "cancelled" || status === "canceled"
  const isSucceeded = status === "succeeded" || status === "success"

  const isOpen = isSucceeded || isFailed || isCancelled

  const clearParamsAndNavigate = useCallback(
    (targetPath?: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("status")
      params.delete("payment_id")
      params.delete("subscription_id")
      params.delete("email")
      params.delete("message")
      params.delete("error")

      const nextQuery = params.toString()
      const destination = targetPath ?? pathname
      const nextUrl = nextQuery ? `${destination}?${nextQuery}` : destination

      router.replace(nextUrl)
    },
    [searchParams, pathname, router]
  )

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      clearParamsAndNavigate()
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {isFailed && (
          <>
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-2xs">
                <XCircle className="size-7" />
              </div>

              <div className="flex items-center justify-center">
                <Badge
                  variant="destructive"
                  className="border-rose-200 bg-rose-50 text-rose-700"
                >
                  <AlertCircle className="mr-1 size-3" /> Payment Failed
                </Badge>
              </div>

              <DialogTitle className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
                Payment Unsuccessful
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Your payment could not be processed by Dodo Payments. No funds
                were deducted from your account.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-dashed border-rose-200/80 bg-rose-50/40 p-3 text-xs text-slate-700 space-y-1.5">
              {paymentId && (
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-rose-900">Reference:</span>
                  <span className="font-mono text-slate-600">{paymentId}</span>
                </div>
              )}
              {email && (
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-rose-900">Email:</span>
                  <span className="text-slate-600">{email}</span>
                </div>
              )}
              {customMessage && (
                <div className="flex items-start gap-1.5">
                  <span className="font-semibold text-rose-900">Reason:</span>
                  <span className="text-slate-600">{customMessage}</span>
                </div>
              )}
              <div className="text-slate-600 pt-0.5">
                Please verify your payment method, ensure international
                transactions are enabled, or try another card.
              </div>
            </div>

            <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs font-semibold text-slate-700"
                onClick={() => clearParamsAndNavigate(ROUTES.DASHBOARD)}
              >
                <LayoutDashboard className="mr-1.5 size-3.5" />
                <span>Dashboard</span>
              </Button>

              <Button
                className="w-full sm:w-auto bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                onClick={() => clearParamsAndNavigate(ROUTES.PRICING)}
              >
                <RefreshCw className="mr-1.5 size-3.5" />
                <span>Try Again</span>
              </Button>
            </DialogFooter>
          </>
        )}

        {isCancelled && (
          <>
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-2xs">
                <AlertTriangle className="size-7" />
              </div>

              <div className="flex items-center justify-center">
                <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                  <AlertTriangle className="mr-1 size-3" /> Checkout Cancelled
                </Badge>
              </div>

              <DialogTitle className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
                Checkout Incomplete
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                You exited checkout before completing the payment. No charges were
                made.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-dashed border-amber-200/80 bg-amber-50/40 p-3 text-xs text-slate-700">
              Your spot or upgrade has not been reserved. You can resume
              checkout anytime from our pricing page or dashboard.
            </div>

            <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs font-semibold text-slate-700"
                onClick={() => clearParamsAndNavigate(ROUTES.DASHBOARD)}
              >
                <LayoutDashboard className="mr-1.5 size-3.5" />
                <span>Dashboard</span>
              </Button>

              <Button
                className="w-full sm:w-auto bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                onClick={() => clearParamsAndNavigate(ROUTES.PRICING)}
              >
                <span>Pricing</span>
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </DialogFooter>
          </>
        )}

        {isSucceeded && (
          <>
            <DialogHeader className="text-center sm:text-center">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-2xs">
                <CheckCircle2 className="size-7" />
              </div>

              <div className="flex items-center justify-center">
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  <Sparkles className="mr-1 size-3" /> Confirmed via Dodo Payments
                </Badge>
              </div>

              <DialogTitle className="mt-2 text-base font-bold text-slate-900 sm:text-lg">
                Payment Successful!
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-600">
                Thank you for supporting {SITE_CONFIG.name}. Your campaign / upgrade
                is being activated across our developer directory.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg border border-dashed border-emerald-200/80 bg-emerald-50/40 p-3 text-xs text-slate-700 space-y-1.5">
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-800">✓ Activation:</span>
                <span>Ads and listings activate immediately.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="font-bold text-emerald-800">✓ Receipt:</span>
                <span>
                  Sent to{" "}
                  {email ? (
                    <span className="font-semibold text-slate-900">{email}</span>
                  ) : (
                    "your email"
                  )}
                  .
                </span>
              </div>
              {paymentId && (
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-emerald-800">✓ Reference:</span>
                  <span className="font-mono text-slate-600">{paymentId}</span>
                </div>
              )}
            </div>

            <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="w-full sm:w-auto text-xs font-semibold text-slate-700"
                onClick={() => clearParamsAndNavigate(ROUTES.HOME)}
              >
                <Home className="mr-1.5 size-3.5" />
                <span>Home</span>
              </Button>

              <Button
                className="w-full sm:w-auto bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                onClick={() => clearParamsAndNavigate(ROUTES.DASHBOARD)}
              >
                <LayoutDashboard className="mr-1.5 size-3.5" />
                <span>Dashboard</span>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export const CheckoutStatusDialog = () => {
  return (
    <Suspense fallback={null}>
      <CheckoutStatusDialogContent />
    </Suspense>
  )
}

const CheckoutStatusDialogContent = () => {
  return <CheckoutStatusDialogInner />
}
