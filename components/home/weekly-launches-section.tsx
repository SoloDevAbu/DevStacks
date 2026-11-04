import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { SectionHeader } from "@/components/shared/section-header"
import { LaunchWeekList } from "@/components/shared/launch-week-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { ROUTES } from "@/constants/routes"
import { sectionHeaderCtaButton } from "@/utils/styles"

interface WeeklyLaunchesSectionProps {
  items: FeedItem[]
  year: number
  week: number
  weekTitle: string
}

export const WeeklyLaunchesSection = ({
  items,
  year,
  week,
  weekTitle,
}: WeeklyLaunchesSectionProps) => (
  <section id="weekly-launches" className="flex w-full flex-col">
    <SectionHeader
      title={`This Week's Launches`}
      action={
        <Link
          href={ROUTES.LAUNCH_WEEK(year, week)}
          className={sectionHeaderCtaButton}
        >
          <CalendarDays className="size-3.5 text-indigo-500 transition-colors group-hover:text-indigo-600" />
          <span>View all launches</span>
        </Link>
      }
    />
    <div className="-mt-px flex flex-col">
      <LaunchWeekList items={items} />
    </div>
  </section>
)
