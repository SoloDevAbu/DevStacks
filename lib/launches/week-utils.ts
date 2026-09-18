export type WeekOption = {
  value: string
  label: string
  year: number
  week: number
}

export const getISOWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

export const getISOWeekYear = (date: Date): number => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  return d.getUTCFullYear()
}

export const getWeekRange = (year: number, week: number): { start: Date; end: Date } => {
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const startOfWeek1 = new Date(jan4)
  startOfWeek1.setUTCDate(jan4.getUTCDate() - dayOfWeek + 1)

  const start = new Date(startOfWeek1)
  start.setUTCDate(startOfWeek1.getUTCDate() + (week - 1) * 7)
  start.setUTCHours(0, 0, 0, 0)

  const end = new Date(start)
  end.setUTCDate(start.getUTCDate() + 6)
  end.setUTCHours(23, 59, 59, 999)

  return { start, end }
}

export const getCurrentWeek = (): { year: number; week: number } => {
  const now = new Date()
  return {
    year: getISOWeekYear(now),
    week: getISOWeekNumber(now),
  }
}

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

const formatDate = (date: Date): string =>
  `${SHORT_MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`

export const generateWeekOptions = (year: number): WeekOption[] => {
  const { year: currentYear, week: currentWeek } = getCurrentWeek()
  const maxWeek = year < currentYear ? getISOWeekNumber(new Date(Date.UTC(year, 11, 28))) : currentWeek

  const options: WeekOption[] = []
  for (let w = 1; w <= maxWeek; w++) {
    const { start, end } = getWeekRange(year, w)
    options.push({
      value: `${year}-W${String(w).padStart(2, "0")}`,
      label: `Week ${w}  ·  ${formatDate(start)} – ${formatDate(end)}`,
      year,
      week: w,
    })
  }

  return options.reverse()
}
