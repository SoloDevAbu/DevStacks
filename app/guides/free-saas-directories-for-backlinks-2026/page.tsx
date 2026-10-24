import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Layers,
  ArrowRight,
  Clock,
  Award,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 86400

export const metadata: Metadata = {
  title: `25+ Best Free SaaS Directories for Backlinks & Traffic (${new Date().getFullYear()} Guide)`,
  description:
    "The definitive 2026 guide to free SaaS directories for high-authority backlinks, referral traffic, and SEO domain growth. Evaluated by domain authority, submission cost, link type, and review turnaround.",
  keywords: [
    "free saas directories for backlinks",
    "saas directories list 2026",
    "submit saas for backlinks",
    "best directories to submit startup",
    "high da saas directories",
    "dofollow saas directories",
    "where to submit my saas",
    "saas backlink strategy",
    "free startup directories",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/guides/free-saas-directories-for-backlinks-2026`,
  },
  openGraph: {
    title: `25+ Best Free SaaS Directories for Backlinks & Traffic (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
    description:
      "Vetted, research-backed directory list for SaaS founders seeking permanent Do-Follow backlinks and early qualified users in 2026.",
    url: `${SITE_CONFIG.url}/guides/free-saas-directories-for-backlinks-2026`,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Free SaaS Directories Guide | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `25+ Best Free SaaS Directories for Backlinks (${new Date().getFullYear()})`,
    description:
      "Vetted guide to SaaS directories for high-authority backlinks and traffic.",
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface DirectoryEntry {
  name: string
  url: string
  daEstimate: string
  linkType: string
  cost: string
  reviewTime: string
  bestFor: string
  highlight?: boolean
}

const DIRECTORIES: DirectoryEntry[] = [
  {
    name: "LaunchNests",
    url: "https://www.launchnests.com",
    daEstimate: "DA 30+ (Fast Growth)",
    linkType: "Do-Follow (Verified)",
    cost: "Free core / $15 verified",
    reviewTime: "12–24 Hours",
    bestFor: "Software, Developer Tools, AI apps & tech stacks",
    highlight: true,
  },
  {
    name: "Product Hunt",
    url: "https://www.producthunt.com",
    daEstimate: "DA 91",
    linkType: "No-Follow / Redirect",
    cost: "Free",
    reviewTime: "Self-scheduled",
    bestFor: "24-hour viral launch spikes & venture startups",
  },
  {
    name: "DevHunt",
    url: "https://devhunt.org",
    daEstimate: "DA 45",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "24–48 Hours",
    bestFor: "Open-source tools, developer utilities & APIs",
  },
  {
    name: "BetaList",
    url: "https://betalist.com",
    daEstimate: "DA 70",
    linkType: "Do-Follow",
    cost: "Free (long wait) / $129 fast-track",
    reviewTime: "30–60 Days",
    bestFor: "Pre-launch startups & private beta signups",
  },
  {
    name: "Uneed",
    url: "https://www.uneed.best",
    daEstimate: "DA 52",
    linkType: "Do-Follow (20+ votes)",
    cost: "Free (waitlist) / $15 fast-track",
    reviewTime: "30–90 Days",
    bestFor: "Indie hackers, solopreneurs & micro-SaaS",
  },
  {
    name: "MicroLaunch",
    url: "https://microlaunch.net",
    daEstimate: "DA 41",
    linkType: "Do-Follow",
    cost: "Free / $19 fast-track",
    reviewTime: "Monthly cycles",
    bestFor: "Monthly competition for bootstrapped builders",
  },
  {
    name: "AlternativeTo",
    url: "https://alternativeto.net",
    daEstimate: "DA 82",
    linkType: "No-Follow",
    cost: "Free",
    reviewTime: "3–7 Days",
    bestFor: "Software comparisons against legacy incumbents",
  },
  {
    name: "SaaSHub",
    url: "https://www.saashub.com",
    daEstimate: "DA 68",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "1–3 Days",
    bestFor: "SaaS alternatives & software category indexing",
  },
  {
    name: "G2",
    url: "https://www.g2.com",
    daEstimate: "DA 90",
    linkType: "No-Follow / Redirect",
    cost: "Free basic listing",
    reviewTime: "2–5 Days",
    bestFor: "B2B enterprise validation & buyer reviews",
  },
  {
    name: "Capterra",
    url: "https://www.capterra.com",
    daEstimate: "DA 89",
    linkType: "No-Follow / Redirect",
    cost: "Free basic listing",
    reviewTime: "3–7 Days",
    bestFor: "Business software reviews & Gartner presence",
  },
  {
    name: "SourceForge",
    url: "https://sourceforge.net",
    daEstimate: "DA 93",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "Instant to 24h",
    bestFor: "Open source software, desktop apps & developer tooling",
  },
  {
    name: "Indie Hackers Product Directory",
    url: "https://www.indiehackers.com/products",
    daEstimate: "DA 84",
    linkType: "No-Follow",
    cost: "Free",
    reviewTime: "Instant",
    bestFor: "Community validation, revenue sharing & maker feedback",
  },
  {
    name: "PitchWall",
    url: "https://pitchwall.co",
    daEstimate: "DA 42",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "24–48 Hours",
    bestFor: "Startup pitching, early adopter traction & founder feedback",
  },
  {
    name: "StartupBase",
    url: "https://startupbase.io",
    daEstimate: "DA 46",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "3–5 Days",
    bestFor: "Early stage tech startups & founder profiles",
  },
  {
    name: "Launching Next",
    url: "https://www.launchingnext.com",
    daEstimate: "DA 51",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "7–14 Days",
    bestFor: "Trending startups & daily newsletter distribution",
  },
  {
    name: "StartupBuffer",
    url: "https://startupbuffer.com",
    daEstimate: "DA 44",
    linkType: "Do-Follow",
    cost: "Free / $10 premium",
    reviewTime: "5–10 Days",
    bestFor: "Early stage startup discovery and social promotion",
  },
  {
    name: "Software Suggest",
    url: "https://www.softwaresuggest.com",
    daEstimate: "DA 64",
    linkType: "Do-Follow",
    cost: "Free basic",
    reviewTime: "3–7 Days",
    bestFor: "B2B SaaS software evaluation across global markets",
  },
  {
    name: "Trustpilot",
    url: "https://www.trustpilot.com",
    daEstimate: "DA 94",
    linkType: "No-Follow",
    cost: "Free profile",
    reviewTime: "Instant",
    bestFor: "Consumer trust signals and verified customer reviews",
  },
  {
    name: "F6S",
    url: "https://www.f6s.com",
    daEstimate: "DA 82",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "Instant",
    bestFor: "Startup accelerator applications, grants & founder networks",
  },
  {
    name: "CrazyAboutStartups",
    url: "https://crazyaboutstartups.com",
    daEstimate: "DA 38",
    linkType: "Do-Follow",
    cost: "Free",
    reviewTime: "2–4 Days",
    bestFor: "Entrepreneurial articles and innovative startup showcases",
  },
]

const SaasDirectoriesGuidePage = () => {
  const currentYear = new Date().getFullYear()

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Guides",
      url: `${SITE_CONFIG.url}/guides/free-saas-directories-for-backlinks-2026`,
    },
    {
      name: "Free SaaS Directories for Backlinks",
      url: `${SITE_CONFIG.url}/guides/free-saas-directories-for-backlinks-2026`,
    },
  ])

  const articleLd = {
    "@type": "Article",
    "@id": `${SITE_CONFIG.url}/guides/free-saas-directories-for-backlinks-2026#article`,
    headline: `25+ Best Free SaaS Directories for Backlinks & Traffic (${currentYear} Guide)`,
    description:
      "The definitive research-backed directory submission guide for SaaS founders seeking permanent Do-Follow backlinks and early referral traction.",
    datePublished: "2026-01-15T00:00:00Z",
    dateModified: "2026-10-24T00:00:00Z",
    author: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  }

  const unifiedLd = buildEntityGraph([breadcrumbs, articleLd])

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
            <li className="flex items-center text-slate-500">Guides</li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <span
                className="font-semibold text-slate-900"
                aria-current="page"
              >
                Free SaaS Directories for Backlinks
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <BookOpen className="size-4 text-blue-600" />
              <span>Founder Distribution & SEO Blueprint ({currentYear})</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              25+ Best Free SaaS Directories for Backlinks & Organic Traffic
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Building a great software product is only 20% of the battle; 80%
              is distribution. For early-stage SaaS founders, submitting to
              high-quality software directories remains one of the most
              cost-effective ways to acquire initial root domain authority,
              indexable{" "}
              <strong className="font-semibold text-slate-800">
                Do-Follow backlinks
              </strong>
              , and early qualified customer signups.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-slate-400" />
                12 min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Verified for October {currentYear}
              </span>
              <span>•</span>
              <span>20+ active directories evaluated</span>
            </div>
          </div>
        </header>

        {/* Directory Master Matrix */}
        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-10 md:px-8">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
              Master Table: Top Vetted SaaS Directories for {currentYear}
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Sorted by platform category, backlink equity, and submission
              review speed.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-dashed border-border bg-white shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Directory</th>
                  <th className="px-4 py-3">Estimated DA</th>
                  <th className="px-4 py-3">Backlink Type</th>
                  <th className="px-4 py-3">Submission Cost</th>
                  <th className="px-4 py-3">Review Speed</th>
                  <th className="px-4 py-3">Best Suited For</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-600">
                {DIRECTORIES.map((dir) => (
                  <tr
                    key={dir.name}
                    className={
                      dir.highlight
                        ? "bg-blue-50/50 font-medium"
                        : "hover:bg-slate-50/60"
                    }
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{dir.name}</span>
                        {dir.highlight && (
                          <Badge
                            variant="secondary"
                            className="bg-blue-100 text-[10px] text-blue-800"
                          >
                            Top Pick
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">
                      {dir.daEstimate}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {dir.linkType.includes("Do-Follow") ? (
                        <span className="font-semibold text-emerald-600">
                          {dir.linkType}
                        </span>
                      ) : (
                        <span className="text-slate-500">{dir.linkType}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">
                      {dir.cost}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {dir.reviewTime}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {dir.bestFor}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {dir.name === "LaunchNests" ? (
                        <Link
                          href={ROUTES.SUBMIT_PRODUCT}
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Submit Free →
                        </Link>
                      ) : (
                        <a
                          href={dir.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-slate-500 hover:text-slate-900 hover:underline"
                        >
                          Visit ↗
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Strategic Guide Content */}
        <main className="flex-1 px-6 py-12 md:px-8">
          <div className="flex flex-col gap-12">
            {/* Tier Breakdown */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Layers className="size-4 text-blue-600" />
                <span>Strategic Tier Categorization</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Understanding the 4 Different Types of Software Directories
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Not all directories serve the same purpose. A balanced launch
                strategy combines fast-indexing modern catalogs, enterprise
                review sites, and community launch boards:
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                    <Sparkles className="size-4 text-blue-600" />
                    <span>Tier 1: Modern Fast-Indexing Catalogs</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    LaunchNests, DevHunt & MicroLaunch
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Modern platforms built with fast review turnarounds, clean
                    Do-Follow link architecture, and native AI engine readiness
                    (/llms.txt). On LaunchNests, you also gain two-way 'Built
                    With' mapping linking your product to developer building
                    blocks.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slate-800">
                    Primary Value: Fast Google indexing, permanent SEO link
                    equity, and tech-stack discovery.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                    <TrendingUp className="size-4 text-emerald-600" />
                    <span>Tier 2: 24-Hour Viral Launchboards</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    Product Hunt & Uneed
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    High-competition daily voting competitions designed for
                    rapid viral visibility. While Product Hunt uses tracking
                    redirects rather than direct Do-Follow links, a top-5 finish
                    can drive thousands of launch-day visitors and valuable
                    secondary press coverage.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slate-800">
                    Primary Value: Immediate launch-day traffic spike, investor
                    eyes, and social proof badges.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 uppercase">
                    <ShieldCheck className="size-4 text-indigo-600" />
                    <span>Tier 3: Enterprise Review Portals</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    G2, Capterra & SourceForge
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Authoritative B2B review portals dominating commercial
                    search queries. While they generally do not provide direct
                    Do-Follow links on free tiers, having an active profile with
                    5–10 customer reviews dramatically improves sales conversion
                    rates for enterprise buyers.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slate-800">
                    Primary Value: High-ticket buyer trust, brand validation,
                    and third-party review widgets.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
                    <Award className="size-4 text-amber-600" />
                    <span>Tier 4: Pre-Launch & Maker Communities</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    BetaList & Indie Hackers
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Dedicated platforms for early beta testing, waiting lists,
                    and founder collaboration. BetaList connects you with early
                    adopters willing to tolerate unfinished UI in exchange for
                    early access.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-slate-800">
                    Primary Value: Private beta testers, initial feedback loops,
                    and founder community support.
                  </p>
                </div>
              </div>
            </div>

            {/* The 5 Golden Rules of Directory Submissions */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Tactical SEO Advice</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  The 5 Golden Rules of Directory Link Building for Founders
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Submitting to directories can either supercharge your Google
                  rankings or trigger algorithmic spam filters if done
                  carelessly. Follow these 5 proven guidelines:
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                        Never Use the Exact Same Description Across All
                        Directories
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Search engine crawlers easily detect boilerplate
                        copy-pasted paragraphs across 30 domains. Write 3–4
                        unique variations emphasizing different aspects of your
                        tool (e.g. one focused on developer speed, one on cost
                        savings, one on key integrations).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                        Tag Your Underlying Tech Stack Relational Graph
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Directories like LaunchNests connect software products
                        to their underlying developer tools. Tagging your
                        frameworks (Next.js, Tailwind, Supabase) unlocks extra
                        internal links from high-authority ecosystem showcase
                        pages.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      3
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                        Always Use Clean Canonical Home URLs
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Ensure your destination link uses your exact canonical
                        protocol (e.g. https://yourdomain.com without trailing
                        slashes or unnecessary redirects). Avoid passing complex
                        redirect chains through URL shorteners.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      4
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                        Leverage Embed Badges for Reciprocal Authority
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Embedding verified directory badges in your footer or
                        GitHub README signals mutual credibility to visitors and
                        search crawlers. Many directories provide bonus
                        placement or verified badges for makers who display the
                        embed snippet.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      5
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                        Avoid Low-Quality Automated Link Farm Blasters
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Beware of services claiming to "Submit your site to 500
                        directories for $29". Most of these blast your domain
                        into dead, de-indexed WordPress directories that trigger
                        Google spam penalties. Stick to curated, human-reviewed
                        platforms with real traffic.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="rounded-2xl bg-slate-900 p-8 text-center text-white md:p-12">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                Start With The Highest ROI Directory: {SITE_CONFIG.name}
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300 sm:text-sm">
                Get your SaaS or developer tool indexed with permanent Do-Follow
                backlink equity and 12–24h review turnaround. Free submissions
                welcome.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={ROUTES.SUBMIT_PRODUCT}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-none bg-blue-600 text-white hover:bg-blue-500"
                  )}
                >
                  Submit Your SaaS Product
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <Link
                  href={ROUTES.SAAS_DIRECTORY}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-none border-slate-700 bg-transparent text-white hover:bg-slate-800"
                  )}
                >
                  Browse SaaS Directory
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default SaasDirectoriesGuidePage
