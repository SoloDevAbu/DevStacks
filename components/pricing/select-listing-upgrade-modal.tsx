"use client"

import { useState } from "react"
import Link from "next/link"
import { Sparkles, Crown, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"
import { useSession } from "@/lib/auth/client"
import { useUserSubmissions } from "@/hooks/ads/use-user-submissions"
import { useCheckout } from "@/hooks/payments/use-checkout"
import { upgradeModalContainer, upgradeListingCard } from "@/utils/styles"
import type { UserSubmissionDto } from "@/lib/api/ads"

interface SelectListingUpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  targetTier: Tier
}

export const SelectListingUpgradeModal = ({
  isOpen,
  onClose,
  targetTier,
}: SelectListingUpgradeModalProps) => {
  const { data: session } = useSession()
  const user = session?.user
  const plan = PLANS[targetTier] || PLANS[TIER.PREMIUM]

  const { data: submissions, isLoading } = useUserSubmissions(true)
  const checkoutMutation = useCheckout()
  const [selectedItem, setSelectedItem] = useState<UserSubmissionDto | null>(null)

  const isEligible = (item: UserSubmissionDto): boolean => {
    if (item.status === "rejected") return false
    if (targetTier === TIER.PREMIUM) {
      return item.tier === TIER.FREE
    }
    if (targetTier === TIER.PREMIUM_PLUS) {
      return item.tier === TIER.FREE || item.tier === TIER.PREMIUM
    }
    return false
  }

  const handleProceed = () => {
    if (!selectedItem) return
    checkoutMutation.mutate({
      paymentType: "listing",
      itemType: selectedItem.type,
      itemId: selectedItem.id,
      tier: targetTier as typeof TIER.PREMIUM | typeof TIER.PREMIUM_PLUS,
    })
  }

  const handlePrePurchaseCredit = () => {
    checkoutMutation.mutate({
      paymentType: "listing",
      tier: targetTier as typeof TIER.PREMIUM | typeof TIER.PREMIUM_PLUS,
      returnToSubmit: true,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !checkoutMutation.isPending && onClose()}>
      <DialogContent className={upgradeModalContainer}>
        <DialogHeader className="border-b border-slate-100 p-6 text-left">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {targetTier === TIER.PREMIUM_PLUS ? (
                <Crown className="size-5" />
              ) : (
                <Sparkles className="size-5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Upgrade to {plan.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Select one of your submitted listings to upgrade for {plan.price} ({plan.period}).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-1 flex-col overflow-y-auto p-6">
          {!user ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <AlertCircle className="size-8 text-amber-500" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900">Sign in required</span>
                <p className="text-xs text-slate-500">
                  Please sign in to view your listings and select one to upgrade.
                </p>
              </div>
              <Button
                size="sm"
                className="mt-2 text-xs"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT} />}
              >
                Sign In to Continue
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6 text-blue-600" />
            </div>
          ) : !submissions || submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-slate-900">No listings found</span>
                <p className="text-xs text-slate-500">
                  You haven&apos;t submitted any developer tools or products yet.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <Button
                  size="sm"
                  className="bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
                  onClick={handlePrePurchaseCredit}
                  disabled={checkoutMutation.isPending}
                >
                  <Sparkles className="mr-1.5 size-3.5" />
                  Pre-purchase {plan.name} Credit ({plan.price})
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs font-semibold"
                  nativeButton={false}
                  render={<Link href={ROUTES.SUBMIT} />}
                >
                  Submit Free First
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-semibold text-slate-700">
                Choose a listing to upgrade:
              </span>
              <div className="flex flex-col gap-2">
                {submissions.map((item) => {
                  const eligible = isEligible(item)
                  const isSelected = selectedItem?.id === item.id

                  return (
                    <div
                      key={item.id}
                      onClick={() => eligible && setSelectedItem(item)}
                      className={upgradeListingCard(isSelected, !eligible)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="size-9 rounded-lg border border-slate-200">
                          {item.logoUrl ? (
                            <AvatarImage src={item.logoUrl} alt={item.name} />
                          ) : null}
                          <AvatarFallback className="rounded-lg text-xs font-bold uppercase">
                            {item.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="truncate text-xs font-bold text-slate-900">
                              {item.name}
                            </span>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {item.type}
                            </Badge>
                            {item.status === "pending" && (
                              <Badge
                                variant="outline"
                                className="border-amber-300 bg-amber-50 text-[10px] text-amber-700"
                              >
                                Scheduled / Pending
                              </Badge>
                            )}
                          </div>
                          <span className="truncate text-[11px] text-slate-500">
                            {item.tagline || item.websiteUrl}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {!eligible ? (
                          <Badge variant="secondary" className="text-[10px]">
                            {item.tier === targetTier ? "Current Plan" : "Already Upgraded"}
                          </Badge>
                        ) : isSelected ? (
                          <CheckCircle2 className="size-5 text-blue-600" />
                        ) : (
                          <div className="size-4 rounded-full border border-slate-300" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-4 flex flex-col gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/50 p-3 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span>Want to submit a new product directly with {plan.name}?</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrePurchaseCredit}
                  disabled={checkoutMutation.isPending}
                  className="h-7 border-blue-300 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  <Sparkles className="mr-1.5 size-3" />
                  Pre-pay & Unlock Studio ({plan.price})
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 p-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={checkoutMutation.isPending}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleProceed}
            disabled={!selectedItem || checkoutMutation.isPending}
            className="gap-1.5 bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700"
          >
            {checkoutMutation.isPending ? (
              <>
                <Spinner className="size-3.5" />
                <span>Redirecting...</span>
              </>
            ) : (
              <span>Proceed to Checkout ({plan.price})</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

