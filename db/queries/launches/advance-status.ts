import { db } from "@/db"
import { launches } from "@/db/schema"
import { and, eq, inArray, lt, or } from "drizzle-orm"

const ADVANCEABLE_STATUSES = ["scheduled", "live"] as const

// Listing visibility is derived from the launch week, so this only keeps launch_status truthful
// for reporting: the current week is live, earlier weeks are completed.
export const advanceLaunchStatuses = async ({
  year,
  week,
}: {
  year: number
  week: number
}) => {
  const isPastWeek = or(
    lt(launches.isoYear, year),
    and(eq(launches.isoYear, year), lt(launches.isoWeek, week))
  )
  const isCurrentWeek = and(
    eq(launches.isoYear, year),
    eq(launches.isoWeek, week)
  )

  const [completed, live] = await Promise.all([
    db
      .update(launches)
      .set({ launchStatus: "completed", updatedAt: new Date() })
      .where(
        and(isPastWeek, inArray(launches.launchStatus, [...ADVANCEABLE_STATUSES]))
      )
      .returning({ id: launches.id }),
    db
      .update(launches)
      .set({ launchStatus: "live", updatedAt: new Date() })
      .where(and(isCurrentWeek, eq(launches.launchStatus, "scheduled")))
      .returning({ id: launches.id }),
  ])

  return { completed: completed.length, live: live.length }
}
