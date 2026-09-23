"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLaunchAvailability } from "@/hooks/launches/use-launch-availability"
import { TIER, type Tier } from "@/constants/plans"
import { LAUNCH_PROMO } from "@/constants/promo"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import {
  launchWeekCard,
  launchWeekGrid,
  launchWeekUpsellCallout,
  launchPromoCelebrationCallout,
} from "@/utils/styles"
import {
  CalendarDays,
  Sparkles,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Flame,
} from "lucide-react"

interface LaunchWeekPickerProps {
  selectedYear: number | undefined
  selectedWeek: number | undefined
  onSelectWeek: (year: number, week: number) => void
  currentTier?: Tier
  onUpgradeTier?: (tier: Tier) => void
}

export const LaunchWeekPicker = ({
  selectedYear,
  selectedWeek,
  onSelectWeek,
  currentTier = TIER.FREE,
  onUpgradeTier,
}: LaunchWeekPickerProps) => {
  const { data, isLoading, isError } = useLaunchAvailability()
  const [clickedFullWeek, setClickedFullWeek] = useState<{
    year: number
    week: number
  } | null>(null)

  const isPaidTier = currentTier === TIER.PREMIUM || currentTier === TIER.PREMIUM_PLUS
  const isPromoActive = Boolean(data?.promo?.isPromoActive)

  // Auto-select the first available week when data loads if nothing is selected yet
  useEffect(() => {
    if (!data?.weeks || data.weeks.length === 0) return
    if (selectedYear && selectedWeek) return

    if (isPromoActive || isPaidTier) {
      // Any week can be picked
      const first = data.weeks[0]
      onSelectWeek(first.isoYear, first.isoWeek)
    } else {
      // Pick first week with free slots remaining
      const firstAvailable = data.weeks.find((w) => !w.isFreeFull) ?? data.weeks[0]
      onSelectWeek(firstAvailable.isoYear, firstAvailable.isoWeek)
    }
  }, [data, selectedYear, selectedWeek, isPromoActive, isPaidTier, onSelectWeek])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className={launchWeekGrid}>
          {Array.from({ length: 8 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data?.weeks || data.weeks.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        Unable to load launch week schedule. You will be scheduled for next week automatically.
      </div>
    )
  }

  const { weeks, promo } = data

  return (
    <div className="flex flex-col gap-4">
      {/* First 50 Celebration Callout */}
      {isPromoActive && (
        <div className={launchPromoCelebrationCallout}>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
            <Sparkles className="size-4" />
          </span>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="font-bold text-emerald-950">
              Launch Celebration: You are within the First 50 Launches!
            </p>
            <p className="text-emerald-800">
              Your tool receives a <strong>Free Lifetime Premium Listing ({LAUNCH_PROMO.VALUE_GIFTED} value)</strong> with verified badge and permanent Do-Follow SEO backlink upon approval. You can schedule for <strong>any week</strong> (all submissions undergo review for quality and spam prevention before going live).
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-emerald-300 bg-emerald-100/60 font-semibold text-emerald-800"
          >
            {promo.promoRemaining} spots left
          </Badge>
        </div>
      )}

      {/* Week Grid */}
      <div className={launchWeekGrid}>
        {weeks.map((w, index) => {
          const isSelected = selectedYear === w.isoYear && selectedWeek === w.isoWeek
          const isFull = !isPromoActive && !isPaidTier && w.isFreeFull
          const isFastTrack = index === 0

          const handleClick = () => {
            if (isFull) {
              setClickedFullWeek({ year: w.isoYear, week: w.isoWeek })
              return
            }
            setClickedFullWeek(null)
            onSelectWeek(w.isoYear, w.isoWeek)
          }

          return (
            <button
              key={`${w.isoYear}-${w.isoWeek}`}
              type="button"
              onClick={handleClick}
              className={launchWeekCard(isSelected, false, isFull)}
              aria-pressed={isSelected}
            >
              {/* Header inside card */}
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {w.weekLabel}
                </span>

                {isFastTrack && !isFull && (
                  <Badge
                    variant="outline"
                    className="border-indigo-200 bg-indigo-50/80 px-1.5 py-0 text-[10px] font-semibold text-indigo-700"
                  >
                    Next Week
                  </Badge>
                )}

                {isFull && (
                  <Badge
                    variant="outline"
                    className="border-rose-200 bg-rose-50 px-1.5 py-0 text-[10px] font-semibold text-rose-700"
                  >
                    Full
                  </Badge>
                )}
              </div>

              {/* Date Range */}
              <span className="mt-1 text-[11px] font-medium text-slate-500">
                {w.dateRange}
              </span>

              {/* Status / Slots Indicator */}
              <div className="mt-3 flex items-center justify-between text-[11px]">
                {isPromoActive ? (
                  <span className="flex items-center gap-1 font-semibold text-emerald-600">
                    <CheckCircle2 className="size-3" />
                    Free Premium Slot
                  </span>
                ) : isPaidTier ? (
                  <span className="flex items-center gap-1 font-semibold text-indigo-600">
                    <Flame className="size-3" />
                    Premium Unlimited
                  </span>
                ) : isFull ? (
                  <span className="flex items-center gap-1 font-medium text-rose-600">
                    <Lock className="size-3" />
                    0 of {MAX_FREE_LAUNCHES_PER_WEEK} slots left
                  </span>
                ) : (
                  <span className="font-medium text-slate-600">
                    <strong className="font-semibold text-slate-900">
                      {w.freeSlotsRemaining}
                    </strong>{" "}
                    of {MAX_FREE_LAUNCHES_PER_WEEK} free slots
                  </span>
                )}

                {isSelected && (
                  <span className="flex size-4 items-center justify-center rounded-full bg-indigo-600 text-white">
                    <CheckCircle2 className="size-3" />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Upsell Callout when user clicks or encounters a full week */}
      {clickedFullWeek && onUpgradeTier && (
        <div className={launchWeekUpsellCallout}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700">
                <AlertTriangle className="size-3" />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="font-bold text-amber-950">
                  Week {clickedFullWeek.week} free slots are completely full!
                </p>
                <p className="text-amber-800">
                  Free submissions are capped at {MAX_FREE_LAUNCHES_PER_WEEK} per week. You can choose a later week for Free, or upgrade to <strong>Featured Builder</strong> to schedule for Week {clickedFullWeek.week} with unlimited slots upon approval.
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => {
                onUpgradeTier(TIER.PREMIUM)
                onSelectWeek(clickedFullWeek.year, clickedFullWeek.week)
                setClickedFullWeek(null)
              }}
              className="shrink-0 gap-1.5 bg-amber-600 text-white hover:bg-amber-700"
            >
              <span>Unlock Week {clickedFullWeek.week} with Premium</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
