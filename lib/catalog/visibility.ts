import { and, eq, isNull, lt, lte, or } from "drizzle-orm"
import type { tools, products } from "@/db/schema"
import { getCurrentWeek } from "@/utils/iso-weeks"

interface LaunchSchedule {
  launchYear?: number | null
  launchWeek?: number | null
}

interface ListingVisibility extends LaunchSchedule {
  status?: string | null
  isDeleted?: boolean | null
}

// Listings booked into a future launch week stay private until Monday 00:00 UTC of that week;
// listings without a booking are public as soon as they are approved.
export const hasLaunched = (
  { launchYear, launchWeek }: LaunchSchedule,
  now: Date = new Date()
): boolean => {
  if (!launchYear || !launchWeek) return true
  const { year, week } = getCurrentWeek(now)
  return launchYear < year || (launchYear === year && launchWeek <= week)
}

export const isPubliclyVisible = (listing: ListingVisibility): boolean =>
  listing.status === "approved" && !listing.isDeleted && hasLaunched(listing)

export const launchedByNow = (table: typeof tools | typeof products) => {
  const { year, week } = getCurrentWeek()
  return or(
    isNull(table.launchYear),
    lt(table.launchYear, year),
    and(eq(table.launchYear, year), lte(table.launchWeek, week))
  )
}
