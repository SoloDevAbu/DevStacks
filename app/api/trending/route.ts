import { type NextRequest, NextResponse } from "next/server"
import { getTrending } from "@/lib/rankings/trending"
import type { TimeframeOption } from "@/lib/rankings/types"
import { z } from "zod"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  timeframe: z
    .enum(["today", "this-week", "this-month", "all-time"])
    .default("today"),
  category: z.string().optional(),
})

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = querySchema.safeParse(params)
  const { limit, timeframe, category } = parsed.success
    ? parsed.data
    : { limit: 10, timeframe: "today" as TimeframeOption, category: undefined }

  try {
    const trending = await getTrending(
      limit,
      timeframe as TimeframeOption,
      category
    )
    return NextResponse.json(
      { data: trending ?? [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch trending products" },
      { status: 500 }
    )
  }
}
