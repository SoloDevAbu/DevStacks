import { type NextRequest, NextResponse } from "next/server"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { z } from "zod"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)

    const limit = parsed.success ? parsed.data.limit : 10
    const trending = await getTrendingProducts(limit)

    return NextResponse.json(
      { data: trending },
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
