import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import {
  organizationSchema,
  collectionPageSchema,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getTodaysLaunches } from "@/lib/launches/todays-launches"
import { getWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getPopularBuildingBlocks } from "@/lib/rankings/popular"
import { getCurrentWeek } from "@/lib/launches/week-utils"
import type { FeedItem } from "@/components/shared/feed-card"

export const revalidate = 60

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Today's Developer Launches`,
  description:
    `Discover the developer tools, APIs, and products launching today and this week on ${SITE_CONFIG.name}. Ranked by community votes, updated every minute.`,
  keywords: [
    ...SITE_CONFIG.keywords,
    "daily developer launches",
    "today's developer tools",
    "product launches today",
    "new software launches",
    "community voted tools",
  ],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — Today's Developer Launches`,
    description:
      `Discover the developer tools, APIs, and products launching today on ${SITE_CONFIG.name}, ranked by community votes.`,
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — Today's Developer Launches`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — Today's Developer Launches`,
    description:
      `Discover the developer tools, APIs, and products launching today on ${SITE_CONFIG.name}, ranked by community votes.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const Page = async () => {
  const orgJsonLd = organizationSchema()
  const { year, week } = getCurrentWeek()

  const [todaysLaunches, weeklyLaunches, popularBuildingBlocks] =
    await Promise.all([
      getTodaysLaunches({ limit: HOMEPAGE_LIMITS.TODAYS_LAUNCHES }).catch(() => []),
      getWeeklyLaunches({ year, week, limit: HOMEPAGE_LIMITS.WEEKLY_LAUNCHES }).catch(() => []),
      getPopularBuildingBlocks({
        limit: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS,
      }).catch(() => []),
    ])

  const featuredItems = (todaysLaunches as FeedItem[])
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      url: `${SITE_CONFIG.url}${item.itemKind === "tool" ? `/tools/${item.slug}` : `/products/${item.slug}`}`,
      description: item.tagline,
    }))

  const collectionJsonLd = collectionPageSchema({
    name: `${SITE_CONFIG.name} — Developer Tools & Products`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    items: featuredItems,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <MainContent
        todaysLaunches={todaysLaunches as FeedItem[]}
        weeklyLaunches={weeklyLaunches as FeedItem[]}
        popularBuildingBlocks={popularBuildingBlocks as FeedItem[]}
      />
    </>
  )
}

export default Page
