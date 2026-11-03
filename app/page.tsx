import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import {
  collectionPageSchema,
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getCurrentLaunchWeekSnapshot } from "@/lib/launches/launch-week"
import { getCachedPopularBuildingBlocks } from "@/lib/rankings/popular"
import { getListingPath, toAbsoluteUrl } from "@/utils/urls"
import type { FeedItem } from "@/components/shared/feed-card"

export const revalidate = 3600

const HOME_TITLE = `${SITE_CONFIG.name} — New Product & Dev Tool Launches This Week`
const HOME_DESCRIPTION = `See this week's new products and developer tools on ${SITE_CONFIG.name}, ranked by community votes. Launch yours free and get found on Google and AI search.`

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  keywords: [
    "product launch platform",
    "new product launches this week",
    "new developer tools",
    "launch your SaaS",
  ],
  alternates: {
    canonical: SITE_CONFIG.url,
    types: { "text/markdown": toAbsoluteUrl(ROUTES.HOME_MARKDOWN_ALIAS) },
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: HOME_TITLE,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [SITE_CONFIG.ogImageUrl],
  },
}

const Page = async () => {
  const [launchWeek, popularBuildingBlocks] = await Promise.all([
    getCurrentLaunchWeekSnapshot(),
    getCachedPopularBuildingBlocks(
      HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS
    ).catch(() => []),
  ])
  const weeklyLaunches = launchWeek.items as FeedItem[]
  const launchListItems = weeklyLaunches.map((item) => ({
    name: item.name,
    url: toAbsoluteUrl(getListingPath(item)),
    description: item.tagline,
  }))

  const breadcrumbs = breadcrumbSchema([{ name: "Home", url: SITE_CONFIG.url }])

  const collectionJsonLd = collectionPageSchema({
    name: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_CONFIG.url,
    items: launchListItems,
    dateModified: launchWeek.lastUpdated,
  })

  const unifiedJsonLd = buildEntityGraph([breadcrumbs, collectionJsonLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedJsonLd) }}
      />
      <MainContent
        launchWeek={launchWeek}
        popularBuildingBlocks={popularBuildingBlocks as FeedItem[]}
      />
    </>
  )
}

export default Page
