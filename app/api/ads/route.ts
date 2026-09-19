import { type NextRequest, NextResponse } from "next/server"
import { getActiveAds } from "@/db/queries/ads"
import { AD_PLACEMENT, type AdPlacement } from "@/constants/ads"
import { z } from "zod"

const querySchema = z.object({
  placement: z
    .enum([AD_PLACEMENT.SIDEBAR, AD_PLACEMENT.FEED, AD_PLACEMENT.BANNER])
    .default(AD_PLACEMENT.SIDEBAR),
  limit: z.coerce.number().int().min(1).max(20).default(5),
})

export const GET = async (req: NextRequest) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams)
    const parsed = querySchema.safeParse(params)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid placement query parameter" },
        { status: 400 }
      )
    }

    const { placement, limit } = parsed.data
    const activeAds = await getActiveAds({
      placement: placement as AdPlacement,
      limit,
    })

    const safeAds = activeAds.map((ad) => ({
      id: ad.id,
      placement: ad.placement,
      title: ad.title,
      description: ad.description,
      badgeText: ad.badgeText,
      imageUrl: ad.imageUrl,
      ctaText: ad.ctaText,
      ctaUrl: ad.ctaUrl,
    }))

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
