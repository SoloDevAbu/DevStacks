export interface ISOWeekInfo {
  isoYear: number
  isoWeek: number
  startDate: Date
  endDate: Date
}

export const getISOWeek = (date: Date): { isoYear: number; isoWeek: number } => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const isoWeek = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
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

export const getRemainingWeeksOfYear = (fromDate?: Date): ISOWeekInfo[] => {
  const now = fromDate ?? new Date()
  const current = getISOWeek(now)
  const weeks: ISOWeekInfo[] = []

  const lastWeekOfYear = getISOWeek(new Date(Date.UTC(now.getFullYear(), 11, 28)))

  for (let w = current.isoWeek; w <= lastWeekOfYear.isoWeek; w++) {
    const { startDate, endDate } = getISOWeekRange(current.isoYear, w)
    weeks.push({ isoYear: current.isoYear, isoWeek: w, startDate, endDate })
  }

  if (weeks.length < 8) {
    const nextYear = current.isoYear + 1
    const needed = 8 - weeks.length
    for (let w = 1; w <= needed; w++) {
      const { startDate, endDate } = getISOWeekRange(nextYear, w)
      weeks.push({ isoYear: nextYear, isoWeek: w, startDate, endDate })
    }
  }

  return weeks
}

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
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

export const formatWeekRangeShort = (isoYear: number, isoWeek: number): string => {
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
