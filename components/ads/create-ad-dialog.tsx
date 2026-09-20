"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import {
  AD_PLACEMENT,
  AD_PRICING,
  AD_MAX_WEEKS_PER_PRODUCT,
  AD_TIER_BONUS,
  AD_EXISTING_TIER_DISCOUNT,
  type AdPlacement,
} from "@/constants/ads"
import { TIER, type Tier } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"
import { useCheckout } from "@/hooks/payments/use-checkout"
import { useSession, signIn } from "@/lib/auth/client"
import { useUserSubmissions } from "@/hooks/ads/use-user-submissions"
import { useWeekAvailability } from "@/hooks/ads/use-week-availability"
import type { UserSubmissionDto } from "@/lib/api/ads"
import { formatWeekLabel, formatWeekRangeShort } from "@/utils/iso-weeks"
import {
  weekPickerGrid,
  weekPickerSlot,
  promoBanner,
  promoBannerSuccess,
  noSubmissionsCard,
  submissionSelectorItem,
} from "@/utils/styles"
import {
  Sparkles,
  Megaphone,
  Globe,
  AlertTriangle,
  Check,
  Gift,
  ArrowRight,
  ArrowLeft,
  Package,
  Wrench,
  CalendarDays,
} from "lucide-react"

interface CreateAdDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPlacement?: AdPlacement
}

type DialogStep = "select-product" | "select-weeks" | "review"

interface SelectedWeek {
  isoYear: number
  isoWeek: number
}

export const CreateAdDialog = ({
  open,
  onOpenChange,
  defaultPlacement = AD_PLACEMENT.SIDEBAR,
}: CreateAdDialogProps) => {
  const { data: session } = useSession()
  const { mutate: initiateCheckout, isPending } = useCheckout()
  const { data: submissions = [], isLoading: loadingSubmissions } =
    useUserSubmissions()
  const { data: availability = [], isLoading: loadingAvailability } =
    useWeekAvailability(defaultPlacement)

  const [step, setStep] = useState<DialogStep>("select-product")
  const [selectedSubmission, setSelectedSubmission] =
    useState<UserSubmissionDto | null>(null)
  const [selectedWeeks, setSelectedWeeks] = useState<SelectedWeek[]>([])
  const [ctaText, setCtaText] = useState("Learn More")

  const placement = defaultPlacement
  const pricing = AD_PRICING[placement]

  const resetDialog = () => {
    setStep("select-product")
    setSelectedSubmission(null)
    setSelectedWeeks([])
    setCtaText("Learn More")
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) resetDialog()
    onOpenChange(isOpen)
  }

  // Tier bonus logic
  const weekCount = selectedWeeks.length
  const tierBonusApplied = useMemo((): Tier | null => {
    if (weekCount >= AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD) return TIER.PREMIUM_PLUS
    if (weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD) return TIER.PREMIUM
    return null
  }, [weekCount])

  // Discount for existing tier holders
  const discountInCents = useMemo(() => {
    if (!selectedSubmission || !tierBonusApplied) return 0
    const currentTier = selectedSubmission.tier

    if (currentTier === TIER.PREMIUM_PLUS) {
      return weekCount >= AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD
        ? AD_EXISTING_TIER_DISCOUNT.PREMIUM_PLUS
        : weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD
          ? AD_EXISTING_TIER_DISCOUNT.PREMIUM
          : 0
    }
    if (currentTier === TIER.PREMIUM) {
      return weekCount >= AD_TIER_BONUS.PREMIUM_THRESHOLD
        ? AD_EXISTING_TIER_DISCOUNT.PREMIUM
        : 0
    }
    return 0
  }, [selectedSubmission, tierBonusApplied, weekCount])

  const subtotalInCents = weekCount * pricing.pricePerWeekInCents
  const totalInCents = Math.max(0, subtotalInCents - discountInCents)

  const toggleWeek = (week: SelectedWeek) => {
    setSelectedWeeks((prev) => {
      const exists = prev.some(
        (w) => w.isoYear === week.isoYear && w.isoWeek === week.isoWeek
      )
      if (exists) return prev.filter((w) => !(w.isoYear === week.isoYear && w.isoWeek === week.isoWeek))
      if (prev.length >= AD_MAX_WEEKS_PER_PRODUCT) return prev
      return [...prev, week]
    })
  }

  const isWeekSelected = (isoYear: number, isoWeek: number) =>
    selectedWeeks.some((w) => w.isoYear === isoYear && w.isoWeek === isoWeek)

  const handleSubmit = () => {
    if (!session?.user) {
      signIn.social({ provider: "google" })
      return
    }

    if (!selectedSubmission || selectedWeeks.length === 0) return

    initiateCheckout({
      paymentType: "ad",
      placement,
      toolId: selectedSubmission.type === "tool" ? selectedSubmission.id : undefined,
      productId: selectedSubmission.type === "product" ? selectedSubmission.id : undefined,
      selectedWeeks,
      ctaText: ctaText || "Learn More",
    })
  }

  const weeksUntilPremium = Math.max(0, AD_TIER_BONUS.PREMIUM_THRESHOLD - weekCount)
  const weeksUntilPremiumPlus = Math.max(0, AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD - weekCount)

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
              <Megaphone className="size-4" />
            </span>
            <DialogTitle className="text-base font-bold text-slate-900">
              {placement === AD_PLACEMENT.SIDEBAR
                ? "Book Sidebar Placement"
                : "Book Feed Placement"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-slate-500">
            Promote your tool or product to thousands of developers.
            <span className="ml-1 font-semibold text-indigo-600">
              ${pricing.pricePerWeek}/week
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 p-1.5">
          {(["select-product", "select-weeks", "review"] as DialogStep[]).map(
            (s, i) => (
              <div
                key={s}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors ${
                  step === s
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-400"
                }`}
              >
                <span className={`flex size-4 items-center justify-center rounded-full text-[10px] font-bold ${
                  step === s ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {i + 1}
                </span>
                {s === "select-product" ? "Product" : s === "select-weeks" ? "Weeks" : "Review"}
              </div>
            )
          )}
        </div>

        {/* Step 1: Select Product/Tool */}
        {step === "select-product" && (
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-slate-700">
              Select a tool or product to promote
            </Label>

            {loadingSubmissions ? (
              <div className="flex items-center justify-center py-8">
                <Spinner className="size-5 text-indigo-600" />
              </div>
            ) : submissions.length === 0 ? (
              <div className={noSubmissionsCard}>
                <AlertTriangle className="size-8 text-amber-500" />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    No submissions found
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    You need to submit a tool or product first before promoting
                    it.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    nativeButton={false}
                    render={<Link href={ROUTES.SUBMIT} />}
                  >
                    <Wrench className="mr-1.5 size-3" />
                    Submit Tool
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    nativeButton={false}
                    render={<Link href={ROUTES.SHOWCASE} />}
                  >
                    <Package className="mr-1.5 size-3" />
                    Showcase Product
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubmission(sub)}
                    className={submissionSelectorItem(
                      selectedSubmission?.id === sub.id
                    )}
                  >
                    {sub.logoUrl ? (
                      <img
                        src={sub.logoUrl}
                        alt={sub.name}
                        className="size-8 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-0.5"
                      />
                    ) : (
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-600">
                        <Globe className="size-4" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {sub.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[9px] px-1 py-0"
                        >
                          {sub.type === "tool" ? "Tool" : "Product"}
                        </Badge>
                        {sub.tier !== "free" && (
                          <Badge className="shrink-0 bg-blue-100 text-[9px] text-blue-700 px-1 py-0">
                            {sub.tier === "premium+" ? "Premium+" : "Premium"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {sub.tagline}
                      </p>
                    </div>
                    {selectedSubmission?.id === sub.id && (
                      <Check className="size-4 shrink-0 text-indigo-600" />
                    )}
                  </div>
                ))}
              </div>
            )}

            <DialogFooter className="pt-1">
              <Button
                onClick={() => setStep("select-weeks")}
                disabled={!selectedSubmission}
                className="w-full bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Continue
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 2: Select Weeks + CTA */}
        {step === "select-weeks" && (
          <div className="space-y-3">
            {/* Selected product reminder */}
            {selectedSubmission && (
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2.5">
                {selectedSubmission.logoUrl ? (
                  <img
                    src={selectedSubmission.logoUrl}
                    alt={selectedSubmission.name}
                    className="size-6 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-0.5"
                  />
                ) : (
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                    <Globe className="size-3.5" />
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-900 truncate">
                  {selectedSubmission.name}
                </span>
                <Badge variant="outline" className="ml-auto shrink-0 text-[9px] px-1 py-0">
                  {selectedSubmission.type === "tool" ? "Tool" : "Product"}
                </Badge>
              </div>
            )}

            {/* Week Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-700">
                  <CalendarDays className="mr-1 inline size-3.5" />
                  Select weeks ({weekCount}/{AD_MAX_WEEKS_PER_PRODUCT} max)
                </Label>
                {weekCount > 0 && (
                  <span className="text-[11px] font-semibold text-indigo-600">
                    {weekCount} week{weekCount > 1 ? "s" : ""} · $
                    {(subtotalInCents / 100).toFixed(0)}
                  </span>
                )}
              </div>

              {loadingAvailability ? (
                <div className="flex items-center justify-center py-8">
                  <Spinner className="size-5 text-indigo-600" />
                </div>
              ) : (
                <div className={weekPickerGrid}>
                  {availability.map((week) => {
                    const isFull = week.slotsRemaining <= 0
                    const selected = isWeekSelected(week.isoYear, week.isoWeek)
                    const atMax =
                      selectedWeeks.length >= AD_MAX_WEEKS_PER_PRODUCT && !selected
                    const disabled = isFull || atMax

                    return (
                      <div
                        key={`${week.isoYear}-${week.isoWeek}`}
                        onClick={() =>
                          !disabled &&
                          toggleWeek({
                            isoYear: week.isoYear,
                            isoWeek: week.isoWeek,
                          })
                        }
                        className={weekPickerSlot(selected, disabled)}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-900">
                            W{week.isoWeek}
                          </span>
                          {selected ? (
                            <Check className="size-3.5 text-indigo-600" />
                          ) : isFull ? (
                            <Badge
                              variant="outline"
                              className="text-[8px] px-1 py-0 border-red-200 text-red-500"
                            >
                              Full
                            </Badge>
                          ) : (
                            <span className="text-[9px] font-medium text-slate-400">
                              {week.slotsRemaining}/{3}
                            </span>
                          )}
                        </div>
                        <span className="mt-0.5 text-[10px] text-slate-500">
                          {formatWeekRangeShort(week.isoYear, week.isoWeek)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Promotional Tier Banner */}
            {weekCount > 0 && (
              <>
                {tierBonusApplied === TIER.PREMIUM_PLUS ? (
                  <div className={promoBannerSuccess}>
                    <Gift className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        🌟 Premium+ upgrade included!
                      </span>
                      <p className="mt-0.5 text-[11px] opacity-80">
                        Your listing will be upgraded to Premium+ automatically.
                      </p>
                      {discountInCents > 0 && (
                        <p className="mt-0.5 text-[11px] font-semibold">
                          ${(discountInCents / 100).toFixed(0)} discount applied
                          (existing tier)
                        </p>
                      )}
                    </div>
                  </div>
                ) : tierBonusApplied === TIER.PREMIUM ? (
                  <div className={promoBannerSuccess}>
                    <Gift className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        ✅ Premium upgrade included!
                      </span>
                      <p className="mt-0.5 text-[11px] opacity-80">
                        Select {weeksUntilPremiumPlus} more week
                        {weeksUntilPremiumPlus > 1 ? "s" : ""} for Premium+.
                      </p>
                      {discountInCents > 0 && (
                        <p className="mt-0.5 text-[11px] font-semibold">
                          ${(discountInCents / 100).toFixed(0)} discount applied
                          (existing tier)
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={promoBanner}>
                    <Sparkles className="size-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        Select {weeksUntilPremium} more week
                        {weeksUntilPremium > 1 ? "s" : ""} to unlock a FREE
                        Premium listing upgrade 🎉
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* CTA Text */}
            <div className="space-y-1">
              <Label
                htmlFor="ad-cta-text"
                className="text-xs font-semibold text-slate-700"
              >
                CTA Button Text
              </Label>
              <Input
                id="ad-cta-text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Try Free, Learn More"
                maxLength={30}
                className="text-xs"
              />
            </div>

            <DialogFooter className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setStep("select-product")}
                className="text-xs"
              >
                <ArrowLeft className="mr-1 size-3" />
                Back
              </Button>
              <Button
                onClick={() => setStep("review")}
                disabled={selectedWeeks.length === 0}
                className="flex-1 bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Review Order
                <ArrowRight className="ml-1.5 size-3.5" />
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* Step 3: Review & Pay */}
        {step === "review" && (
          <div className="space-y-3">
            {/* Order Summary */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 space-y-3">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Order Summary
              </span>

              {/* Product */}
              {selectedSubmission && (
                <div className="flex items-center gap-2">
                  {selectedSubmission.logoUrl ? (
                    <img
                      src={selectedSubmission.logoUrl}
                      alt={selectedSubmission.name}
                      className="size-7 shrink-0 rounded-md border border-slate-200 bg-white object-contain p-0.5"
                    />
                  ) : (
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                      <Globe className="size-3.5" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      {selectedSubmission.name}
                    </span>
                    <p className="text-[10px] text-slate-500">
                      {placement === AD_PLACEMENT.SIDEBAR
                        ? "Right Sidebar"
                        : "Discovery Feed"}{" "}
                      Placement
                    </p>
                  </div>
                </div>
              )}

              {/* Selected Weeks */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500">
                  Booked Weeks ({weekCount})
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedWeeks
                    .sort((a, b) => a.isoWeek - b.isoWeek)
                    .map((w) => (
                      <Badge
                        key={`${w.isoYear}-${w.isoWeek}`}
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {formatWeekLabel(w.isoYear, w.isoWeek)}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-1.5 border-t border-dashed border-slate-200 pt-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>
                    {weekCount} week{weekCount > 1 ? "s" : ""} ×{" "}
                    ${pricing.pricePerWeek}
                  </span>
                  <span>${(subtotalInCents / 100).toFixed(0)}</span>
                </div>

                {discountInCents > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Existing tier discount</span>
                    <span>-${(discountInCents / 100).toFixed(0)}</span>
                  </div>
                )}

                {tierBonusApplied && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600">
                    <Gift className="size-3" />
                    <span className="font-semibold">
                      Free {tierBonusApplied === TIER.PREMIUM_PLUS ? "Premium+" : "Premium"} upgrade
                    </span>
                  </div>
                )}

                <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 text-sm font-bold text-slate-900">
                  <span>Total</span>
                  <span>${(totalInCents / 100).toFixed(0)}</span>
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-2 pt-1">
              <Button
                variant="outline"
                onClick={() => setStep("select-weeks")}
                className="text-xs"
              >
                <ArrowLeft className="mr-1 size-3" />
                Back
              </Button>

              {!session?.user ? (
                <Button
                  type="button"
                  onClick={() => signIn.social({ provider: "google" })}
                  className="flex-1 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Sign In to Pay (${(totalInCents / 100).toFixed(0)})
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex-1 bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {isPending ? (
                    <>
                      <Spinner className="mr-2 size-3.5" />
                      Connecting to Dodo Payments...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1.5 size-3.5" />
                      Pay ${(totalInCents / 100).toFixed(0)} via Dodo
                    </>
                  )}
                </Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
