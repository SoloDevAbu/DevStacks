import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { getWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getCurrentWeek } from "@/lib/launches/week-utils"
import type { FeedItem } from "@/components/shared/feed-card"

export const revalidate = 3600

const escapeXml = (str: string): string =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

export const GET = async () => {
  const { year, week } = getCurrentWeek()
  let items: FeedItem[] = []

  try {
    items = (await getWeeklyLaunches({ year, week, limit: 50 })) as FeedItem[]
  } catch {
    items = []
  }

  const nowRssDate = new Date().toUTCString()
  const siteUrl = SITE_CONFIG.url

  const itemsXml = items
    .map((item) => {
      const isTool = item.itemKind === "tool"
      const url = `${siteUrl}${isTool ? `/tools/${item.slug}` : `/products/${item.slug}`}`
      const pubDate = item.createdAt
        ? new Date(item.createdAt).toUTCString()
        : nowRssDate
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
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
