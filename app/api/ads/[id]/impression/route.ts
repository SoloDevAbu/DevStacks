import { type NextRequest, NextResponse } from "next/server"
import { incrementAdImpression } from "@/db/queries/ads"
import { getClientIp, isDeduplicated } from "@/lib/rate-limit"
import { AD_TRACKING_RATE_LIMIT } from "@/constants/ads"

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params
    const ip = getClientIp(req)

    if (
      isDeduplicated(
        `ad-imp:${id}:${ip}`,
        AD_TRACKING_RATE_LIMIT.IMPRESSION_WINDOW_MS
      )
    ) {
      return NextResponse.json({ ok: true, deduplicated: true })
    }

    await incrementAdImpression(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Ad impression tracking error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
