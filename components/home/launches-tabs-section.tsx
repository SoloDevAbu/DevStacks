"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CalendarDays, Zap } from "lucide-react"
import { FeedCard, type FeedItem } from "@/components/shared/feed-card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
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
  // Default to TAB_WEEK (today tab commented out until sufficient daily launch volume)
  const [active, setActive] = useState<Tab>(TAB_WEEK)
  const [todayPage, setTodayPage] = useState(1)

  const isToday = active === TAB_TODAY
  const pageSize = HOMEPAGE_LIMITS.TODAYS_LAUNCHES
  const totalTodayPages = Math.max(1, Math.ceil(todaysLaunches.length / pageSize))

  const paginatedTodayLaunches = todaysLaunches.slice(
    (todayPage - 1) * pageSize,
    todayPage * pageSize
  )

  const items = isToday ? paginatedTodayLaunches : weeklyLaunches
  const emptyMsg = isToday
    ? ["No launches today yet.", "Be the first to launch something!"]
    : ["No launches this week yet.", "Be the first to launch something!"]

  return (
    <section className="flex w-full flex-col">
      {/* Full-width toggle tab bar — today's tab commented out */}
      <div className="flex w-full border-b border-dashed border-border bg-white">
        {/* Today's launches tab — commented out until daily launch volume is sufficient
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
          {isToday && (
            <span className="absolute bottom-0 left-0 h-0.5 w-full bg-slate-900" />
          )}
        </button>
        */}

        <button
          id="tab-week"
          type="button"
          onClick={() => setActive(TAB_WEEK)}
          className={cn(
            "relative flex w-full items-center justify-center gap-2 px-6 py-4 text-sm font-semibold transition-colors bg-white text-slate-900"
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
          : items.map((item, index) => {
              const itemIndex = isToday
                ? (todayPage - 1) * pageSize + index
                : index

              return (
                <FeedCard
                  key={item.id}
                  item={item}
                  index={itemIndex}
                  showMedals={true}
                  showFreshnessBadge={isToday}
                />
              )
            })}
      </div>

      {/* Bottom Actions: Pagination for Today (if > 1 page), CTA for Week */}
      {isToday && totalTodayPages > 1 && (
        <div className="flex items-center justify-center border-b border-t border-dashed border-border bg-white px-6 py-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#tab-today"
                  onClick={(e) => {
                    e.preventDefault()
                    if (todayPage > 1) {
                      setTodayPage((p) => p - 1)
                      document.getElementById("tab-today")?.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  className={cn(todayPage === 1 && "pointer-events-none opacity-40")}
                />
              </PaginationItem>
              {Array.from({ length: totalTodayPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#tab-today"
                      isActive={todayPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault()
                        setTodayPage(pageNum)
                        document.getElementById("tab-today")?.scrollIntoView({ behavior: "smooth" })
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  href="#tab-today"
                  onClick={(e) => {
                    e.preventDefault()
                    if (todayPage < totalTodayPages) {
                      setTodayPage((p) => p + 1)
                      document.getElementById("tab-today")?.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                  className={cn(todayPage === totalTodayPages && "pointer-events-none opacity-40")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {!isToday && (
        <div className="flex items-center justify-center border-b border-t border-dashed border-border bg-white px-6 py-4">
          <Link
            href={ROUTES.DISCOVER_WEEKLY_LAUNCHES}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-900"
          >
            Browse all weekly launches
            <ArrowRight className="size-3.5 text-slate-400 transition-colors group-hover:text-slate-600" />
          </Link>
        </div>
      )}
    </section>
  )
}
