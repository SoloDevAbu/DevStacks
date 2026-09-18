"use client"

import { useState } from "react"
import { CalendarDays } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { Skeleton } from "@/components/ui/skeleton"
import { useWeeklyLaunches } from "@/hooks/home/use-weekly-launches"
import { generateWeekOptions, getCurrentWeek } from "@/lib/launches/week-utils"

const { year: CURRENT_YEAR, week: CURRENT_WEEK } = getCurrentWeek()
const WEEK_OPTIONS = generateWeekOptions(CURRENT_YEAR)
const DEFAULT_VALUE = `${CURRENT_YEAR}-W${String(CURRENT_WEEK).padStart(2, "0")}`

interface WeeklyLaunchesContentProps {
  initialItems: FeedItem[]
}

export const WeeklyLaunchesContent = ({
  initialItems,
}: WeeklyLaunchesContentProps) => {
  const [selectedValue, setSelectedValue] = useState(DEFAULT_VALUE)

  const selected = WEEK_OPTIONS.find((o) => o.value === selectedValue)
  const isCurrentWeek = selectedValue === DEFAULT_VALUE

  const { data, isLoading } = useWeeklyLaunches(
    selected?.year ?? CURRENT_YEAR,
    selected?.week ?? CURRENT_WEEK
  )

  const items: FeedItem[] = isCurrentWeek
    ? (data ?? initialItems)
    : (data ?? [])

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-dashed border-border bg-white px-6 py-4 md:px-8">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>
            {selected
              ? `Showing launches for ${selected.label}`
              : "Select a week to browse launches"}
          </span>
        </div>

        <Select
          value={selectedValue}
          onValueChange={(value) => {
            if (value) setSelectedValue(value)
          }}
        >
          <SelectTrigger
            id="week-selector"
            className="w-full max-w-65 gap-2 border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs"
          >
            <CalendarDays className="size-3.5 shrink-0 text-slate-400" />
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent className="max-h-72 overflow-y-auto">
            {WEEK_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col pb-16">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-dashed border-border bg-white px-6 py-5 md:px-8"
            >
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-40 rounded" />
                <Skeleton className="h-3 w-64 rounded" />
              </div>
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-16 text-center">
            <p className="text-sm font-medium text-slate-400">
              No launches this week.
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Try a different week or{" "}
              <a
                href="/submit"
                className="underline underline-offset-2 hover:text-slate-600"
              >
                submit your own
              </a>
              !
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <FeedCard
              key={item.id}
              item={item}
              index={index}
              showMedals={true}
              showFreshnessBadge={false}
            />
          ))
        )}
      </div>
    </div>
  )
}
