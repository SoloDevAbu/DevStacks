"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { LAUNCH_NAV_FUTURE_WEEKS } from "@/constants/launches"
import { getLaunchNavWeeks } from "@/utils/iso-weeks"
import {
  launchWeekNavWrapper,
  launchWeekNavScroll,
  launchWeekActivePill,
  launchWeekAvailableLink,
  launchWeekDisabledItem,
  launchWeekArrowBtnLeft,
  launchWeekArrowBtnRight,
  launchWeekArrowDisabledLeft,
  launchWeekArrowDisabledRight,
} from "@/utils/styles"

interface LaunchWeekNavProps {
  currentYear: number
  currentWeek: number
  earliestYear?: number
  earliestWeek?: number
}

export const LaunchWeekNav = ({
  currentYear,
  currentWeek,
  earliestYear,
  earliestWeek,
}: LaunchWeekNavProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { items, previous, next } = getLaunchNavWeeks({
    activeYear: currentYear,
    activeWeek: currentWeek,
    earliestYear,
    earliestWeek,
    futureWeeksCount: LAUNCH_NAV_FUTURE_WEEKS,
  })

  useEffect(() => {
    const centerActive = () => {
      const container = containerRef.current
      if (!container) return
      const activeEl = container.querySelector<HTMLElement>(
        '[data-active="true"]'
      )
      if (!activeEl) return

      const targetScroll =
        activeEl.offsetLeft - (container.clientWidth - activeEl.clientWidth) / 2
      container.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: "instant",
      })
    }

    centerActive()
    const rafId = requestAnimationFrame(centerActive)
    const timeoutId = setTimeout(centerActive, 100)
    window.addEventListener("resize", centerActive)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(timeoutId)
      window.removeEventListener("resize", centerActive)
    }
  }, [currentYear, currentWeek])

  return (
    <nav aria-label="Launch weeks navigation" className={launchWeekNavWrapper}>
      {previous ? (
        <Button
          variant="ghost"
          nativeButton={false}
          render={
            <Link
              href={ROUTES.LAUNCH_WEEK(previous.year, previous.week)}
              aria-label={`Go to Week ${previous.week}, ${previous.year}`}
            />
          }
          className={launchWeekArrowBtnLeft}
        >
          <ChevronLeft className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          disabled
          aria-disabled="true"
          aria-label="No previous week available"
          className={launchWeekArrowDisabledLeft}
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      <div ref={containerRef} className={launchWeekNavScroll}>
        {items.map((item) => {
          const key = `${item.year}-${item.week}`

          if (item.isActive) {
            return (
              <Button
                key={key}
                data-active="true"
                variant="default"
                aria-current="page"
                className={launchWeekActivePill}
              >
                {item.label}
              </Button>
            )
          }

          if (item.isAvailable) {
            return (
              <Button
                key={key}
                variant="ghost"
                nativeButton={false}
                render={
                  <Link href={ROUTES.LAUNCH_WEEK(item.year, item.week)} />
                }
                className={launchWeekAvailableLink}
              >
                {item.label}
              </Button>
            )
          }

          return (
            <Button
              key={key}
              variant="ghost"
              disabled
              aria-disabled="true"
              className={launchWeekDisabledItem}
            >
              {item.label}
            </Button>
          )
        })}
      </div>

      {next ? (
        <Button
          variant="ghost"
          nativeButton={false}
          render={
            <Link
              href={ROUTES.LAUNCH_WEEK(next.year, next.week)}
              aria-label={`Go to Week ${next.week}, ${next.year}`}
            />
          }
          className={launchWeekArrowBtnRight}
        >
          <ChevronRight className="size-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          disabled
          aria-disabled="true"
          aria-label="No next week available"
          className={launchWeekArrowDisabledRight}
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  )
}
