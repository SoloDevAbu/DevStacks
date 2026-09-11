import type { Metadata } from "next"
import { Clock } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"
import { heroStatPill } from "@/utils/styles"
import { getRecentlyAddedProducts } from "@/lib/rankings/recently-added"
import type { FeedItem } from "@/components/shared/feed-card"
import { RecentlyAddedContent } from "./recently-added-content"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Recently Added Developer Products & Tools",
  description: `Browse the newest products, APIs, and developer tools listed on ${SITE_CONFIG.name} in chronological order.`,
  keywords: [
    "recently added tools",
    "latest developer software",
    "newest APIs",
    "developer product submissions",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/recently-added`,
  },
  openGraph: {
    title: `Recently Added Products | ${SITE_CONFIG.name}`,
    description:
      "The latest developer tools and products added to the directory.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/recently-added`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Recently Added Products | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Recently Added Products | ${SITE_CONFIG.name}`,
    description:
      "The latest developer tools and products added to the directory.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const RecentlyAddedPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Recently Added",
      url: `${SITE_CONFIG.url}/discover/recently-added`,
    },
  ])

  const initialItems = await getRecentlyAddedProducts({
    limit: DISCOVER_PAGE_LIMIT,
    page: 1,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: "Recently Added Developer Products & Tools",
    description:
      "Every vetted developer tool and product in order of launch and submission.",
    url: `${SITE_CONFIG.url}/discover/recently-added`,
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
          heading="Recently Added"
          description="The latest tools and products submitted by makers, listed in chronological order."
          aiPrompt={AI_PROMPTS.recentlyAdded}
          variant="discover-recently-added"
          metrics={
            <div className={heroStatPill}>
              <Clock className="size-3.5 text-sky-600" />
              <span className="font-bold text-slate-900">Live Feed</span>
              <span className="text-slate-500">Chronological Stream</span>
            </div>
          }
        />

        <RecentlyAddedContent initialItems={initialItems as FeedItem[]} />
      </div>
    </>
  )
}

export default RecentlyAddedPage
