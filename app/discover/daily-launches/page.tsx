import type { Metadata } from "next"
import { Zap } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { heroStatPill } from "@/utils/styles"
import { getTodaysLaunches } from "@/lib/launches/todays-launches"
import { AI_PROMPTS } from "@/lib/prompts"
import type { FeedItem } from "@/components/shared/feed-card"
import { FeedCard } from "@/components/shared/feed-card"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Today's Launches — Developer Tools & Products",
  description: `Browse all developer tools and products launched today on ${SITE_CONFIG.name}, ranked by community votes.`,
  keywords: [
    "today's developer launches",
    "new developer tools today",
    "daily software launches",
    "daily developer products",
    "launched today",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/daily-launches`,
  },
  openGraph: {
    title: `Today's Launches | ${SITE_CONFIG.name}`,
    description:
      "All developer tools and products launched today, ranked by community votes.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/daily-launches`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Today's Launches | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Today's Launches | ${SITE_CONFIG.name}`,
    description:
      "All developer tools and products launched today, ranked by community votes.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const DailyLaunchesPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Today's Launches",
      url: `${SITE_CONFIG.url}/discover/daily-launches`,
    },
  ])

  const items = await getTodaysLaunches({
    limit: HOMEPAGE_LIMITS.TODAYS_LAUNCHES,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: "Today's Developer Launches",
    description:
      "Developer tools and products launched today, ranked by community votes.",
    url: `${SITE_CONFIG.url}/discover/daily-launches`,
    items: (items as FeedItem[]).map((item) => ({
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
          heading="Today's Launches"
          description="All developer tools and products launched today, ranked by community votes. Updated every 60 seconds."
          aiPrompt={AI_PROMPTS.dailyLaunches}
          variant="discover-daily-launches"
          metrics={
            <div className={heroStatPill}>
              <Zap className="size-3.5 text-rose-500" />
              <span className="font-bold text-slate-900">Live Today</span>
              <span className="text-slate-500">Refreshed every minute</span>
            </div>
          }
        />

        <div className="flex flex-col pb-16">
          {(items as FeedItem[]).length === 0 ? (
            <div className="border-b border-dashed border-border bg-white py-20 text-center">
              <p className="text-sm font-medium text-slate-400">
                No launches today yet.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Be the first to{" "}
                <a
                  href="/submit"
                  className="underline underline-offset-2 hover:text-slate-600"
                >
                  launch something
                </a>
                !
              </p>
            </div>
          ) : (
            (items as FeedItem[]).map((item, index) => (
              <FeedCard
                key={item.id}
                item={item}
                index={index}
                showMedals={true}
                showFreshnessBadge={true}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default DailyLaunchesPage
