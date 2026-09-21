import { NextResponse } from "next/server"
import { getWeeklyPremiumLaunches } from "@/lib/launches/weekly-launches"
import { getCurrentWeek } from "@/lib/launches/week-utils"

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url)

  const { year: currentYear, week: currentWeek } = getCurrentWeek()
  const yearParam = searchParams.get("year")
  const weekParam = searchParams.get("week")

  const year = yearParam ? parseInt(yearParam, 10) : currentYear
  const week = weekParam ? parseInt(weekParam, 10) : currentWeek

  if (isNaN(year) || isNaN(week) || week < 1 || week > 53) {
    return NextResponse.json({ error: "Invalid year or week" }, { status: 400 })
  }

  if (year > currentYear || (year === currentYear && week > currentWeek)) {
    return NextResponse.json({ error: "Cannot fetch future weeks" }, { status: 400 })
  }

  try {
    const launches = await getWeeklyPremiumLaunches({ year, week })
    return NextResponse.json(launches, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch weekly premium launches" },
      { status: 500 }
    )
  }
}
