import { type NextRequest, NextResponse } from "next/server"
import { getLaunchWeekAvailability } from "@/db/queries/launches/availability"

export const GET = async (_req: NextRequest) => {
  try {
    const result = await getLaunchWeekAvailability()

    return NextResponse.json(
      { data: result },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch launch week availability:", error)
    return NextResponse.json(
      { error: "Failed to fetch launch week availability" },
      { status: 500 }
    )
  }
}
