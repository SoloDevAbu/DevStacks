"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { useLaunchAvailability } from "@/hooks/launches/use-launch-availability"
import { TIER, type Tier } from "@/constants/plans"
import { LAUNCH_PROMO } from "@/constants/promo"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sparkles,
  Calendar,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface LaunchWeekPickerProps {
  selectedYear: number | undefined
  selectedWeek: number | undefined
  onSelectWeek: (year: number, week: number) => void
  currentTier?: Tier
  onUpgradeTier?: (tier: Tier) => void
  compact?: boolean
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

  // Auto-select the closest available week when data loads if nothing is selected yet
  useEffect(() => {
    if (!data?.weeks || data.weeks.length === 0) return
    if (selectedYear && selectedWeek) return

    if (isPromoActive || isPaidTier) {
      const first = data.weeks[0]
      onSelectWeek(first.isoYear, first.isoWeek)
    } else {
      const firstAvailable = data.weeks.find((w) => !w.isFreeFull) ?? data.weeks[0]
      onSelectWeek(firstAvailable.isoYear, firstAvailable.isoWeek)
    }
  }, [data, selectedYear, selectedWeek, isPromoActive, isPaidTier, onSelectWeek])

  const currentValue =
    selectedYear && selectedWeek ? `${selectedYear}-${selectedWeek}` : ""

  const handleValueChange = (val: string | null) => {
    if (!val) return
    const [yearStr, weekStr] = val.split("-")
    const year = parseInt(yearStr, 10)
    const week = parseInt(weekStr, 10)
    if (!isNaN(year) && !isNaN(week)) {
      onSelectWeek(year, week)
    }
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />
  }

  if (isError || !data?.weeks || data.weeks.length === 0) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
        Automatic launch schedule active. You will be scheduled for next week automatically.
      </div>
    )
  }

  const { weeks } = data

  return (
    <div className="flex flex-col gap-2 w-full">
      <Select value={currentValue} onValueChange={handleValueChange}>
        <SelectTrigger className="h-10 w-full rounded-md border border-slate-200/90 bg-white px-3 text-xs shadow-2xs transition-colors hover:border-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Calendar className="size-3.5 text-slate-400 shrink-0" />
            <SelectValue placeholder="Select a launch week..." />
          </div>
        </SelectTrigger>
        <SelectContent className="max-h-80 w-(--anchor-width) min-w-72">
          {weeks.map((w, index) => {
            const isFull = !isPromoActive && !isPaidTier && w.isFreeFull
            const isFastTrack = index === 0

            return (
              <SelectItem
                key={`${w.isoYear}-${w.isoWeek}`}
                value={`${w.isoYear}-${w.isoWeek}`}
                disabled={isFull}
                className="cursor-pointer py-2.5 px-3"
              >
                <div className="flex w-full items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{w.weekLabel}</span>
                    <span className="text-slate-500 font-normal">({w.dateRange})</span>
                    {isFastTrack && !isFull && (
                      <span className="rounded bg-indigo-50 px-1.5 py-0.2 font-mono text-[9px] font-semibold text-indigo-700">
                        Next Week
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isPromoActive ? (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                        Free Premium Slot
                      </span>
                    ) : isPaidTier ? (
                      <span className="text-indigo-600 font-medium">Unlimited</span>
                    ) : isFull ? (
                      <span className="text-rose-500 font-medium">Full</span>
                    ) : (
                      <span className="text-slate-500">
                        {w.freeSlotsRemaining} of {MAX_FREE_LAUNCHES_PER_WEEK} slots left
                      </span>
                    )}
                  </div>
                </div>
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>

      {/* Celebration Promo Callout Note */}
      {isPromoActive && (
        <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
          <Sparkles className="size-3.5 shrink-0 text-emerald-600" />
          <span>
            <strong>Launch Special Active:</strong> First 50 launches receive a Free Lifetime Premium Listing ({LAUNCH_PROMO.VALUE_GIFTED} value).
          </span>
        </div>
      )}

      {/* Upsell Callout when user selects or encounters a full week */}
      {clickedFullWeek && onUpgradeTier && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-950">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 shrink-0 text-amber-600" />
            <p>
              Week {clickedFullWeek.week} free slots are full. Upgrade to schedule for this week.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onUpgradeTier(TIER.PREMIUM)
              onSelectWeek(clickedFullWeek.year, clickedFullWeek.week)
              setClickedFullWeek(null)
            }}
            className="shrink-0 gap-1 bg-amber-600 text-white hover:bg-amber-700"
          >
            <span>Upgrade to Unlock</span>
            <ArrowRight className="size-3" />
          </Button>
        </div>
      )}
    </div>
  )
}
