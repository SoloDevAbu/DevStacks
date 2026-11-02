import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getCachedWeeklyLaunches } from "@/lib/launches/weekly-launches"
import {
  getCurrentWeek,
  getISOWeekRange,
  formatLaunchWeekDisplay,
} from "@/utils/iso-weeks"
import type { RankedItem } from "@/lib/rankings/types"

export interface LaunchWeekSnapshot {
  year: number
  week: number
  weekLabel: string
  dateRange: string
  startDate: Date
  endDate: Date
  items: RankedItem[]
  lastUpdated: Date
}

// A scheduled launch is created before its week starts, so it goes live at the week's start.
export const getLaunchDate = (
  item: Pick<RankedItem, "createdAt">,
  weekStart: Date
): Date => {
  const createdAt = item.createdAt ? new Date(item.createdAt) : weekStart
  return createdAt > weekStart ? createdAt : weekStart
}

const getLastUpdated = (items: RankedItem[], weekStart: Date): Date =>
  items.reduce((latest, item) => {
    const updatedAt = item.updatedAt ? new Date(item.updatedAt) : weekStart
    const candidate = new Date(
      Math.max(updatedAt.getTime(), getLaunchDate(item, weekStart).getTime())
    )
    return candidate > latest ? candidate : latest
  }, weekStart)

export const getLaunchWeekSnapshot = async (
  year: number,
  week: number,
  limit: number = HOMEPAGE_LIMITS.WEEKLY_LAUNCHES_MAX
): Promise<LaunchWeekSnapshot> => {
  const items = await getCachedWeeklyLaunches(year, week, limit)
  const { startDate, endDate } = getISOWeekRange(year, week)
  const { weekLabel, dateRange } = formatLaunchWeekDisplay(year, week)

  return {
    year,
    week,
    weekLabel,
    dateRange,
    startDate,
    endDate,
    items,
    lastUpdated: getLastUpdated(items, startDate),
  }
}

export const getCurrentLaunchWeekSnapshot = (
  limit: number = HOMEPAGE_LIMITS.WEEKLY_LAUNCHES_MAX
) => {
  const { year, week } = getCurrentWeek()
  return getLaunchWeekSnapshot(year, week, limit)
}
