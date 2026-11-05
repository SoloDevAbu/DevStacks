import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { ReadyToShowcaseCta } from "@/components/shared/ready-to-showcase-cta"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  comparisonPageContainer,
  comparisonHeroWrapper,
  comparisonCategoryPill,
  comparisonH1,
  comparisonLeadParagraph,
  comparisonTrustBar,
  comparisonSectionTitle,
  comparisonSectionSubtitle,
  comparisonTableCard,
} from "@/utils/styles"

export const revalidate = 86400

export const metadata: Metadata = {
  title: `25+ Free SaaS Directories for Backlinks (${new Date().getFullYear()})`,
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

const DIRECTORY_TIERS = [
  {
    tierNumber: "01",
    label: "Fast Indexing Catalogs",
    title: "LaunchNests, DevHunt & MicroLaunch",
    description:
      "Modern platforms built with fast review turnarounds, clean Do-Follow link architecture, and native AI engine readiness (/llms.txt). On LaunchNests, you also gain two-way 'Built With' mapping linking your product to developer building blocks.",
    primaryValue:
      "Fast Google indexing, permanent SEO link equity, and tech-stack discovery.",
  },
  {
    tierNumber: "02",
    label: "Viral Launchboards",
    title: "Product Hunt & Uneed",
    description:
      "High-competition daily voting competitions designed for rapid viral visibility. While Product Hunt uses tracking redirects rather than direct Do-Follow links, a top finish can drive thousands of launch-day visitors and valuable secondary press coverage.",
    primaryValue:
      "Immediate launch-day traffic spike, investor eyes, and social proof badges.",
  },
  {
    tierNumber: "03",
    label: "Enterprise Review Portals",
    title: "G2, Capterra & SourceForge",
    description:
      "Authoritative B2B review portals dominating commercial search queries. While they generally do not provide direct Do-Follow links on free tiers, having an active profile with customer reviews dramatically improves sales conversion rates for enterprise buyers.",
    primaryValue:
      "High-ticket buyer trust, brand validation, and third-party review widgets.",
  },
  {
    tierNumber: "04",
    label: "Maker Communities",
    title: "BetaList & Indie Hackers",
    description:
      "Dedicated platforms for early beta testing, waiting lists, and founder collaboration. BetaList connects you with early adopters willing to tolerate unfinished UI in exchange for early access.",
    primaryValue:
      "Private beta testers, initial feedback loops, and founder community support.",
  },
]

const SUBMISSION_RULES = [
  {
    title: "Never Use the Exact Same Description Across All Directories",
    description:
      "Search engine crawlers easily detect boilerplate copy-pasted paragraphs across 30 domains. Write 3–4 unique variations emphasizing different aspects of your tool (e.g. one focused on developer speed, one on cost savings, one on key integrations).",
  },
  {
    title: "Tag Your Underlying Tech Stack Relational Graph",
    description:
      "Directories like LaunchNests connect software products to their underlying developer tools. Tagging your frameworks (Next.js, Tailwind, Supabase) unlocks extra internal links from high-authority ecosystem showcase pages.",
  },
  {
    title: "Always Use Clean Canonical Home URLs",
    description:
      "Ensure your destination link uses your exact canonical protocol without trailing slashes or unnecessary redirects. Avoid passing complex redirect chains through URL shorteners.",
  },
  {
    title: "Leverage Embed Badges for Reciprocal Authority",
    description:
      "Embedding verified directory badges in your footer or GitHub README signals mutual credibility to visitors and search crawlers. Many directories provide bonus placement or verified badges for makers who display the embed snippet.",
  },
  {
    title: "Avoid Low-Quality Automated Link Farm Blasters",
    description:
      "Beware of services claiming to 'Submit your site to 500 directories for $29'. Most blast your domain into dead, de-indexed WordPress directories that trigger Google spam penalties. Stick to curated, human-reviewed platforms with real traffic.",
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

      <div className="flex w-full flex-col overflow-x-clip bg-white">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-500 sm:px-6 md:px-8"
        >
          <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-2">
            <Link
              href={ROUTES.HOME}
              className="flex shrink-0 items-center gap-1 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="size-3 shrink-0" />
              Home
            </Link>
            <ChevronRight
              className="size-3 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span className="text-slate-500">Guides</span>
            <ChevronRight
              className="size-3 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span
              className="truncate font-semibold text-slate-900"
              aria-current="page"
            >
              Free SaaS Directories for Backlinks
            </span>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className={comparisonPageContainer}>
          {/* Hero Section */}
          <header className={comparisonHeroWrapper}>
            <div className={comparisonCategoryPill}>
              <span>Founder Distribution & SEO · {currentYear}</span>
            </div>

            <h1 className={comparisonH1}>
              25+ Best Free SaaS Directories for Backlinks & Organic Traffic
            </h1>

            <p className={comparisonLeadParagraph}>
              Building a great software product is only 20% of the battle; 80%
              is distribution. For early-stage SaaS founders, submitting to
              high-quality software directories remains one of the most
              cost-effective ways to acquire initial root domain authority,
              indexable Do-Follow backlinks, and early qualified customer
              signups.
            </p>

            <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
              <Button
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT_PRODUCT} />}
                className="w-full text-xs font-semibold sm:w-auto"
              >
                Submit Your SaaS — Free
              </Button>
              <Button
                variant="outline"
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SAAS_DIRECTORY} />}
                className="w-full text-xs font-semibold text-slate-700 sm:w-auto"
              >
                Browse SaaS Directory
              </Button>
            </div>

            <div className={comparisonTrustBar}>
              <span>12 min read</span>
              <span>·</span>
              <span>Written by the LaunchNests team</span>
              <span>·</span>
              <span>20+ Active Directories Evaluated</span>
            </div>
          </header>

          {/* Directory Master Matrix */}
          <section id="directory-matrix" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Master Table: Top Vetted SaaS Directories for {currentYear}
              </h2>
              <p className={comparisonSectionSubtitle}>
                Sorted by platform category, backlink equity, and submission
                review speed.
              </p>
            </div>

            <div className={comparisonTableCard}>
              <Table
                containerClassName="overflow-x-auto"
                className="w-full text-left text-xs"
              >
                <TableHeader className="border-b border-dashed border-border bg-slate-50/80">
                  <TableRow className="border-b border-dashed border-border">
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Directory
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Estimated DA
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Backlink Type
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Submission Cost
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Review Speed
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Best Suited For
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-right font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-dashed divide-border text-slate-600">
                  {DIRECTORIES.map((dir) => (
                    <TableRow
                      key={dir.name}
                      className={
                        dir.highlight
                          ? "border-b border-dashed border-border bg-indigo-50/20 font-medium"
                          : "border-b border-dashed border-border hover:bg-slate-50/50"
                      }
                    >
                      <TableCell className="px-4 py-3.5 font-semibold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span>{dir.name}</span>
                          {dir.highlight && (
                            <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-700">
                              TOP PICK
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-700">
                        {dir.daEstimate}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs">
                        {dir.linkType.includes("Do-Follow") ? (
                          <span className="font-semibold text-indigo-600">
                            {dir.linkType}
                          </span>
                        ) : (
                          <span className="text-slate-500">{dir.linkType}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-700">
                        {dir.cost}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {dir.reviewTime}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {dir.bestFor}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-right">
                        {dir.name === "LaunchNests" ? (
                          <Link
                            href={ROUTES.SUBMIT_PRODUCT}
                            className="font-mono text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                          >
                            Submit Free →
                          </Link>
                        ) : (
                          <a
                            href={dir.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-xs text-slate-500 hover:text-slate-900"
                          >
                            Visit
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Directory Categorization Tiers */}
          <section id="directory-tiers" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Understanding the 4 Types of Software Directories
              </h2>
              <p className={comparisonSectionSubtitle}>
                Not all directories serve the same purpose. A balanced launch
                strategy combines fast-indexing modern catalogs, enterprise
                review sites, and community launch boards.
              </p>
            </div>

            <div className="relative grid grid-cols-1 divide-y divide-dashed divide-border border border-dashed border-border bg-white md:grid-cols-2 md:divide-y-0 rounded-xl overflow-hidden">
              {DIRECTORY_TIERS.map((tier, idx) => (
                <div
                  key={tier.tierNumber}
                  className={`group relative flex flex-col justify-between p-6 transition-colors hover:bg-slate-50/30 md:p-8 ${
                    idx % 2 === 0
                      ? "md:border-r md:border-dashed md:border-border"
                      : ""
                  } ${idx < 2 ? "md:border-b md:border-dashed md:border-border" : ""}`}
                >
                  <CornerBrackets />
                  <div>
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                      <span className="font-mono text-xs font-bold tracking-wider text-indigo-600 uppercase">
                        Tier {tier.tierNumber}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 uppercase">
                        {tier.label}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {tier.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {tier.description}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-dashed border-slate-100 pt-3 text-xs text-slate-600">
                    <strong className="font-semibold text-slate-900">
                      Primary Value:{" "}
                    </strong>
                    {tier.primaryValue}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5 Golden Rules of Directory Link Building */}
          <section id="guidelines" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                The 5 Golden Rules of Directory Link Building
              </h2>
              <p className={comparisonSectionSubtitle}>
                Submitting to directories can either supercharge your Google
                rankings or trigger algorithmic spam filters if done carelessly.
              </p>
            </div>

            <div className="relative flex flex-col divide-y divide-dashed divide-border border border-dashed border-border bg-white rounded-xl overflow-hidden">
              {SUBMISSION_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col gap-2 p-5 transition-colors hover:bg-slate-50/20 sm:p-6"
                >
                  <CornerBrackets />
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 uppercase">
                      Rule 0{idx + 1}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {rule.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {rule.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing Call to Action */}
          <ReadyToShowcaseCta
            title={`Start With The Highest ROI Directory: ${SITE_CONFIG.name}`}
            description="Get your SaaS or developer tool indexed with permanent Do-Follow backlink equity and 12–24h review turnaround. Free submissions welcome."
            primaryActionLabel="Submit Your SaaS Product"
            primaryActionHref={ROUTES.SUBMIT_PRODUCT}
            secondaryActionLabel="Browse SaaS Directory"
            secondaryActionHref={ROUTES.SAAS_DIRECTORY}
          />
        </div>
      </div>
    </>
  )
}

export default SaasDirectoriesGuidePage
