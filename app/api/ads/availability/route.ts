import { type NextRequest, NextResponse } from "next/server"
import { getWeekAvailability } from "@/db/queries/ads/availability"
import { AD_PLACEMENT, type AdPlacement } from "@/constants/ads"
import { z } from "zod"

const querySchema = z.object({
  placement: z
    .enum([AD_PLACEMENT.SIDEBAR, AD_PLACEMENT.FEED])
    .default(AD_PLACEMENT.SIDEBAR),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid placement parameter" },
        { status: 400 }
      )
    }

    const weeks = await getWeekAvailability(parsed.data.placement as AdPlacement)

    return NextResponse.json(
      { data: weeks },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch ad availability:", error)
    return NextResponse.json(
      { error: "Failed to fetch ad availability" },
      { status: 500 }
    )
  }
}
