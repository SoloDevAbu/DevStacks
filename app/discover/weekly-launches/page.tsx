import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SectionHeader } from "@/components/shared/section-header"
import { LaunchWeekList } from "@/components/shared/launch-week-list"
import { LaunchWeekArchive } from "@/components/launches/launch-week-archive"
import type { FeedItem } from "@/components/shared/feed-card"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { heroStatPill, sectionHeaderCtaButton } from "@/utils/styles"
import { getCurrentLaunchWeekSnapshot } from "@/lib/launches/launch-week"
import { getCachedLaunchWeekSummaries } from "@/lib/launches/launch-archive"
import { formatLaunchWeekHeading } from "@/lib/seo/markdown-twins"
import { AI_PROMPTS } from "@/lib/prompts"
import { toAbsoluteUrl } from "@/utils/urls"
import { formatWeekTitle } from "@/utils/iso-weeks"

export const revalidate = 3600

const PAGE_TITLE = "Weekly Product & Dev Tool Launches"
const PAGE_DESCRIPTION = `Every product and developer tool launched on ${SITE_CONFIG.name}, grouped by week and ranked by community votes. See this week's launches and browse every past week.`
const PAGE_URL = toAbsoluteUrl(ROUTES.DISCOVER_WEEKLY_LAUNCHES)

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${PAGE_TITLE} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTION,
    type: "website",
    url: PAGE_URL,
    siteName: SITE_CONFIG.name,
    images: [{ url: SITE_CONFIG.ogImageUrl, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${PAGE_TITLE} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTION,
    images: [SITE_CONFIG.ogImageUrl],
  },
}

const WeeklyLaunchesPage = async () => {
  const [launchWeek, summaries] = await Promise.all([
    getCurrentLaunchWeekSnapshot(),
    getCachedLaunchWeekSummaries(),
  ])
  const items = launchWeek.items as FeedItem[]
  const currentWeekUrl = ROUTES.LAUNCH_WEEK(launchWeek.year, launchWeek.week)

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Weekly Launches", url: PAGE_URL },
    ]),
    collectionPageSchema({
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      dateModified: launchWeek.lastUpdated,
      items: summaries.map(({ year, week, count }) => ({
        name: formatWeekTitle(year, week),
        url: toAbsoluteUrl(ROUTES.LAUNCH_WEEK(year, week)),
        description: `${count} launches`,
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
          heading={PAGE_TITLE}
          description={PAGE_DESCRIPTION}
          aiPrompt={AI_PROMPTS.weeklyLaunches}
          variant="discover-weekly-launches"
          metrics={
            <div className={heroStatPill}>
              <CalendarDays className="size-3.5 text-indigo-500" />
              <span className="font-bold text-slate-900">
                {summaries.length} weeks
              </span>
              <span className="text-slate-500">of launches</span>
            </div>
          }
        />

        <section aria-label="This week's launches" className="flex flex-col">
          <SectionHeader
            title={`This Week's Launches — ${formatLaunchWeekHeading(launchWeek)}`}
            subtitle={`${items.length} launches so far, ranked by community votes`}
            action={
              <Link href={currentWeekUrl} className={sectionHeaderCtaButton}>
                Week page
              </Link>
            }
          />
          <LaunchWeekList items={items} />
        </section>

        <LaunchWeekArchive summaries={summaries} />
      </div>
    </>
  )
}

export default WeeklyLaunchesPage
