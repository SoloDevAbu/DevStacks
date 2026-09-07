import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema } from "@/lib/seo/schema"
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
  },
  twitter: {
    card: "summary_large_image",
    title: `Popular Building Blocks | ${SITE_CONFIG.name}`,
    description: "The tools developers are building with.",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="🔥 Popular Building Blocks"
          description="The tools developers are building with. Ranked by verified developer builds, ecosystem adoption, and lifetime engagement."
          aiPrompt={AI_PROMPTS.popularBuildingBlocks}
        />

        <PopularBuildingBlocksContent initialItems={initialItems as FeedItem[]} />
      </div>
    </>
  )
}

export default PopularBuildingBlocksPage

