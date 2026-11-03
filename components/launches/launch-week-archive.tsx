import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import type { LaunchWeekSummary } from "@/lib/launches/launch-archive"
import { formatLaunchWeekDisplay } from "@/utils/iso-weeks"
import { launchArchiveWeekLink } from "@/utils/styles"

interface LaunchWeekArchiveProps {
  summaries: LaunchWeekSummary[]
}

const groupByYear = (summaries: LaunchWeekSummary[]) =>
  summaries.reduce<Map<number, LaunchWeekSummary[]>>((years, summary) => {
    years.set(summary.year, [...(years.get(summary.year) ?? []), summary])
    return years
  }, new Map())

export const LaunchWeekArchive = ({ summaries }: LaunchWeekArchiveProps) => (
  <section
    aria-labelledby="launch-archive-heading"
    className="flex flex-col gap-6 border-b border-dashed border-border bg-white px-6 py-6 md:px-8"
  >
    <h2
      id="launch-archive-heading"
      className="text-sm font-bold text-slate-900 sm:text-base"
    >
      Launches by week
    </h2>
    {[...groupByYear(summaries)].map(([year, weeks]) => (
      <div key={year} className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
          {year}
        </h3>
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {weeks.map(({ week, count }) => {
            const { weekLabel, dateRange } = formatLaunchWeekDisplay(year, week)
            return (
              <li key={week}>
                <Link
                  href={ROUTES.LAUNCH_WEEK(year, week)}
                  className={launchArchiveWeekLink}
                >
                  <span>
                    {weekLabel} · {dateRange}
                  </span>
                  <span className="text-slate-400">
                    {count} {count === 1 ? "launch" : "launches"}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    ))}
  </section>
)
