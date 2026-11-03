import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { formatWeekTitle, getListingLaunchWeek } from "@/utils/iso-weeks"
import {
  specBadge,
  specRow,
  specRowHeader,
  specRowTitle,
  specRowValue,
} from "@/utils/styles"

interface LaunchWeekSpecRowProps {
  launchYear?: number | null
  launchWeek?: number | null
  createdAt?: Date | string | null
}

export const LaunchWeekSpecRow = (props: LaunchWeekSpecRowProps) => {
  const launch = getListingLaunchWeek(props)
  if (!launch) return null

  return (
    <div className={specRow}>
      <div className={specRowHeader}>
        <span className={specBadge}>
          <CalendarDays className="size-3 text-slate-600" />
        </span>
        <h3 className={specRowTitle}>Launch Week</h3>
      </div>
      <Link
        href={ROUTES.LAUNCH_WEEK(launch.year, launch.week)}
        className={cn(specRowValue, "hover:text-blue-600 hover:underline")}
      >
        Launched in {formatWeekTitle(launch.year, launch.week)}
      </Link>
    </div>
  )
}
