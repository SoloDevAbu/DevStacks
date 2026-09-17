import { NextResponse } from "next/server"
import { getWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getCurrentWeek } from "@/lib/launches/week-utils"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)

  const yearParam = searchParams.get("year")
  const weekParam = searchParams.get("week")

  if (!yearParam || !weekParam) {
    return NextResponse.json({ error: "year and week are required" }, { status: 400 })
  }

  const year = parseInt(yearParam, 10)
  const week = parseInt(weekParam, 10)

  if (isNaN(year) || isNaN(week) || week < 1 || week > 53) {
    return NextResponse.json({ error: "Invalid year or week" }, { status: 400 })
  }

  const { year: currentYear, week: currentWeek } = getCurrentWeek()
  if (year > currentYear || (year === currentYear && week > currentWeek)) {
    return NextResponse.json({ error: "Cannot fetch future weeks" }, { status: 400 })
  }

  try {
    const launches = await getWeeklyLaunches({ year, week, limit: HOMEPAGE_LIMITS.WEEKLY_LAUNCHES })
    return NextResponse.json(launches)
  } catch {
    return NextResponse.json({ error: "Failed to fetch weekly launches" }, { status: 500 })
  }
}
