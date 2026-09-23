import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import {
  collectionPageSchema,
  breadcrumbSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getPopularBuildingBlocks } from "@/lib/rankings/popular"
import { getCurrentWeek } from "@/lib/launches/week-utils"
import type { FeedItem } from "@/components/shared/feed-card"

export const revalidate = 60

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_CONFIG.name} — This Week's Launches for AI & Search Engines`,
  },
  description:
    `Discover this week's developer tools, APIs, and products launching on ${SITE_CONFIG.name}. Ranked by community votes and optimized for AI search engines, ChatGPT, Claude, and Google.`,
  keywords: [
    ...SITE_CONFIG.keywords,
    "weekly developer launches",
    "search by AI",
    "AI search engines",
    "AI product discovery",
    "ChatGPT tool discovery",
    "Claude software search",
    "GEO optimization",
    "AEO discovery",
    "this week's developer tools",
    "product launches this week",
    "new software launches",
    "community voted tools",
    "developer tools directory",
  ],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — This Week's Launches for AI & Search Engines`,
    description:
      `Discover this week's developer tools, APIs, and products launching on ${SITE_CONFIG.name}. Ranked by community votes and optimized for AI search engines, ChatGPT, Claude, and Google.`,
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — This Week's Launches for AI & Search Engines`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — This Week's Launches for AI & Search Engines`,
    description:
      `Discover this week's developer tools, APIs, and products launching on ${SITE_CONFIG.name}. Ranked by community votes and optimized for AI search engines, ChatGPT, Claude, and Google.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const Page = async () => {
  const { year, week } = getCurrentWeek()

  const [weeklyLaunches, popularBuildingBlocks] = await Promise.all([
    getWeeklyLaunches({ year, week, limit: HOMEPAGE_LIMITS.WEEKLY_LAUNCHES_MAX }).catch(() => []),
    getPopularBuildingBlocks({
      limit: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS,
    }).catch(() => []),
  ])
  const featuredItems = (weeklyLaunches as FeedItem[])
    .slice(0, 10)
    .map((item) => ({
      name: item.name,
      url: `${SITE_CONFIG.url}${item.itemKind === "tool" ? `/tools/${item.slug}` : `/products/${item.slug}`}`,
      description: item.tagline,
    }))

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
  ])

  const collectionJsonLd = collectionPageSchema({
    name: `${SITE_CONFIG.name} — This Week's Launches for AI & Search Engines`,
    description:
      `Discover developer tools, APIs, and software products launched this week on ${SITE_CONFIG.name}, ranked by community votes and optimized for AI and search engine discovery.`,
    url: SITE_CONFIG.url,
    items: featuredItems,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(collectionJsonLd) }}
      />
      <MainContent
        weeklyLaunches={weeklyLaunches as FeedItem[]}
        popularBuildingBlocks={popularBuildingBlocks as FeedItem[]}
      />
    </>
  )
}

export default Page
