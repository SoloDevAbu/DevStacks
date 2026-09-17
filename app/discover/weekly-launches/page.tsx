import type { Metadata } from "next"
import { CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema, collectionPageSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { heroStatPill } from "@/utils/styles"
import { getWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getCurrentWeek } from "@/lib/launches/week-utils"
import { AI_PROMPTS } from "@/lib/prompts"
import type { FeedItem } from "@/components/shared/feed-card"
import { WeeklyLaunchesContent } from "./weekly-launches-content"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Weekly Launches — Developer Tools & Products",
  description: `Browse developer tools and products by week. See what the community launched and voted for each week on ${SITE_CONFIG.name}.`,
  keywords: [
    "weekly developer launches",
    "weekly software launches",
    "developer tools by week",
    "weekly product launches",
    "developer ecosystem weekly",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/weekly-launches`,
  },
  openGraph: {
    title: `Weekly Launches | ${SITE_CONFIG.name}`,
    description:
      "Browse developer tools and products launched each week, ranked by community votes.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/weekly-launches`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Weekly Launches | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Weekly Launches | ${SITE_CONFIG.name}`,
    description:
      "Browse developer tools and products launched each week, ranked by community votes.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const WeeklyLaunchesPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Weekly Launches",
      url: `${SITE_CONFIG.url}/discover/weekly-launches`,
    },
  ])

  const { year, week } = getCurrentWeek()

  const initialItems = await getWeeklyLaunches({
    year,
    week,
    limit: HOMEPAGE_LIMITS.WEEKLY_LAUNCHES,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: "Weekly Developer Launches",
    description:
      "Developer tools and products launched this week, ranked by community votes.",
    url: `${SITE_CONFIG.url}/discover/weekly-launches`,
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
          heading="Weekly Launches"
          description="Browse developer tools and products launched each week. Select any week to see what the community built and voted for."
          aiPrompt={AI_PROMPTS.weeklyLaunches}
          variant="discover-weekly-launches"
          metrics={
            <div className={heroStatPill}>
              <CalendarDays className="size-3.5 text-indigo-500" />
              <span className="font-bold text-slate-900">By Week</span>
              <span className="text-slate-500">Community Votes</span>
            </div>
          }
        />

        <WeeklyLaunchesContent initialItems={initialItems as FeedItem[]} />
      </div>
    </>
  )
}

export default WeeklyLaunchesPage
