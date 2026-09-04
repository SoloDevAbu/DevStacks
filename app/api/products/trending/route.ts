import { type NextRequest, NextResponse } from "next/server"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { TRENDING_PRODUCTS } from "@/constants/products"
import { z } from "zod"

const querySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
})

export const GET = async (req: NextRequest) => {
  const params = Object.fromEntries(req.nextUrl.searchParams)
  const parsed = querySchema.safeParse(params)
  const limit = parsed.success ? parsed.data.limit : 10

  try {
    const trending = await getTrendingProducts(limit)
    if (trending && trending.length > 0) {
      return NextResponse.json(
        { data: trending },
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

  const fallback = TRENDING_PRODUCTS.slice(0, limit).map((p, i) => ({
    id: p.id,
    slug: p.name.toLowerCase().replace(/\s+/g, "-"),
    name: p.name,
    tagline: p.tagline,
    tags: p.tags,
    upvotesCount: p.upvotes,
    buildsCount: p.builds,
    commentsCount: p.comments,
    viewsCount: Math.round(p.upvotes * 11.6),
    pricing: "Free" as const,
    tier: (i % 3 === 0 ? "free" : i % 3 === 1 ? "premium" : "premium+") as "free" | "premium" | "premium+",
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
