import { type NextRequest, NextResponse } from "next/server"
import { after } from "next/server"
import { getAdWithTargetUrl, incrementAdClick } from "@/db/queries/ads"
import { SITE_CONFIG } from "@/constants/site"
import { getClientIp, isDeduplicated } from "@/lib/rate-limit"
import { AD_TRACKING_RATE_LIMIT } from "@/constants/ads"

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params
    const ad = await getAdWithTargetUrl(id)

    if (!ad) {
      return NextResponse.redirect(SITE_CONFIG.url, { status: 302 })
    }

    const ip = getClientIp(req)
    const isDuplicate = isDeduplicated(
      `ad-click:${id}:${ip}`,
      AD_TRACKING_RATE_LIMIT.CLICK_WINDOW_MS
    )

    if (!isDuplicate) {
      after(async () => {
        try {
          await incrementAdClick(id)
        } catch (err) {
          console.error("Failed to increment ad click count:", err)
        }
      })
    }

    const targetUrl =
      ad.targetUrl.startsWith("http://") || ad.targetUrl.startsWith("https://")
        ? ad.targetUrl
        : `https://${ad.targetUrl}`

    return NextResponse.redirect(targetUrl, { status: 302 })
  } catch (error) {
    console.error("Ad click redirect error:", error)
    return NextResponse.redirect(SITE_CONFIG.url, { status: 302 })
  }
}
