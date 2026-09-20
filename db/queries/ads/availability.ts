import { db } from "@/db"
import { adWeeks } from "@/db/schema"
import { and, eq, sql } from "drizzle-orm"
import type { AdPlacement } from "@/constants/ads"
import { AD_SLOTS_PER_WEEK, AD_HOLD_DURATION_MINUTES } from "@/constants/ads"
import { getRemainingWeeksOfYear, getISOWeekRange } from "@/utils/iso-weeks"

export interface WeekAvailability {
  isoYear: number
  isoWeek: number
  startDate: string
  endDate: string
  slotsUsed: number
  slotsRemaining: number
}

export const getWeekAvailability = async (
  placement: AdPlacement
): Promise<WeekAvailability[]> => {
  const upcomingWeeks = getRemainingWeeksOfYear()

  if (upcomingWeeks.length === 0) return []

  const bookedCounts = await db
    .select({
      isoYear: adWeeks.isoYear,
      isoWeek: adWeeks.isoWeek,
      count: sql<number>`count(${adWeeks.id})::int`,
    })
    .from(adWeeks)
    .where(
      and(
        eq(adWeeks.placement, placement),
        sql`(${adWeeks.status} = 'active' OR (${adWeeks.status} = 'pending_payment' AND ${adWeeks.createdAt} > NOW() - (${AD_HOLD_DURATION_MINUTES} || ' minutes')::interval))`
      )
    )
    .groupBy(adWeeks.isoYear, adWeeks.isoWeek)

  const bookedMap = new Map<string, number>()
  for (const row of bookedCounts) {
    bookedMap.set(`${row.isoYear}-${row.isoWeek}`, row.count)
  }

  return upcomingWeeks.map((w) => {
    const slotsUsed = bookedMap.get(`${w.isoYear}-${w.isoWeek}`) ?? 0
    return {
      isoYear: w.isoYear,
      isoWeek: w.isoWeek,
      startDate: w.startDate.toISOString(),
      endDate: w.endDate.toISOString(),
      slotsUsed,
      slotsRemaining: Math.max(0, AD_SLOTS_PER_WEEK - slotsUsed),
    }
  })
}
