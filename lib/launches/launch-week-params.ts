import { LAUNCH_ARCHIVE_FIRST_YEAR } from "@/constants/launches"
import { isFutureWeek, parseWeekSlug } from "@/utils/iso-weeks"

// Resolves `/launches/[year]/[week]` params, rejecting malformed and future weeks.
export const parseLaunchWeekParams = (
  rawYear: string,
  rawWeek: string
): { year: number; week: number } | null => {
  const year = Number(rawYear)
  const week = parseWeekSlug(rawWeek)
  if (!Number.isInteger(year) || year < LAUNCH_ARCHIVE_FIRST_YEAR || !week) return null
  if (isFutureWeek(year, week)) return null
  return { year, week }
}
