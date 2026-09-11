import type { Metadata } from "next"
import { Clock, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"
import { heroStatPill } from "@/utils/styles"
import { getNewAndRisingProducts } from "@/lib/rankings/new-and-rising"
import type { FeedItem } from "@/components/shared/feed-card"
import { NewAndRisingContent } from "./new-rising-content"

export const revalidate = 60

export const metadata: Metadata = {
  title: "New & Rising Developer Tools & Products",
  description: `Discover fresh developer tools and products gaining momentum during their 7-day discovery window on ${SITE_CONFIG.name}.`,
  keywords: [
    "new developer tools",
    "rising software products",
    "recent developer launches",
    "fresh APIs",
    "new software discovery",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/new-rising`,
  },
  openGraph: {
    title: `New & Rising Developer Tools | ${SITE_CONFIG.name}`,
    description:
      "Fresh developer tools and products gaining attention during their discovery window.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/new-rising`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `New & Rising Developer Tools | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `New & Rising Developer Tools | ${SITE_CONFIG.name}`,
    description:
      "Fresh developer tools and products gaining attention during their discovery window.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const NewAndRisingPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "New & Rising", url: `${SITE_CONFIG.url}/discover/new-rising` },
  ])

  const initialItems = await getNewAndRisingProducts({
    limit: DISCOVER_PAGE_LIMIT,
    page: 1,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: "New & Rising Developer Tools & Products",
    description:
      "Recently submitted developer tools and products gaining attention with a 7-day freshness boost.",
    url: `${SITE_CONFIG.url}/discover/new-rising`,
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
          heading="New & Rising"
          description="Recently submitted tools and products gaining attention. Every submission gets a 7-day discovery window with a freshness boost."
          aiPrompt={AI_PROMPTS.newRising}
          variant="discover-new-rising"
          metrics={
            <div className={heroStatPill}>
              <Sparkles className="size-3.5 text-amber-600" />
              <span className="font-bold text-slate-900">7-Day Boost</span>
              <span className="text-slate-500">Fresh Submissions</span>
            </div>
          }
        />

        {/* Discovery window informational banner */}
        <div className="border-b border-dashed border-border bg-amber-50/40 px-6 py-3 md:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
            <Clock className="size-4 shrink-0 text-amber-600" />
            <span>
              <strong>Discovery Window:</strong> Fresh content receives a
              temporary 7-day freshness boost before graduating into the
              permanent ecosystem.
            </span>
          </div>
        </div>

        <NewAndRisingContent initialItems={initialItems as FeedItem[]} />
      </div>
    </>
  )
}

export default NewAndRisingPage
