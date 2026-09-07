import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import { organizationSchema, faqSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { DEVSTACKS_FAQS } from "@/constants/faqs"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getNewAndRisingProducts } from "@/lib/rankings/new-and-rising"
import { getRisingTools } from "@/lib/rankings/rising-tools"
import { getRisingProducts } from "@/lib/rankings/rising-products"
import { getRecentlyAddedProducts } from "@/lib/rankings/recently-added"
import { getPopularBuildingBlocks } from "@/lib/rankings/popular"
import type { FeedItem } from "@/components/shared/feed-card"
import type { DbTool } from "@/components/shared/tool-card"
import type { DbProduct } from "@/components/shared/product-card"

export const revalidate = 60

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
  description: SITE_CONFIG.description,
  keywords: [...SITE_CONFIG.keywords],
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  openGraph: {
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    type: "website",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
}

const Page = async () => {
  const orgJsonLd = organizationSchema()
  const faqJsonLd = faqSchema(DEVSTACKS_FAQS)

  const [
    newAndRising,
    risingTools,
    risingProducts,
    recentlyAdded,
    popularBuildingBlocks,
  ] = await Promise.all([
    getNewAndRisingProducts({ limit: HOMEPAGE_LIMITS.NEW_AND_RISING }).catch(() => []),
    getRisingTools({ limit: HOMEPAGE_LIMITS.RISING_TOOLS }).catch(() => []),
    getRisingProducts({ limit: HOMEPAGE_LIMITS.DEVELOPER_BUILDS }).catch(() => []),
    getRecentlyAddedProducts({ limit: HOMEPAGE_LIMITS.RECENTLY_ADDED }).catch(() => []),
    getPopularBuildingBlocks({ limit: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS }).catch(() => []),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MainContent
        newAndRising={newAndRising as FeedItem[]}
        risingTools={risingTools as DbTool[]}
        risingProducts={risingProducts as DbProduct[]}
        recentlyAdded={recentlyAdded as FeedItem[]}
        popularBuildingBlocks={popularBuildingBlocks as FeedItem[]}
      />
    </>
  )
}

export default Page
