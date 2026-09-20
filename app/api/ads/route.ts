import { type NextRequest, NextResponse } from "next/server"
import { getActiveAdsForCurrentWeek } from "@/db/queries/ads"
import { AD_PLACEMENT, type AdPlacement } from "@/constants/ads"
import { z } from "zod"

const querySchema = z.object({
  placement: z
    .enum([AD_PLACEMENT.SIDEBAR, AD_PLACEMENT.FEED])
    .default(AD_PLACEMENT.SIDEBAR),
  limit: z.coerce.number().int().min(1).max(10).default(3),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid query parameters" },
        { status: 400 }
      )
    }

    const { placement, limit } = parsed.data
    const activeAds = await getActiveAdsForCurrentWeek({
      placement: placement as AdPlacement,
      limit,
    })

    const safeAds = activeAds.map((ad) => {
      const source = ad.tool ?? ad.product
      return {
        id: ad.id,
        placement: ad.placement,
        name: source?.name ?? "Sponsored",
        tagline: source?.tagline ?? "",
        logoUrl: source?.logoUrl ?? null,
        websiteUrl: source?.websiteUrl ?? "",
        slug: source?.slug ?? "",
        ctaText: ad.ctaText,
        type: ad.tool ? "tool" : "product",
      }
    })

    return NextResponse.json(
      { data: safeAds },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    )
  } catch (error) {
    console.error("Failed to fetch active ads:", error)
    return NextResponse.json(
      { error: "Failed to fetch active ads" },
      { status: 500 }
    )
  }
}
