import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cache } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { LaunchWeekList } from "@/components/shared/launch-week-list"
import { LaunchWeekNav } from "@/components/launches/launch-week-nav"
import { UpdatedTime } from "@/components/shared/updated-time"
import type { FeedItem } from "@/components/shared/feed-card"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { getLaunchWeekSnapshot } from "@/lib/launches/launch-week"
import { getCachedLaunchWeekSummaries } from "@/lib/launches/launch-archive"
import { parseLaunchWeekParams } from "@/lib/launches/launch-week-params"
import { formatLaunchWeekHeading } from "@/lib/seo/markdown-twins"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"
import { getListingPath, toAbsoluteUrl } from "@/utils/urls"

export const revalidate = 86400

interface LaunchWeekPageProps {
  params: Promise<{ year: string; week: string }>
}

const loadLaunchWeek = cache(async (rawYear: string, rawWeek: string) => {
  const params = parseLaunchWeekParams(rawYear, rawWeek)
  if (!params) return null
  const snapshot = await getLaunchWeekSnapshot(params.year, params.week)
  return snapshot.items.length > 0 ? snapshot : null
})

export const generateMetadata = async ({
  params,
}: LaunchWeekPageProps): Promise<Metadata> => {
  const { year, week } = await params
  const snapshot = await loadLaunchWeek(year, week)
  if (!snapshot) return { robots: { index: false, follow: true } }

  const canonical = toAbsoluteUrl(ROUTES.LAUNCH_WEEK(snapshot.year, snapshot.week))
  const title = `${snapshot.weekLabel}, ${snapshot.year} Launches: New Products & Dev Tools`
  const description = `${snapshot.items.length} products and developer tools launched on ${SITE_CONFIG.name} in ${snapshot.weekLabel} of ${snapshot.year} (${snapshot.dateRange}), ranked by community votes.`

  return {
    title,
    description,
    alternates: {
      canonical,
      types: {
        "text/markdown": toAbsoluteUrl(
          ROUTES.LAUNCH_WEEK_MARKDOWN(snapshot.year, snapshot.week)
        ),
      },
    },
    openGraph: { title, description, url: canonical, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}

const LaunchWeekPage = async ({ params }: LaunchWeekPageProps) => {
  const { year, week } = await params
  const [snapshot, summaries] = await Promise.all([
    loadLaunchWeek(year, week),
    getCachedLaunchWeekSummaries(),
  ])
  if (!snapshot) notFound()

  const position = summaries.findIndex(
    (summary) => summary.year === snapshot.year && summary.week === snapshot.week
  )
  const next = position > 0 ? summaries[position - 1] : undefined
  const previous = position >= 0 ? summaries[position + 1] : undefined

  const pageUrl = toAbsoluteUrl(ROUTES.LAUNCH_WEEK(snapshot.year, snapshot.week))
  const heading = formatLaunchWeekHeading(snapshot)
  const items = snapshot.items as FeedItem[]

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      {
        name: "Weekly Launches",
        url: toAbsoluteUrl(ROUTES.DISCOVER_WEEKLY_LAUNCHES),
      },
      { name: heading, url: pageUrl },
    ]),
    collectionPageSchema({
      name: `Product & developer tool launches — ${heading}`,
      description: `Products and developer tools launched on ${SITE_CONFIG.name} in ${heading}, ranked by community votes.`,
      url: pageUrl,
      dateModified: snapshot.lastUpdated,
      items: items.map((item) => ({
        name: item.name,
        url: toAbsoluteUrl(getListingPath(item)),
        description: item.tagline,
      })),
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading={`Product & Dev Tool Launches — ${heading}`}
          description={`${items.length} products and developer tools launched on ${SITE_CONFIG.name} between ${snapshot.dateRange}, ${snapshot.year}, ranked by community votes.`}
          aiPrompt={AI_PROMPTS.weeklyLaunches}
          variant="discover-weekly-launches"
          metrics={
            <p className="text-xs text-slate-500">
              <UpdatedTime date={snapshot.lastUpdated} />
            </p>
          }
        />
        <LaunchWeekNav previous={previous} next={next} />
        <LaunchWeekList items={items} />
      </div>
    </>
  )
}

export default LaunchWeekPage
