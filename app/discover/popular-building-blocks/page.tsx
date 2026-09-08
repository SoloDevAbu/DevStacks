import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"
import { getPopularBuildingBlocks } from "@/lib/rankings/popular"
import type { FeedItem } from "@/components/shared/feed-card"
import { PopularBuildingBlocksContent } from "./popular-building-blocks-content"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Popular Building Blocks — Developer Tools & Infrastructure",
  description: `Explore the most popular developer tools, APIs, and building blocks on ${SITE_CONFIG.name} ranked by verified project adoption and usage.`,
  keywords: [
    "popular developer tools",
    "developer building blocks",
    "top APIs",
    "most used software tools",
    "popular developer infrastructure",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/popular-building-blocks`,
  },
  openGraph: {
    title: `Popular Building Blocks | ${SITE_CONFIG.name}`,
    description: "The tools developers are building with.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/popular-building-blocks`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Popular Building Blocks | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Popular Building Blocks | ${SITE_CONFIG.name}`,
    description: "The tools developers are building with.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const PopularBuildingBlocksPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Discover", url: `${SITE_CONFIG.url}/discover` },
    {
      name: "Popular Building Blocks",
      url: `${SITE_CONFIG.url}/discover/popular-building-blocks`,
    },
  ])

  const initialItems = await getPopularBuildingBlocks({
    limit: DISCOVER_PAGE_LIMIT,
    page: 1,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: "Popular Developer Building Blocks",
    description:
      "The foundational infrastructure and services developers choose most when launching products.",
    url: `${SITE_CONFIG.url}/discover/popular-building-blocks`,
    items: (initialItems as FeedItem[]).map((item) => ({
      name: item.name,
      url: `${SITE_CONFIG.url}${item.itemKind === "tool" ? `/tools/${item.slug}` : `/products/${item.slug}`}`,
      description: item.tagline,
    })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="🔥 Popular Building Blocks"
          description="The tools developers are building with. Ranked by verified developer builds, ecosystem adoption, and lifetime engagement."
          aiPrompt={AI_PROMPTS.popularBuildingBlocks}
        />

        <PopularBuildingBlocksContent
          initialItems={initialItems as FeedItem[]}
        />
      </div>
    </>
  )
}

export default PopularBuildingBlocksPage
