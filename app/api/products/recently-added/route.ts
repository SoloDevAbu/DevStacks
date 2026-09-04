import { type NextRequest, NextResponse } from "next/server"
import { getRecentlyAddedProducts } from "@/db/queries/products/recently-added"
import { RECENTLY_ADDED } from "@/constants/products"
import { z } from "zod"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(6),
})

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = querySchema.safeParse(params)
  const limit = parsed.success ? parsed.data.limit : 6

  try {
    const recent = await getRecentlyAddedProducts(limit)
    if (recent && recent.length > 0) {
      return NextResponse.json(
        { data: recent },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      )
    }
  } catch {
    // Fall back to static constants
  }

  const fallback = RECENTLY_ADDED.slice(0, limit).map((r) => ({
    id: r.name.toLowerCase(),
    slug: r.name.toLowerCase().replace(/\s+/g, "-"),
    name: r.name,
    tagline: r.desc,
    category: r.category,
    tier: r.tier,
    logoUrl: null,
  }))

  return NextResponse.json(
    { data: fallback },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  )
}
