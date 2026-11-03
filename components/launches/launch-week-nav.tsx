import Link from "next/link"
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { formatLaunchWeekDisplay } from "@/utils/iso-weeks"
import { launchWeekNavLink } from "@/utils/styles"

interface WeekRef {
  year: number
  week: number
}

interface LaunchWeekNavProps {
  previous?: WeekRef
  next?: WeekRef
}

const weekName = ({ year, week }: WeekRef) =>
  `${formatLaunchWeekDisplay(year, week).weekLabel}, ${year}`

export const LaunchWeekNav = ({ previous, next }: LaunchWeekNavProps) => (
  <nav
    aria-label="Launch weeks"
    className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border bg-white px-6 py-4 md:px-8"
  >
    {previous ? (
      <Link
        href={ROUTES.LAUNCH_WEEK(previous.year, previous.week)}
        rel="prev"
        className={launchWeekNavLink}
      >
        <ArrowLeft className="size-3.5" />
        {weekName(previous)} launches
      </Link>
    ) : (
      <span />
    )}
    <Link href={ROUTES.DISCOVER_WEEKLY_LAUNCHES} className={launchWeekNavLink}>
      <CalendarDays className="size-3.5 text-indigo-500" />
      All weekly launches
    </Link>
    {next ? (
      <Link
        href={ROUTES.LAUNCH_WEEK(next.year, next.week)}
        rel="next"
        className={launchWeekNavLink}
      >
        {weekName(next)} launches
        <ArrowRight className="size-3.5" />
      </Link>
    ) : (
      <span />
    )}
  </nav>
)
