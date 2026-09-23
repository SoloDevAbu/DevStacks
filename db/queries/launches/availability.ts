import { db } from "@/db"
import { launches, tools, products } from "@/db/schema"
import { and, eq, ne, isNotNull, sql } from "drizzle-orm"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { LAUNCH_PROMO } from "@/constants/promo"
import {
  getUpcomingLaunchWeeks,
  formatLaunchWeekDisplay,
} from "@/utils/iso-weeks"

export interface LaunchPromoStatus {
  isPromoActive: boolean
  promoClaimed: number
  promoRemaining: number
}

export interface LaunchWeekAvailability {
  isoYear: number
  isoWeek: number
  startDate: string
  endDate: string
  weekLabel: string
  dateRange: string
  freeSlotsUsed: number
  freeSlotsRemaining: number
  isFreeFull: boolean
  isPromoActive: boolean
}

export const getLaunchPromoStatus = async (): Promise<LaunchPromoStatus> => {
  const [toolsRow, productsRow] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(tools)
      .where(and(ne(tools.status, "rejected"), isNotNull(tools.submitterId))),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(
        and(ne(products.status, "rejected"), isNotNull(products.submitterId))
      ),
  ])

  const promoClaimed =
    (toolsRow[0]?.count ?? 0) + (productsRow[0]?.count ?? 0)
  const maxPromo = LAUNCH_PROMO.MAX_LAUNCHES
  const isPromoActive = promoClaimed < maxPromo
  const promoRemaining = Math.max(0, maxPromo - promoClaimed)

  return {
    isPromoActive,
    promoClaimed,
    promoRemaining,
  }
}

export const getLaunchWeekAvailability = async (): Promise<{
  weeks: LaunchWeekAvailability[]
  promo: LaunchPromoStatus
}> => {
  const [upcomingWeeks, promo] = await Promise.all([
    Promise.resolve(getUpcomingLaunchWeeks()),
    getLaunchPromoStatus(),
  ])

  if (upcomingWeeks.length === 0) {
    return { weeks: [], promo }
  }

  // Count free listings booked in launches table where status is not rejected
  const bookedCounts = await db
    .select({
      isoYear: launches.isoYear,
      isoWeek: launches.isoWeek,
      count: sql<number>`count(${launches.id})::int`,
    })
    .from(launches)
    .where(and(eq(launches.tier, "free"), ne(launches.status, "rejected")))
    .groupBy(launches.isoYear, launches.isoWeek)

  const bookedMap = new Map<string, number>()
  for (const row of bookedCounts) {
    bookedMap.set(`${row.isoYear}-${row.isoWeek}`, row.count)
  }

  const weeks: LaunchWeekAvailability[] = upcomingWeeks.map((w) => {
    const freeSlotsUsed = bookedMap.get(`${w.isoYear}-${w.isoWeek}`) ?? 0
    const freeSlotsRemaining = Math.max(
      0,
      MAX_FREE_LAUNCHES_PER_WEEK - freeSlotsUsed
    )
    const { weekLabel, dateRange } = formatLaunchWeekDisplay(
      w.isoYear,
      w.isoWeek
    )

    return {
      isoYear: w.isoYear,
      isoWeek: w.isoWeek,
      startDate: w.startDate.toISOString(),
      endDate: w.endDate.toISOString(),
      weekLabel,
      dateRange,
      freeSlotsUsed,
      freeSlotsRemaining,
      isFreeFull: freeSlotsRemaining === 0,
      isPromoActive: promo.isPromoActive,
    }
  })

  return { weeks, promo }
}
