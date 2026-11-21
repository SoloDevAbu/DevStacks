"use client"

import { useEffect } from "react"
import { Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLaunchAvailability } from "@/hooks/launches/use-launch-availability"
import { TIER, isPaidTier, type Tier } from "@/constants/plans"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { getDefaultLaunchWeek } from "@/utils/iso-weeks"

interface LaunchWeekPickerProps {
  selectedYear: number | undefined
  selectedWeek: number | undefined
  onSelectWeek: (year: number, week: number) => void
  currentTier?: Tier
}

const toWeekValue = (year: number, week: number) => `${year}-${week}`

export const LaunchWeekPicker = ({
  selectedYear,
  selectedWeek,
  onSelectWeek,
  currentTier = TIER.FREE,
}: LaunchWeekPickerProps) => {
  const { data, isLoading, isError } = useLaunchAvailability()
  const isPaid = isPaidTier(currentTier)

  useEffect(() => {
    if (!data?.weeks?.length || (selectedYear && selectedWeek)) return
    const defaultWeek = getDefaultLaunchWeek(data.weeks, isPaid)
    if (defaultWeek) onSelectWeek(defaultWeek.isoYear, defaultWeek.isoWeek)
  }, [data, selectedYear, selectedWeek, isPaid, onSelectWeek])

  const handleValueChange = (val: string | null) => {
    if (!val) return
    const [year, week] = val.split("-").map((part) => parseInt(part, 10))
    if (!isNaN(year) && !isNaN(week)) onSelectWeek(year, week)
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-full rounded-md" />
  }

  if (isError || !data?.weeks?.length) {
    return (
      <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-500">
        Automatic launch schedule active. You will be scheduled for next week
        automatically.
      </div>
    )
  }

  const currentValue =
    selectedYear && selectedWeek ? toWeekValue(selectedYear, selectedWeek) : ""

  return (
    <Select value={currentValue} onValueChange={handleValueChange}>
      <SelectTrigger className="h-10 w-full rounded-md border border-slate-200/90 bg-white px-3 text-xs shadow-2xs transition-colors hover:border-slate-300">
        <div className="flex items-center gap-2 truncate">
          <Calendar className="size-3.5 shrink-0 text-slate-400" />
          <SelectValue placeholder="Select a launch week..." />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80 w-(--anchor-width) min-w-72">
        {data.weeks.map((w, index) => {
          const isFull = !isPaid && w.isFreeFull

          return (
            <SelectItem
              key={toWeekValue(w.isoYear, w.isoWeek)}
              value={toWeekValue(w.isoYear, w.isoWeek)}
              disabled={isFull}
              className="cursor-pointer px-3 py-2.5"
            >
              <div className="flex w-full items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">
                    {w.weekLabel}
                  </span>
                  <span className="font-normal text-slate-500">
                    ({w.dateRange})
                  </span>
                  {index === 0 && !isFull && (
                    <span className="rounded bg-indigo-50 px-1.5 font-mono text-[9px] font-semibold text-indigo-700">
                      Next Week
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  {isPaid ? (
                    <span className="font-medium text-indigo-600">
                      Unlimited
                    </span>
                  ) : isFull ? (
                    <span className="font-medium text-rose-500">Full</span>
                  ) : (
                    <span className="text-slate-500">
                      {w.freeSlotsRemaining} of {MAX_FREE_LAUNCHES_PER_WEEK}{" "}
                      slots left
                    </span>
                  )}
                </div>
              </div>
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
