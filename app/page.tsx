import type { Metadata } from "next"
import { MainContent } from "@/components/home/main-content"
import {
  organizationSchema,
  faqSchema,
  collectionPageSchema,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { DEVSTACKS_FAQS } from "@/constants/faqs"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getNewAndRisingProducts } from "@/lib/rankings/new-and-rising"
import { getRisingTools } from "@/lib/rankings/rising-tools"
import { getRisingProducts } from "@/lib/rankings/rising-products"
import { getRecentlyAddedProducts } from "@/lib/rankings/recently-added"
import { getPopularBuildingBlocks } from "@/lib/rankings/popular"
import type { FeedItem } from "@/components/shared/feed-card"
import type { DbTool, DbProduct } from "@/types/entities"

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
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/twitter-image`],
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
    getNewAndRisingProducts({ limit: HOMEPAGE_LIMITS.NEW_AND_RISING }).catch(
      () => []
    ),
    getRisingTools({ limit: HOMEPAGE_LIMITS.RISING_TOOLS }).catch(() => []),
    getRisingProducts({ limit: HOMEPAGE_LIMITS.DEVELOPER_BUILDS }).catch(
      () => []
    ),
    getRecentlyAddedProducts({ limit: HOMEPAGE_LIMITS.RECENTLY_ADDED }).catch(
      () => []
    ),
    getPopularBuildingBlocks({
      limit: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS,
    }).catch(() => []),
  ])

  const featuredItems = (newAndRising as FeedItem[])
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
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
