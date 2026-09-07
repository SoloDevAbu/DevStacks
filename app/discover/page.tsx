import type { Metadata } from "next"
import Link from "next/link"
import { Sparkles, Wrench, Package, Cpu, Clock, ArrowRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FeedList } from "@/components/shared/feed-list"
import { HoverOutline } from "@/components/shared/hover-outline"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { getNewAndRisingProducts } from "@/lib/rankings/new-and-rising"
import { AI_PROMPTS } from "@/lib/prompts"
import type { FeedItem } from "@/components/shared/feed-card"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Discover Developer Tools, Products & Building Blocks",
  description: `Explore curated discovery feeds of developer tools, software products, and popular building blocks on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover`,
  },
  openGraph: {
    title: `Discover Developer Tools & Products | ${SITE_CONFIG.name}`,
    description:
      "Explore curated discovery feeds of developer tools, software products, and popular building blocks.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Discover Developer Tools & Products | ${SITE_CONFIG.name}`,
    description:
      "Explore curated discovery feeds of developer tools, software products, and popular building blocks.",
  },
}

const DISCOVERY_CHANNELS = [
  {
    title: "New & Rising",
    href: ROUTES.DISCOVER_NEW_RISING,
    icon: Sparkles,
    badge: "7-Day Boost",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200",
    description:
      "Fresh developer tools and products submitted recently, receiving a 7-day algorithmic freshness boost.",
  },
  {
    title: "Rising Tools",
    href: ROUTES.DISCOVER_RISING_TOOLS,
    icon: Wrench,
    badge: "Developer Tools",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    description:
      "Infrastructure, APIs, databases, and developer libraries rapidly gaining community upvotes.",
  },
  {
    title: "Rising Products",
    href: ROUTES.DISCOVER_RISING_PRODUCTS,
    icon: Package,
    badge: "Apps & Software",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    description:
      "Developer-built applications, SaaS tools, and software products gaining traction.",
  },
  {
    title: "Popular Building Blocks",
    href: ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS,
    icon: Cpu,
    badge: "Tech Stacks",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
    description:
      "The foundational infrastructure and services developers choose most when launching products.",
  },
  {
    title: "Recently Added",
    href: ROUTES.DISCOVER_RECENTLY_ADDED,
    icon: Clock,
    badge: "Chronological",
    badgeColor: "bg-slate-100 text-slate-800 border-slate-200",
    description:
      "Every vetted developer tool and product in order of launch and community submission.",
  },
]

const DiscoverPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Discover", url: `${SITE_CONFIG.url}/discover` },
  ])

  const initialItems = await getNewAndRisingProducts({
    limit: 10,
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
          heading="🧭 Discovery Hub"
          description="Explore algorithmic feeds, rising developer infrastructure, and community tech stacks."
          aiPrompt={AI_PROMPTS.discover}
        />

        {/* Discovery Feed Channels Grid */}
        <div className="grid grid-cols-1 gap-4 border-b border-dashed border-border bg-white p-6 sm:grid-cols-2 lg:grid-cols-3 md:p-8">
          {DISCOVERY_CHANNELS.map((channel) => {
            const Icon = channel.icon
            return (
              <div key={channel.title} className="group relative flex">
                <Card className="flex w-full flex-col justify-between border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="outline" className={channel.badgeColor}>
                        {channel.badge}
                      </Badge>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {channel.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {channel.description}
                    </p>
                  </CardContent>

                  <div className="mt-4 pt-3 border-t border-dashed border-slate-100">
                    <Link
                      href={channel.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                    >
                      Explore feed <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </Card>
                <HoverOutline />
              </div>
            )
          })}
        </div>

        {/* Highlighted Fresh Feed */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-dashed border-border bg-white px-6 py-4 md:px-8">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Trending In Discovery
              </h2>
              <p className="text-xs text-slate-500">
                Top rated tools and products during their discovery window
              </p>
            </div>
            <Link
              href={ROUTES.DISCOVER_NEW_RISING}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
            >
              View all &rarr;
            </Link>
          </div>

          <FeedList
            items={(initialItems ?? []) as FeedItem[]}
            isLoading={false}
            showMedals={false}
            showTrendingBadge={true}
            emptyTitle="No discovery items found"
            emptyDescription="New submissions will appear here once approved by the community."
          />
        </div>
      </div>
    </>
  )
}

export default DiscoverPage
