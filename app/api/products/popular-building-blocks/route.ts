import { type NextRequest, NextResponse } from "next/server"
import { getPopularBuildingBlocks } from "@/lib/rankings/popular"
import { z } from "zod"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
})

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = querySchema.safeParse(params)
  const { limit, page } = parsed.success ? parsed.data : { limit: 10, page: 1 }

  try {
    const products = await getPopularBuildingBlocks({ limit, page })
    return NextResponse.json(
      { data: products ?? [] },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    )
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch popular building blocks" },
      { status: 500 }
    )
  }
}
