import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Rocket,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Globe,
  Hammer,
  Search,
  Zap,
  TrendingUp,
  Cpu,
  Flame,
  Scale,
} from "lucide-react"
import {
  getCachedProductsStats,
} from "@/db/queries/products/list"
import {
  getCachedToolsStats,
} from "@/db/queries/tools/list"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

export const metadata: Metadata = {
  title: `Product Launch Platform — Perpetual Discovery for Software & Tools (${new Date().getFullYear()})`,
  description:
    "Launch your SaaS, developer tool, or AI application on LaunchNests. Experience weekly launch momentum, permanent catalog indexing, Do-Follow SEO backlinks, and AI agent citations.",
  keywords: [
    "product launch platform",
    "where to launch product",
    "software launch platform",
    "saas launch platform",
    "dev tool launch",
    "launch indie product",
    "product launch directory 2026",
    "submit product launch",
    "best product launch sites",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/product-launch-platform`,
  },
  openGraph: {
    title: `Product Launch Platform — Perpetual Discovery for Software & Tools (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
    description:
      "A modern product launch platform pairing weekly launch momentum with permanent directory discovery, tech-stack graphs, and AI agent readiness.",
    url: `${SITE_CONFIG.url}/product-launch-platform`,
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Product Launch Platform | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Product Launch Platform (${new Date().getFullYear()})`,
    description:
      "Launch your SaaS, dev tool, or AI app on LaunchNests for permanent discovery.",
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const ProductLaunchPlatformPage = async () => {
  const currentYear = new Date().getFullYear()

  const [productStats, toolStats] = await Promise.all([
    getCachedProductsStats(),
    getCachedToolsStats(),
  ])

  const totalCatalogItems = productStats.totalCount + toolStats.totalCount

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Product Launch Platform",
      url: `${SITE_CONFIG.url}/product-launch-platform`,
    },
  ])

  const pageLd = {
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}/product-launch-platform#webpage`,
    url: `${SITE_CONFIG.url}/product-launch-platform`,
    name: `Product Launch Platform for Software & Dev Tools (${currentYear})`,
    description:
      "Modern product launch platform designed for continuous organic discovery, relational tech-stack graphs, and AI search engines.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
    },
  }

  const unifiedLd = buildEntityGraph([breadcrumbs, pageLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedLd) }}
      />

      <div className="flex min-h-screen flex-col bg-white">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-white px-6 py-3 text-xs font-medium text-slate-500 md:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li className="flex items-center gap-1">
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-1 hover:text-slate-900"
              >
                <ArrowLeft className="size-3" />
                Home
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <span
                className="font-semibold text-slate-900"
                aria-current="page"
              >
                Product Launch Platform
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Rocket className="size-4 text-blue-600" />
              <span>Modern Distribution Platform ({currentYear})</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              The Product Launch Platform Built for Compound Discovery
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Say goodbye to the stressful 24-hour voting sprint.{" "}
              <strong className="font-semibold text-slate-800">
                {SITE_CONFIG.name}
              </strong>{" "}
              pairs community launch cycles with a perpetual software directory,
              relational tech-stack graphs, and native integration for
              autonomous AI search engines like ChatGPT, Claude, and Perplexity.
            </p>

            {/* Live Metrics Row */}
            <div className="mt-2 flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-700">
              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Rocket className="mr-1.5 size-3.5 text-blue-600" />
                {totalCatalogItems}+ Launches Cataloged
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Hammer className="mr-1.5 size-3.5 text-emerald-600" />
                {toolStats.totalBuilds.toLocaleString()} Production Builds
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Clock className="mr-1.5 size-3.5 text-indigo-600" />
                12–24h Review Guarantee
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <ShieldCheck className="mr-1.5 size-3.5 text-amber-600" />
                Permanent Do-Follow Link Equity
              </Badge>
            </div>

            {/* CTA Group */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={ROUTES.SUBMIT} className={cn(buttonVariants({ variant: "default" }), "rounded-none bg-slate-900 text-white")}>
                  Launch Your Product Now
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              <Link href={ROUTES.DISCOVER_WEEKLY_LAUNCHES} className={cn(buttonVariants({ variant: "outline" }), "rounded-none")}>
                  View Weekly Launches
                </Link>
            </div>
          </div>
        </header>

        {/* The 4 Distribution Engines */}
        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-12 md:px-8">
          <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
              <Flame className="size-4 text-blue-600" />
              <span>How LaunchNests Distributes Your Product</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              Four Built-In Engines Working For Your Product 365 Days a Year
            </h2>
            <p className="max-w-2xl text-xs text-slate-600 sm:text-sm">
              Most launch sites stop working the moment your 24-hour launch day
              ends. LaunchNests activates four continuous distribution channels:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Rocket className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">
                1. Weekly Launch Cycles
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Products compete on community weekly momentum feeds, giving your
                launch 7 full days of prominent front-page visibility instead of
                just 24 hours.
              </p>
              <Link
                href={ROUTES.DISCOVER_WEEKLY_LAUNCHES}
                className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
              >
                Browse Weekly Launches →
              </Link>
            </div>

            <div className="flex flex-col rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Layers className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">
                2. Permanent Category Hubs
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Every launch is indexed into static, crawlable category pages
                ranking on Google for queries like "AI software", "developer
                tools", and "marketing APIs".
              </p>
              <Link
                href={ROUTES.PRODUCTS}
                className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
              >
                Explore Categories →
              </Link>
            </div>

            <div className="flex flex-col rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <Hammer className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">
                3. Relational 'Built With' Graph
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Tag your underlying tech stack. Your product appears on the
                showcase pages of every tool, database, and API powering your
                software.
              </p>
              <Link
                href={ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}
                className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
              >
                View Building Blocks →
              </Link>
            </div>

            <div className="flex flex-col rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
              <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                <Globe className="size-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-slate-900">
                4. AI Search & MCP Feeds
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">
                Native /llms.txt indices, raw Markdown endpoints, and a live MCP
                server allow coding agents and LLMs to recommend your product in
                AI chats.
              </p>
              <a
                href="/llms.txt"
                className="mt-4 text-xs font-semibold text-blue-600 hover:underline"
              >
                Inspect /llms.txt Feed →
              </a>
            </div>
          </div>
        </section>

        {/* The 2026 Product Launch Blueprint */}
        <main className="flex-1 px-6 py-12 md:px-8">
          <div className="flex flex-col gap-12">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <CheckCircle2 className="size-4 text-blue-600" />
                <span>The Founder Execution Blueprint</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                The 3-Phase Guide to a Successful Product Launch in 2026
              </h2>
              <p className="mt-1 max-w-2xl text-xs text-slate-600 sm:text-sm">
                Follow this battle-tested playbook to transform your product
                launch from a one-day spike into a durable customer acquisition
                funnel:
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="text-xs font-bold text-blue-600 uppercase">
                    Phase 1: Pre-Launch Readiness
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    Foundation & Technical Indexing
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    <li>
                      • Submit your product to LaunchNests 1–2 weeks early to
                      establish Google indexing.
                    </li>
                    <li>
                      • Tag your tech stack to automatically unlock verified
                      'Built With' links.
                    </li>
                    <li>
                      • Verify your Open Graph images and high-converting
                      tagline.
                    </li>
                    <li>
                      • Set up analytics to attribute referral traffic and sign-up
                      conversion rates.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="text-xs font-bold text-emerald-600 uppercase">
                    Phase 2: Launch Week Momentum
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    Community Amplification
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    <li>
                      • Share your LaunchNests profile link across Twitter,
                      LinkedIn, and your newsletter.
                    </li>
                    <li>
                      • Engage with early community comments and respond to
                      feedback constructively.
                    </li>
                    <li>
                      • Coordinate secondary launches on niche dev subreddits and
                      Hacker News Show HN.
                    </li>
                    <li>
                      • Embed the LaunchNests badge on your landing page to
                      drive social proof.
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="text-xs font-bold text-purple-600 uppercase">
                    Phase 3: Evergreen Growth
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    Compounding SEO & AI Traffic
                  </h3>
                  <ul className="mt-3 space-y-2 text-xs text-slate-600">
                    <li>
                      • Benefit from permanent category ranking without monthly
                      expiration fees.
                    </li>
                    <li>
                      • Accumulate natural inbound backlinks passing root domain
                      authority.
                    </li>
                    <li>
                      • AI assistants (Cursor, ChatGPT) cite your product
                      through /llms.txt.
                    </li>
                    <li>
                      • Submit major feature updates to trigger re-surfacing in
                      trending feeds.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Launchpad Comparison Matrix */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <Scale className="size-4 text-blue-600" />
                  <span>Platform Feature Comparison</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  LaunchNests vs Traditional Launch Platforms
                </h3>

                <div className="mt-2 overflow-x-auto rounded-lg border border-dashed border-border bg-white shadow-2xs">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                      <tr>
                        <th className="px-4 py-3">Feature</th>
                        <th className="px-4 py-3">LaunchNests</th>
                        <th className="px-4 py-3">Product Hunt</th>
                        <th className="px-4 py-3">DevHunt</th>
                        <th className="px-4 py-3">Uneed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-600">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          Launch Window
                        </td>
                        <td className="px-4 py-3 font-bold text-blue-600">
                          Weekly + Perpetual
                        </td>
                        <td className="px-4 py-3">24 Hours</td>
                        <td className="px-4 py-3">24 Hours</td>
                        <td className="px-4 py-3">Rolling daily/monthly</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          Submission Review
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          12–24 Hours
                        </td>
                        <td className="px-4 py-3">Self-scheduled</td>
                        <td className="px-4 py-3">Community review</td>
                        <td className="px-4 py-3">30–150 day backlog</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          SEO Link Type
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          Permanent Do-Follow
                        </td>
                        <td className="px-4 py-3">Redirect (/r/)</td>
                        <td className="px-4 py-3">Profile Link</td>
                        <td className="px-4 py-3">Conditional (20+ votes)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          Tech Stack Graph
                        </td>
                        <td className="px-4 py-3 font-bold text-blue-600">
                          Yes ('Built With')
                        </td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          AI Engine Ingestion
                        </td>
                        <td className="px-4 py-3 font-bold text-blue-600">
                          /llms.txt + MCP
                        </td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* Platform FAQ */}
            <section className="border-t border-dashed border-border pt-8">
              <div className="mb-6 flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Frequently Asked Questions About Launching on LaunchNests
                </h3>
                <p className="text-xs text-slate-600">
                  Got questions about submission tiers, review timing, or launch
                  eligibility? Here are the answers:
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    Is LaunchNests free to launch on?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Yes. Core submissions for software products and developer
                    tools are 100% free with human review within 12–24 hours. We
                    also offer affordable one-time verification tiers ($15
                    Featured Builder / $19 Ecosystem Partner) for permanent
                    Do-Follow backlinks and featured placements.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    Can I launch both SaaS products and developer tools?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Yes. LaunchNests has dedicated pipelines for both. If you
                    are building an end-user SaaS, launch as a product. If you
                    are building an API, library, or database, launch as a tool
                    and developers can tag your tool in their builds.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    What makes LaunchNests different from 24-hour launch boards?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Traditional launch boards archive products after 24 hours.
                    LaunchNests keeps your product permanently indexed across
                    static category landing pages, alternative matrices, and
                    relational tech-stack showcases, driving continuous organic
                    traffic month after month.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    How does the weekly launch cycle work?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Approved products are grouped into weekly launch cohorts.
                    Throughout the week, community members discover, test,
                    upvote, and review your product. Top products earn coveted
                    podium badges and newsletter feature slots.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="rounded-2xl bg-slate-900 p-8 text-center text-white md:p-12">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                Ready to Launch Your Software on {SITE_CONFIG.name}?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300 sm:text-sm">
                Get discovered by software engineers, tech founders, and AI
                search engines. Submit your product in less than 3 minutes.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={ROUTES.SUBMIT}
                  className={cn(buttonVariants({ variant: "default" }), "rounded-none bg-blue-600 text-white hover:bg-blue-500")}
                >
                  Submit Your Product Free
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <Link
                  href={ROUTES.PRICING}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-none border-slate-700 bg-transparent text-white hover:bg-slate-800")}
                >
                  View Listing Options
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default ProductLaunchPlatformPage
