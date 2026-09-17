"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, Zap } from "lucide-react"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"

const TAB_TODAY = "today"
const TAB_WEEK = "week"

type Tab = typeof TAB_TODAY | typeof TAB_WEEK

interface LaunchesTabsSectionProps {
  todaysLaunches: FeedItem[]
  weeklyLaunches: FeedItem[]
}

const emptyState = (message: string, sub: string) => (
  <div className="border-b border-dashed border-border bg-white py-14 text-center">
    <p className="text-sm font-medium text-slate-400">{message}</p>
    <p className="mt-1 text-xs text-slate-400">{sub}</p>
  </div>
)

export const LaunchesTabsSection = ({
  todaysLaunches,
  weeklyLaunches,
}: LaunchesTabsSectionProps) => {
  const [active, setActive] = useState<Tab>(TAB_TODAY)

  const isToday = active === TAB_TODAY
  const items = isToday ? todaysLaunches : weeklyLaunches
  const ctaHref = isToday ? ROUTES.DISCOVER_DAILY_LAUNCHES : ROUTES.DISCOVER_WEEKLY_LAUNCHES
  const ctaLabel = isToday ? "View all today's launches" : "Browse all weekly launches"
  const emptyMsg = isToday
    ? ["No launches today yet.", "Be the first to launch something!"]
    : ["No launches this week yet.", "Be the first to launch something!"]

  return (
    <section className="flex w-full flex-col">
      {/* Full-width 50/50 toggle tab bar */}
      <div className="flex w-full border-b border-dashed border-border bg-white">
        <button
          id="tab-today"
          type="button"
          onClick={() => setActive(TAB_TODAY)}
          className={cn(
            "relative flex w-1/2 items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors",
            "border-r border-dashed border-border",
            isToday
              ? "bg-white text-slate-900"
              : "bg-slate-50/60 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          )}
        >
          <Zap
            className={cn(
              "size-3.5 shrink-0 transition-colors",
              isToday ? "text-rose-500" : "text-slate-400"
            )}
          />
          Today's Launches
          {todaysLaunches.length > 0 && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border transition-colors",
                isToday
                  ? "bg-rose-50 text-rose-600 border-rose-200/60"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              )}
            >
              {todaysLaunches.length}
            </span>
          )}
          {/* Active bottom indicator */}
          {isToday && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-900" />
          )}
        </button>

        <button
          id="tab-week"
          type="button"
          onClick={() => setActive(TAB_WEEK)}
          className={cn(
            "relative flex w-1/2 items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors",
            !isToday
              ? "bg-white text-slate-900"
              : "bg-slate-50/60 text-slate-500 hover:bg-slate-50 hover:text-slate-700"
          )}
        >
          <CalendarDays
            className={cn(
              "size-3.5 shrink-0 transition-colors",
              !isToday ? "text-indigo-500" : "text-slate-400"
            )}
          />
          This Week
          {weeklyLaunches.length > 0 && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 font-mono text-[10px] font-bold border transition-colors",
                !isToday
                  ? "bg-indigo-50 text-indigo-600 border-indigo-200/60"
                  : "bg-slate-100 text-slate-500 border-slate-200"
              )}
            >
              {weeklyLaunches.length}
            </span>
          )}
          {/* Active bottom indicator */}
          {!isToday && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-900" />
          )}
        </button>
      </div>

      {/* Content list */}
      <div className="flex flex-col">
        {items.length === 0
          ? emptyState(emptyMsg[0], emptyMsg[1])
          : items.map((item, index) => (
              <FeedCard
                key={item.id}
                item={item}
                index={index}
                showMedals={true}
                showFreshnessBadge={isToday}
              />
            ))}
      </div>

      {/* CTA at the bottom */}
      <div className="flex items-center justify-center border-b border-t border-dashed border-border bg-white px-6 py-4">
        <Link
          href={ctaHref}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
        >
          {ctaLabel}
          <ArrowRight className="size-3.5 text-slate-400 transition-colors group-hover:text-slate-600" />
        </Link>
      </div>
    </section>
  )
}
