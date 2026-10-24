import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Scale,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Rocket,
  Layers,
  ArrowRight,
  Globe,
  Hammer,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

export const metadata: Metadata = {
  title: `Best Product Hunt Alternatives for Software & Dev Tools (${new Date().getFullYear()})`,
  description:
    "Compare the top 6 Product Hunt alternatives in 2026: LaunchNests, DevHunt, Uneed, MicroLaunch, BetaList, and Hacker News. Compare launch mechanics, submission pricing, SEO backlinks, and audience fit.",
  keywords: [
    "Product Hunt alternatives",
    "best Product Hunt alternatives",
    "sites like Product Hunt",
    "where to launch software",
    "where to launch SaaS",
    "developer tool launch platforms",
    "product launch directories 2026",
    "Product Hunt competitors",
    "free product launch sites",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/producthunt-alternatives`,
  },
  openGraph: {
    title: `Best Product Hunt Alternatives for Software & Dev Tools (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
    description:
      "A comprehensive, objective guide comparing top product launch platforms and software directories in 2026.",
    url: `${SITE_CONFIG.url}/producthunt-alternatives`,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Product Hunt Alternatives Guide | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Best Product Hunt Alternatives (${new Date().getFullYear()})`,
    description:
      "Compare top launchpads for SaaS, dev tools, and indie products.",
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface PlatformOverview {
  name: string
  tagline: string
  website: string
  bestFor: string
  pricing: string
  dynamics: string
  backlinkType: string
  aiReadiness: string
  dedicatedComparisonUrl?: string
  pros: string[]
  cons: string[]
}

const PLATFORMS: PlatformOverview[] = [
  {
    name: "LaunchNests",
    tagline: "Developer Tools, Software Stacks & AI Discovery",
    website: "https://www.launchnests.com",
    bestFor: "Software engineers, devtool creators, indie SaaS & AI builders",
    pricing: "Free core listings (12–24h review) or $15 verified tier",
    dynamics: "Perpetual indexed catalog + Weekly momentum feeds",
    backlinkType: "Permanent Do-Follow on verified tiers",
    aiReadiness: "Native /llms.txt, Markdown twins & MCP server",
    dedicatedComparisonUrl: undefined,
    pros: [
      "Two-way 'Built With' relational tech stack graph",
      "Perpetual category discovery that never expires after 24 hours",
      "Native AI engine readiness for Claude, Cursor, and ChatGPT",
      "Fair, transparent pricing with rapid human moderation",
    ],
    cons: [
      "Younger domain compared to decade-old legacy platforms",
      "Focused specifically on developer and technical SaaS ecosystems",
    ],
  },
  {
    name: "Product Hunt",
    tagline: "The best new products in tech",
    website: "https://www.producthunt.com",
    bestFor: "Broad consumer tech, venture-backed startups & viral launches",
    pricing: "Free submissions; high-tier ads ($5k–$10k+)",
    dynamics: "24-hour daily voting sprint",
    backlinkType: "Tracking redirect (/r/) with rel='nofollow'",
    aiReadiness: "Standard HTML only",
    dedicatedComparisonUrl: ROUTES.PRODUCTHUNT_ALTERNATIVE,
    pros: [
      "Massive existing tech enthusiast, VC, and press audience",
      "High viral spike potential on launch day",
      "Recognized industry winner badges",
    ],
    cons: [
      "Discovery falls off sharply after the 24-hour voting cycle",
      "Strict 6-month cooldown between launches",
      "No relational mapping between products and developer tools",
    ],
  },
  {
    name: "DevHunt",
    tagline: "The launchpad for dev tools, built by developers",
    website: "https://devhunt.org",
    bestFor: "Developer utilities, open-source libraries & technical APIs",
    pricing: "Free community queue; optional featured promotions",
    dynamics: "24-hour daily developer launch leaderboard",
    backlinkType: "Profile links with community voting",
    aiReadiness: "Standard HTML only",
    dedicatedComparisonUrl: ROUTES.DEVHUNT_ALTERNATIVE,
    pros: [
      "100% technical software engineer audience",
      "Open-source codebase and developer-first community",
      "Technical code feedback and GitHub issue submissions",
    ],
    cons: [
      "Front-loaded 24-hour lifecycle with rapid post-launch dropoff",
      "No 'Built With' graph connecting tools to live applications",
      "Does not catalog general SaaS products",
    ],
  },
  {
    name: "Uneed",
    tagline: "The best tools on the internet",
    website: "https://www.uneed.best",
    bestFor: "Indie hackers, solopreneurs & micro-SaaS tools",
    pricing: "Free queue (multi-month wait) or $15–$30 fast-track",
    dynamics: "Rolling 24-hour to monthly sliding time windows",
    backlinkType: "Do-follow if meeting 20+ launch-day upvotes",
    aiReadiness: "Standard HTML only",
    dedicatedComparisonUrl: ROUTES.UNEED_ALTERNATIVE,
    pros: [
      "Engaged indie hacker community and founder social feed",
      "Weekly newsletter with 26k+ subscribers",
      "Clean UI with voting badges",
    ],
    cons: [
      "Free queue requires waiting 30 to 150 days",
      "Requires 10–20 upvotes on launch day to retain listing/links",
      "Weighted voting (+3 boost) for paid subscribers",
    ],
  },
  {
    name: "MicroLaunch",
    tagline: "Monthly launch competition for indie founders",
    website: "https://microlaunch.net",
    bestFor: "Bootstrapped micro-SaaS and early stage indie software",
    pricing: "Free monthly queue or $19–$49 fast-track",
    dynamics: "30-day monthly competition format",
    backlinkType: "Profile link",
    aiReadiness: "Standard HTML only",
    dedicatedComparisonUrl: ROUTES.MICROLAUNCH_ALTERNATIVE,
    pros: [
      "Longer 30-day monthly window gives products more breathing room",
      "Supportive indie maker community",
      "Featured newsletter inclusion options",
    ],
    cons: [
      "Smaller total audience volume compared to Product Hunt",
      "Monthly reset still archives products into historical lists",
    ],
  },
  {
    name: "BetaList",
    tagline: "Discover tomorrow's startups, today",
    website: "https://betalist.com",
    bestFor: "Pre-launch startups, private betas & waiting lists",
    pricing: "Free queue (up to 2 months) or $129+ fast-track",
    dynamics: "Chronological daily newsletter & directory feed",
    backlinkType: "Editorial profile link",
    aiReadiness: "Standard HTML only",
    dedicatedComparisonUrl: ROUTES.BETALIST_ALTERNATIVE,
    pros: [
      "Pioneer platform dedicated specifically to pre-launch beta feedback",
      "Established subscriber base of early tech adopters",
    ],
    cons: [
      "Requires products to be pre-launch or in private beta",
      "High fast-track pricing ($129+) with lengthy free backlog",
      "No interactive voting or community discussion threads",
    ],
  },
]

const ProductHuntAlternativesPage = () => {
  const currentYear = new Date().getFullYear()

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Product Hunt Alternatives",
      url: `${SITE_CONFIG.url}/producthunt-alternatives`,
    },
  ])

  const collectionLd = collectionPageSchema({
    name: `Best Product Hunt Alternatives for Software & Dev Tools (${currentYear})`,
    description:
      "A comprehensive comparison of the top 6 product launch platforms and SaaS directories for makers in 2026.",
    url: `${SITE_CONFIG.url}/producthunt-alternatives`,
    items: PLATFORMS.map((p) => ({
      name: p.name,
      url: p.website,
      description: `${p.tagline} — Best for: ${p.bestFor}`,
    })),
  })

  const unifiedLd = buildEntityGraph([breadcrumbs, collectionLd])

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
                Product Hunt Alternatives
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Scale className="size-4 text-blue-600" />
              <span>Launch Platform Guide ({currentYear})</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
              The Best Product Hunt Alternatives for Software & Dev Tools
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              While Product Hunt remains the tech industry's largest 24-hour
              launch event, many founders now experience diminishing returns
              from the 24-hour sprint. Between intense competition from
              venture-backed startups, temporary traffic spikes, and strict
              anti-spam algorithms, modern makers are diversifying across
              platforms offering{" "}
              <strong className="font-semibold text-slate-800">
                perpetual directory discovery
              </strong>
              ,{" "}
              <strong className="font-semibold text-slate-800">
                developer tech-stack graphs
              </strong>
              , and{" "}
              <strong className="font-semibold text-slate-800">
                permanent SEO backlinks
              </strong>
              .
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>Last updated: October {currentYear}</span>
              <span>•</span>
              <span>6 platforms evaluated</span>
              <span>•</span>
              <span>Objective, research-backed criteria</span>
            </div>
          </div>
        </header>

        {/* Comparison Matrix Table */}
        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-8 md:px-8">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-base font-bold text-slate-900 sm:text-xl">
              Quick Comparison: Top Product Hunt Alternatives at a Glance
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Side-by-side evaluation of target audiences, launch mechanics,
              submission pricing, and SEO link equity.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-dashed border-border bg-white shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Best Suited For</th>
                  <th className="px-4 py-3">Submission Cost</th>
                  <th className="px-4 py-3">Launch Dynamics</th>
                  <th className="px-4 py-3">SEO Backlink</th>
                  <th className="px-4 py-3">AI Readiness</th>
                  <th className="px-4 py-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-600">
                {PLATFORMS.map((platform) => {
                  const isLaunchNests = platform.name === "LaunchNests"
                  return (
                    <tr
                      key={platform.name}
                      className={
                        isLaunchNests
                          ? "bg-blue-50/40 font-medium"
                          : "hover:bg-slate-50/60"
                      }
                    >
                      <td className="px-4 py-3.5 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{platform.name}</span>
                          {isLaunchNests && (
                            <Badge
                              variant="secondary"
                              className="bg-blue-100 text-[10px] text-blue-800"
                            >
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {platform.bestFor}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-slate-800">
                        {platform.pricing}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {platform.dynamics}
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {platform.backlinkType.includes("Do-Follow") ? (
                          <span className="font-semibold text-emerald-600">
                            {platform.backlinkType}
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {platform.backlinkType}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        {platform.aiReadiness}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {platform.dedicatedComparisonUrl ? (
                          <Link
                            href={platform.dedicatedComparisonUrl}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Vs Guide →
                          </Link>
                        ) : isLaunchNests ? (
                          <Link
                            href={ROUTES.SUBMIT}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Submit Free
                          </Link>
                        ) : (
                          <a
                            href={platform.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-slate-500 hover:underline"
                          >
                            Site ↗
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Platform Breakdowns */}
        <main className="flex-1 px-6 py-10 md:px-8">
          <div className="flex flex-col gap-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Rocket className="size-4 text-blue-600" />
                <span>Deep Dive Profiles</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Detailed Breakdown of the Top 6 Launch Platforms
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.name}
                  className="flex flex-col justify-between rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {platform.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {platform.tagline}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {platform.pricing.split(";")[0]}
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong className="text-slate-800">Best for:</strong>{" "}
                      {platform.bestFor}
                    </p>

                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-800">
                        Key Strengths:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {platform.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-col gap-2 pt-1">
                      <span className="text-xs font-semibold text-slate-800">
                        Considerations:
                      </span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {platform.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <XCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-dashed border-slate-100 pt-4 text-xs">
                    {platform.dedicatedComparisonUrl ? (
                      <Link
                        href={platform.dedicatedComparisonUrl}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Read Full {platform.name} vs LaunchNests Guide →
                      </Link>
                    ) : platform.name === "LaunchNests" ? (
                      <Link
                        href={ROUTES.SUBMIT}
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Launch on LaunchNests Today →
                      </Link>
                    ) : (
                      <a
                        href={platform.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:underline"
                      >
                        Visit {platform.name} ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Strategic Guide Section */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
                  <Layers className="size-4 text-blue-600" />
                  <span>The Strategic Founder Playbook</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  How Modern Founders Coordinate Multi-Platform Launch Campaigns
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Smart builders don't rely on a single launch day. The most
                  effective distribution strategy sequences your launches across
                  multiple platforms to achieve early indexing, peer validation,
                  and permanent inbound traffic:
                </p>

                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Stage 1: Pre-Launch & Indexing
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      BetaList + LaunchNests
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Submit to BetaList for initial beta signups and list on
                      LaunchNests to establish permanent canonical category
                      ranking, Do-Follow link equity, and /llms.txt AI ingestion.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Stage 2: Community Launch Day
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      DevHunt + Product Hunt
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Schedule your public launch day to rally your network,
                      collect code feedback on DevHunt, and aim for a top spot
                      on Product Hunt for immediate social proof.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Stage 3: Compound Evergreen Growth
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      LaunchNests 'Built With' Graph
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Tag the dev tools and APIs powering your app on
                      LaunchNests. As other makers search for tools in your
                      stack, your product is surfaced in perpetuity.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* In-depth Comparison Links Hub */}
            <section className="border-t border-dashed border-border pt-8">
              <h3 className="mb-3 text-sm font-bold text-slate-900 sm:text-base">
                Explore Dedicated Competitor & Platform Comparisons
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                <Link
                  href={ROUTES.PRODUCTHUNT_ALTERNATIVE}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>LaunchNests vs Product Hunt</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href={ROUTES.DEVHUNT_ALTERNATIVE}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>LaunchNests vs DevHunt</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href={ROUTES.CODEHYPE_ALTERNATIVE}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>LaunchNests vs CodeHype</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href={ROUTES.UNEED_ALTERNATIVE}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>LaunchNests vs Uneed</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href={ROUTES.MICROLAUNCH_ALTERNATIVE}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>LaunchNests vs MicroLaunch</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
                <Link
                  href={ROUTES.BETALIST_ALTERNATIVE}
                  className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                >
                  <span>LaunchNests vs BetaList</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default ProductHuntAlternativesPage
