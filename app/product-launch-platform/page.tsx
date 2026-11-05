import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight, HelpCircle } from "lucide-react"
import {
  getCachedProductsStats,
} from "@/db/queries/products/list"
import {
  getCachedToolsStats,
} from "@/db/queries/tools/list"
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

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Product Launch Platform for SaaS & Dev Tools",
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

const DISTRIBUTION_ENGINES = [
  {
    number: "01",
    subtitle: "Weekly Cycles",
    title: "Weekly Launch Momentum",
    description:
      "Products compete on community weekly momentum feeds, giving your launch 7 full days of prominent front-page visibility instead of just 24 hours.",
    actionLabel: "Browse Weekly Launches",
    actionHref: ROUTES.HOME,
  },
  {
    number: "02",
    subtitle: "Permanent Hubs",
    title: "Static Category Pages",
    description:
      "Every launch is indexed into static, crawlable category pages ranking on Google for queries like 'AI software', 'developer tools', and 'productivity apps'.",
    actionLabel: "Explore Categories",
    actionHref: ROUTES.PRODUCTS,
  },
  {
    number: "03",
    subtitle: "Tech Stacks",
    title: "Relational 'Built With' Graph",
    description:
      "Tag your underlying tech stack. Your product appears on the showcase pages of every tool, database, and API powering your software.",
    actionLabel: "View Building Blocks",
    actionHref: ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS,
  },
  {
    number: "04",
    subtitle: "AI Feeds",
    title: "AI Search & MCP Protocol",
    description:
      "Native /llms.txt indices, raw Markdown endpoints, and a live MCP server allow coding agents and LLMs to recommend your product in AI chats.",
    actionLabel: "Inspect /llms.txt Feed",
    actionHref: "/llms.txt",
  },
]

const LAUNCH_PHASES = [
  {
    phaseNumber: "01",
    subtitle: "Pre-Launch Readiness",
    title: "Foundation & Technical Indexing",
    steps: [
      "Submit your product 1–2 weeks early to establish Google indexing.",
      "Tag your tech stack to automatically unlock verified 'Built With' links.",
      "Verify your Open Graph preview cards and high-converting tagline.",
      "Set up analytics to attribute referral traffic and sign-up conversions.",
    ],
  },
  {
    phaseNumber: "02",
    subtitle: "Launch Week Momentum",
    title: "Community Amplification",
    steps: [
      "Share your LaunchNests profile link across Twitter, LinkedIn, and newsletters.",
      "Engage with early community comments and respond to feedback constructively.",
      "Coordinate secondary launches on niche dev subreddits and Show HN.",
      "Embed the LaunchNests badge on your landing page to build social proof.",
    ],
  },
  {
    phaseNumber: "03",
    subtitle: "Evergreen Growth",
    title: "Compounding SEO & AI Ingestion",
    steps: [
      "Benefit from permanent category ranking without recurring monthly fees.",
      "Earn natural mentions from builders who discover your product.",
      "AI assistants (Cursor, ChatGPT) cite your product through /llms.txt.",
      "Submit major feature updates to trigger re-surfacing in trending feeds.",
    ],
  },
]

const PLATFORM_COMPARISON = [
  {
    feature: "Launch Window",
    launchNests: "Weekly + Perpetual",
    productHunt: "24 Hours",
    devHunt: "24 Hours",
    uneed: "Rolling daily/monthly",
  },
  {
    feature: "Submission Review",
    launchNests: "12–24 Hours",
    productHunt: "Self-scheduled",
    devHunt: "Community review",
    uneed: "30–150 day backlog",
  },
  {
    feature: "SEO Link Type",
    launchNests: "Permanent Do-Follow",
    productHunt: "Redirect (/r/)",
    devHunt: "Profile Link",
    uneed: "Conditional (20+ votes)",
  },
  {
    feature: "Tech Stack Graph",
    launchNests: "Yes ('Built With')",
    productHunt: "No",
    devHunt: "No",
    uneed: "No",
  },
  {
    feature: "AI Engine Ingestion",
    launchNests: "/llms.txt + MCP",
    productHunt: "No",
    devHunt: "No",
    uneed: "No",
  },
]

const FAQS = [
  {
    question: "Is LaunchNests free to launch on?",
    answer:
      "Yes. Core submissions for software products and developer tools are 100% free with human review within 12–24 hours. We also offer affordable one-time verification tiers ($15 Premium / $19 Premium+) for permanent Do-Follow backlinks and featured placements.",
  },
  {
    question: "Can I launch both SaaS products and developer tools?",
    answer:
      "Yes. LaunchNests has dedicated pipelines for both. If you are building an end-user SaaS, launch as a product. If you are building an API, library, or database, launch as a tool and developers can tag your tool in their builds.",
  },
  {
    question: "What makes LaunchNests different from 24-hour launch boards?",
    answer:
      "Traditional launch boards archive products after 24 hours. LaunchNests keeps your product permanently indexed across static category landing pages, alternative matrices, and relational tech-stack showcases, driving continuous organic traffic month after month.",
  },
  {
    question: "How does the weekly launch cycle work?",
    answer:
      "Approved products are grouped into weekly launch cohorts. Throughout the week, community members discover, test, upvote, and review your product. Top products earn coveted podium badges and newsletter feature slots.",
  },
]

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
            <span
              className="truncate font-semibold text-slate-900"
              aria-current="page"
            >
              Product Launch Platform
            </span>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className={comparisonPageContainer}>
          {/* Hero Section */}
          <header className={comparisonHeroWrapper}>
            <div className={comparisonCategoryPill}>
              <span>Modern Distribution Platform · {currentYear}</span>
            </div>

            <h1 className={comparisonH1}>
              The Product Launch Platform Built for Compound Discovery
            </h1>

            <p className={comparisonLeadParagraph}>
              Say goodbye to the stressful 24-hour voting sprint.{" "}
              <strong className="font-semibold text-slate-800">
                {SITE_CONFIG.name}
              </strong>{" "}
              pairs community launch cycles with a perpetual software directory,
              relational tech-stack graphs, and native integration for
              autonomous AI search engines like ChatGPT, Claude, and Perplexity.
            </p>

            <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
              <Button
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT} />}
                className="w-full text-xs font-semibold sm:w-auto"
              >
                Launch Your Product — Free
              </Button>
              <Button
                variant="outline"
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.HOME} />}
                className="w-full text-xs font-semibold text-slate-700 sm:w-auto"
              >
                View Weekly Launches
              </Button>
            </div>

            <div className={comparisonTrustBar}>
              <span>{totalCatalogItems}+ Launches Cataloged</span>
              <span>·</span>
              <span>{toolStats.totalBuilds.toLocaleString()} Production Builds</span>
              <span>·</span>
              <span>12–24h Review Guarantee</span>
              <span>·</span>
              <span>Permanent Do-Follow Links</span>
            </div>
          </header>

          {/* 4 Distribution Engines */}
          <section id="distribution-engines" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Four Built-In Distribution Engines
              </h2>
              <p className={comparisonSectionSubtitle}>
                Most launch sites stop working the moment your 24-hour launch day
                ends. LaunchNests activates four continuous channels working for
                your software year-round.
              </p>
            </div>

            <div className="relative grid grid-cols-1 divide-y divide-dashed divide-border border border-dashed border-border bg-white md:grid-cols-2 lg:grid-cols-4 md:divide-y-0 md:divide-x rounded-xl overflow-hidden">
              {DISTRIBUTION_ENGINES.map((engine) => (
                <div
                  key={engine.number}
                  className="group relative flex flex-col justify-between p-6 transition-colors hover:bg-slate-50/30"
                >
                  <CornerBrackets />
                  <div>
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                      <span className="font-mono text-xs font-bold tracking-wider text-indigo-600 uppercase">
                        Engine {engine.number}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 uppercase">
                        {engine.subtitle}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {engine.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {engine.description}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-dashed border-slate-100 pt-3">
                    <Link
                      href={engine.actionHref}
                      className="inline-flex items-center gap-1 font-mono text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-800"
                    >
                      {engine.actionLabel}
                      <ChevronRight className="size-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* The 2026 Product Launch Blueprint */}
          <section id="launch-blueprint" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                The 3-Phase Guide to a Successful Product Launch
              </h2>
              <p className={comparisonSectionSubtitle}>
                Transform your product launch from a one-day spike into a
                durable customer acquisition funnel.
              </p>
            </div>

            <div className="relative grid grid-cols-1 divide-y divide-dashed divide-border border border-dashed border-border bg-white md:grid-cols-3 md:divide-y-0 md:divide-x rounded-xl overflow-hidden">
              {LAUNCH_PHASES.map((phase) => (
                <div
                  key={phase.phaseNumber}
                  className="group relative flex flex-col justify-between p-6 transition-colors hover:bg-slate-50/30 md:p-8"
                >
                  <CornerBrackets />
                  <div>
                    <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                      <span className="font-mono text-xs font-bold tracking-wider text-indigo-600 uppercase">
                        Phase {phase.phaseNumber}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 uppercase">
                        {phase.subtitle}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {phase.title}
                    </h3>

                    <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600">
                      {phase.steps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-slate-900" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Launchpad Comparison Matrix */}
          <section id="platform-comparison" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                LaunchNests vs Traditional Launch Platforms
              </h2>
              <p className={comparisonSectionSubtitle}>
                How LaunchNests compares to legacy 24-hour voting sites across
                discovery, links, and ecosystem integration.
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
                      Feature
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-indigo-900 uppercase">
                      {SITE_CONFIG.name}
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Product Hunt
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      DevHunt
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Uneed
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-dashed divide-border text-slate-600">
                  {PLATFORM_COMPARISON.map((row) => (
                    <TableRow
                      key={row.feature}
                      className="border-b border-dashed border-border hover:bg-slate-50/50"
                    >
                      <TableCell className="px-4 py-3.5 font-semibold text-slate-900">
                        {row.feature}
                      </TableCell>
                      <TableCell className="bg-indigo-50/20 px-4 py-3.5 font-semibold text-slate-900">
                        {row.launchNests}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {row.productHunt}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {row.devHunt}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {row.uneed}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section id="faqs" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Frequently Asked Questions
              </h2>
              <p className={comparisonSectionSubtitle}>
                Everything you need to know about submission tiers, review
                timing, and launch eligibility.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-dashed divide-border rounded-xl border border-dashed border-border bg-white shadow-2xs">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-5 sm:p-6">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="pl-6.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing Call to Action */}
          <ReadyToShowcaseCta
            title={`Ready to Launch Your Software on ${SITE_CONFIG.name}?`}
            description="Get discovered by software engineers, tech founders, and AI search engines. Submit your product in less than 3 minutes."
            primaryActionLabel="Submit Your Product Free"
            primaryActionHref={ROUTES.SUBMIT}
            secondaryActionLabel="View Listing Options"
            secondaryActionHref={ROUTES.PRICING}
          />
        </div>
      </div>
    </>
  )
}

export default ProductLaunchPlatformPage
