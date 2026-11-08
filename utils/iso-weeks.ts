export interface ISOWeekInfo {
  isoYear: number
  isoWeek: number
  startDate: Date
  endDate: Date
}

export const getISOWeek = (
  date: Date
): { isoYear: number; isoWeek: number } => {
  const d = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  )
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const isoWeek = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
  )
  return { isoYear: d.getUTCFullYear(), isoWeek }
}

export const getISOWeekRange = (
  isoYear: number,
  isoWeek: number
): { startDate: Date; endDate: Date } => {
  const jan4 = new Date(Date.UTC(isoYear, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4)
  monday.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1 + (isoWeek - 1) * 7)

  const sunday = new Date(monday)
  sunday.setUTCDate(monday.getUTCDate() + 6)
  sunday.setUTCHours(23, 59, 59, 999)

  return { startDate: monday, endDate: sunday }
}

export const getCurrentWeek = (
  now: Date = new Date()
): { year: number; week: number } => {
  const { isoYear, isoWeek } = getISOWeek(now)
  return { year: isoYear, week: isoWeek }
}

export const getRemainingWeeksOfYear = (
  fromDate?: Date,
  minWeeks = 8
): ISOWeekInfo[] => {
  const now = fromDate ?? new Date()
  const current = getISOWeek(now)
  const currentRange = getISOWeekRange(current.isoYear, current.isoWeek)

  const weeks: ISOWeekInfo[] = []
  let cursor = new Date(currentRange.startDate.getTime())
  const currentIsoYear = current.isoYear

  while (true) {
    const weekInfo = getISOWeek(cursor)
    const range = getISOWeekRange(weekInfo.isoYear, weekInfo.isoWeek)

    weeks.push({
      isoYear: weekInfo.isoYear,
      isoWeek: weekInfo.isoWeek,
      startDate: range.startDate,
      endDate: range.endDate,
    })

    cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000)

    const nextWeekInfo = getISOWeek(cursor)
    if (nextWeekInfo.isoYear > currentIsoYear && weeks.length >= minWeeks) {
      break
    }
    if (weeks.length >= 54) break
  }

  return weeks
}

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

export const formatWeekLabel = (isoYear: number, isoWeek: number): string => {
  const { startDate, endDate } = getISOWeekRange(isoYear, isoWeek)
  const startMonth = MONTH_SHORT[startDate.getUTCMonth()]
  const endMonth = MONTH_SHORT[endDate.getUTCMonth()]
  const startDay = startDate.getUTCDate()
  const endDay = endDate.getUTCDate()

  if (startMonth === endMonth) {
    return `W${isoWeek}: ${startMonth} ${startDay}–${endDay}`
  }
  return `W${isoWeek}: ${startMonth} ${startDay} – ${endMonth} ${endDay}`
}

export const formatWeekRangeShort = (
  isoYear: number,
  isoWeek: number
): string => {
  const { startDate, endDate } = getISOWeekRange(isoYear, isoWeek)
  const startMonth = MONTH_SHORT[startDate.getUTCMonth()]
  const endMonth = MONTH_SHORT[endDate.getUTCMonth()]
  const startDay = startDate.getUTCDate()
  const endDay = endDate.getUTCDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay}–${endDay}`
  }
  return `${startMonth} ${startDay} – ${endMonth} ${endDay}`
}

export const getUpcomingLaunchWeeks = (
  fromDate?: Date,
  horizonWeeks = 8
): ISOWeekInfo[] => {
  const now = fromDate ?? new Date()
  const current = getISOWeek(now)
  const currentRange = getISOWeekRange(current.isoYear, current.isoWeek)

  // Current week is locked once Monday 00:00 UTC begins. Start strictly from next week Monday.
  let cursor = new Date(
    currentRange.startDate.getTime() + 7 * 24 * 60 * 60 * 1000
  )

  const weeks: ISOWeekInfo[] = []
  for (let i = 0; i < horizonWeeks; i++) {
    const weekInfo = getISOWeek(cursor)
    const range = getISOWeekRange(weekInfo.isoYear, weekInfo.isoWeek)

    weeks.push({
      isoYear: weekInfo.isoYear,
      isoWeek: weekInfo.isoWeek,
      startDate: range.startDate,
      endDate: range.endDate,
    })

    cursor = new Date(cursor.getTime() + 7 * 24 * 60 * 60 * 1000)
  }

  return weeks
}

export const formatLaunchWeekDisplay = (
  isoYear: number,
  isoWeek: number
): { weekLabel: string; dateRange: string } => {
  const { startDate, endDate } = getISOWeekRange(isoYear, isoWeek)
  const startMonth = MONTH_SHORT[startDate.getUTCMonth()]
  const endMonth = MONTH_SHORT[endDate.getUTCMonth()]
  const startDay = startDate.getUTCDate()
  const endDay = endDate.getUTCDate()

  const dateRange =
    startMonth === endMonth
      ? `${startMonth} ${startDay} – ${endDay}`
      : `${startMonth} ${startDay} – ${endMonth} ${endDay}`

  return {
    weekLabel: `Week ${isoWeek}`,
    dateRange,
  }
}

export type WeekOption = {
  value: string
  label: string
  year: number
  week: number
}

export const generateWeekOptions = (year: number): WeekOption[] => {
  const { year: currentYear, week: currentWeek } = getCurrentWeek()
  const maxWeek =
    year < currentYear
      ? getISOWeek(new Date(Date.UTC(year, 11, 28))).isoWeek
      : currentWeek

  return Array.from({ length: maxWeek }, (_, index) => {
    const week = maxWeek - index
    const { weekLabel, dateRange } = formatLaunchWeekDisplay(year, week)
    return {
      value: `${year}-W${String(week).padStart(2, "0")}`,
      label: `${weekLabel}  ·  ${dateRange}`,
      year,
      week,
    }
  })
}

const WEEK_SLUG_PATTERN = /^week-(\d{1,2})$/

export const parseWeekSlug = (slug: string): number | null => {
  const match = slug.match(WEEK_SLUG_PATTERN)
  const week = match ? Number(match[1]) : NaN
  return week >= 1 && week <= 53 ? week : null
}

export const shiftWeek = (
  year: number,
  week: number,
  delta: number
): { year: number; week: number } => {
  const { startDate } = getISOWeekRange(year, week)
  const shifted = new Date(startDate.getTime() + delta * 7 * 24 * 60 * 60 * 1000)
  const { isoYear, isoWeek } = getISOWeek(shifted)
  return { year: isoYear, week: isoWeek }
}

export const isFutureWeek = (year: number, week: number): boolean => {
  const current = getCurrentWeek()
  return year > current.year || (year === current.year && week > current.week)
}

export const isCompletedWeek = (year: number, week: number): boolean => {
  const current = getCurrentWeek()
  return year < current.year || (year === current.year && week < current.week)
}

// "Week 45, 2026 (Nov 2 – 8)"
export const formatWeekTitle = (year: number, week: number): string => {
  const { weekLabel, dateRange } = formatLaunchWeekDisplay(year, week)
  return `${weekLabel}, ${year} (${dateRange})`
}

// A booked listing launches in its booked week; older listings in the week they were created.
export const getListingLaunchWeek = ({
  launchYear,
  launchWeek,
  createdAt,
}: {
  launchYear?: number | null
  launchWeek?: number | null
  createdAt?: Date | string | null
}): { year: number; week: number } | null => {
  if (launchYear && launchWeek) return { year: launchYear, week: launchWeek }
  return createdAt ? getCurrentWeek(new Date(createdAt)) : null
}

export interface LaunchNavWeekItem {
  year: number
  week: number
  label: string
  isActive: boolean
  isAvailable: boolean
}

export const getLaunchNavWeeks = ({
  activeYear,
  activeWeek,
  earliestYear,
  earliestWeek,
  futureWeeksCount = 5,
}: {
  activeYear: number
  activeWeek: number
  earliestYear?: number
  earliestWeek?: number
  futureWeeksCount?: number
}): {
  items: LaunchNavWeekItem[]
  previous?: { year: number; week: number }
  next?: { year: number; week: number }
} => {
  const current = getCurrentWeek()
  const resolvedEarliest = {
    year: earliestYear ?? activeYear,
    week: earliestWeek ?? activeWeek,
  }

  const isEarliestAfterActive =
    resolvedEarliest.year > activeYear ||
    (resolvedEarliest.year === activeYear && resolvedEarliest.week > activeWeek)
  const candidateStart = isEarliestAfterActive
    ? { year: activeYear, week: activeWeek }
    : resolvedEarliest

  const start = isFutureWeek(candidateStart.year, candidateStart.week)
    ? { year: activeYear, week: activeWeek }
    : candidateStart

  const endLimit = isFutureWeek(activeYear, activeWeek)
    ? { year: activeYear, week: activeWeek }
    : current

  const items: LaunchNavWeekItem[] = []
  let cursor = { ...start }

  while (
    cursor.year < endLimit.year ||
    (cursor.year === endLimit.year && cursor.week <= endLimit.week)
  ) {
    items.push({
      year: cursor.year,
      week: cursor.week,
      label: `Week ${cursor.week}`,
      isActive: cursor.year === activeYear && cursor.week === activeWeek,
      isAvailable: true,
    })
    cursor = shiftWeek(cursor.year, cursor.week, 1)
    if (items.length > 52) break
  }

  let futureCursor = endLimit
  for (let i = 0; i < futureWeeksCount; i++) {
    futureCursor = shiftWeek(futureCursor.year, futureCursor.week, 1)
    items.push({
      year: futureCursor.year,
      week: futureCursor.week,
      label: `Week ${futureCursor.week}`,
      isActive:
        futureCursor.year === activeYear && futureCursor.week === activeWeek,
      isAvailable: false,
    })
  }

  const candidatePrev = shiftWeek(activeYear, activeWeek, -1)
  const previous =
    candidatePrev.year > start.year ||
    (candidatePrev.year === start.year && candidatePrev.week >= start.week)
      ? candidatePrev
      : undefined

  const candidateNext = shiftWeek(activeYear, activeWeek, 1)
  const next =
    candidateNext.year < endLimit.year ||
    (candidateNext.year === endLimit.year && candidateNext.week <= endLimit.week)
      ? candidateNext
      : undefined

  return { items, previous, next }
}
