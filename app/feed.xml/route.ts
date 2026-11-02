import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_SURFACE_CACHE_CONTROL } from "@/constants/cache"
import {
  getCurrentLaunchWeekSnapshot,
  getLaunchDate,
} from "@/lib/launches/launch-week"
import { getListingPath, toAbsoluteUrl } from "@/utils/urls"

export const revalidate = 3600

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

export const GET = async () => {
  // Not caught on purpose: a failed refresh keeps serving the last good feed.
  const launchWeek = await getCurrentLaunchWeekSnapshot()

  const nowRssDate = new Date().toUTCString()
  const siteUrl = SITE_CONFIG.url

  const itemsXml = launchWeek.items
    .map((item) => {
      const url = toAbsoluteUrl(getListingPath(item))
      const pubDate = getLaunchDate(item, launchWeek.startDate).toUTCString()
      const category = item.category
        ? `<category>${escapeXml(item.category)}</category>`
        : ""

      return `    <item>
      <title>${escapeXml(item.name)} — ${escapeXml(item.tagline)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(item.tagline)}</description>
      ${category}
    </item>`
    })
    .join("\n")

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_CONFIG.name)} — Weekly Developer Launches</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(SITE_CONFIG.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${nowRssDate}</lastBuildDate>
    <atom:link href="${toAbsoluteUrl(ROUTES.FEED)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": AI_SURFACE_CACHE_CONTROL,
    },
  })
}
