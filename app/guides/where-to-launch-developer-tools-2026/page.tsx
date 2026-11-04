import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight, ChevronRight as ArrowSub } from "lucide-react"
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
  title: `Where to Launch Developer Tools (${new Date().getFullYear()} Guide)`,
  description:
    "The definitive 2026 playbook for launching developer tools, APIs, open-source libraries, and infrastructure. Covers DevHunt, LaunchNests, Show HN, GitHub Awesome lists, and AI coding agents.",
  keywords: [
    "where to launch developer tools",
    "launching dev tools",
    "dev tool marketing",
    "developer product distribution",
    "where to promote open source",
    "developer tools directory",
    "show hn launch guide",
    "dev tool launch strategy 2026",
    "github readme badge traffic",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/guides/where-to-launch-developer-tools-2026`,
  },
  openGraph: {
    title: `Where to Launch Developer Tools: Complete Distribution Guide (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
    description:
      "A comprehensive, developer-centric distribution guide for engineering founders and open source maintainers.",
    url: `${SITE_CONFIG.url}/guides/where-to-launch-developer-tools-2026`,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Where to Launch Developer Tools | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Where to Launch Developer Tools (${new Date().getFullYear()})`,
    description:
      "The definitive playbook for launching dev tools, APIs, and open-source infrastructure.",
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface DevChannel {
  name: string
  category: string
  audienceSize: string
  conversionType: string
  bestFor: string
  effort: string
  recommendation: string
}

const DEV_CHANNELS: DevChannel[] = [
  {
    name: "LaunchNests Developer Catalog",
    category: "Developer Directory & Stacks",
    audienceSize: "High-Intent Engineers",
    conversionType: "Perpetual SEO & AI Ingestion",
    bestFor: "APIs, SDKs, Databases, Frameworks",
    effort: "Low (10 mins)",
    recommendation: "Essential (Permanent 'Built With' adoption proof)",
  },
  {
    name: "DevHunt",
    category: "Developer Launch Board",
    audienceSize: "Developer Community",
    conversionType: "24h Launch Day Spike",
    bestFor: "Open source CLI tools, dev utilities",
    effort: "Medium (requires launch prep)",
    recommendation: "Highly Recommended for peer feedback",
  },
  {
    name: "Hacker News (Show HN)",
    category: "Technical Aggregator",
    audienceSize: "1M+ Engineers & CTOs",
    conversionType: "Viral Traffic & Code Reviews",
    bestFor: "Novel engineering, technical breakthroughs, OSS",
    effort: "High (strict formatting & active comments)",
    recommendation: "Highest impact if executed authentically",
  },
  {
    name: "GitHub Trending & Awesome Lists",
    category: "Open Source Repository",
    audienceSize: "Global Software Developers",
    conversionType: "GitHub Stars, Forks, Pull Requests",
    bestFor: "Libraries, SDKs, Starters, Frameworks",
    effort: "Medium (PR submission & curator review)",
    recommendation: "Compounding evergreen traffic for open source",
  },
  {
    name: "Reddit (r/webdev, r/programming)",
    category: "Developer Subreddits",
    audienceSize: "Targeted Communities",
    conversionType: "Direct Tester Feedback",
    bestFor: "Problem-solving utilities, architecture discussions",
    effort: "High (strict anti-self-promotion rules)",
    recommendation: "Focus on problem solved, never post marketing copy",
  },
  {
    name: "Model Context Protocol (MCP) & /llms.txt",
    category: "Autonomous AI Coding Agents",
    audienceSize: "Cursor, Claude, Copilot Users",
    conversionType: "Programmatic Tool Citations",
    bestFor: "APIs, Documentation, SDKs",
    effort: "Low (Standardized endpoints)",
    recommendation: "Crucial for modern developer discovery",
  },
]

const LAUNCH_PILLARS = [
  {
    pillarNumber: "01",
    subtitle: "Permanent Indexing",
    title: "LaunchNests 'Built With' Graph",
    description:
      "Engineers evaluate tooling based on real-world proof. Listing your dev tool on LaunchNests links your profile directly to software products using your SDK. You gain permanent Do-Follow backlinks and indexable presence across static category hubs.",
    actionLabel: "Submit a Devtool to LaunchNests →",
    actionHref: ROUTES.SUBMIT_TOOL,
  },
  {
    pillarNumber: "02",
    subtitle: "Technical Community",
    title: "DevHunt Peer Review",
    description:
      "DevHunt brings together fellow developers, open-source maintainers, and developer advocates for 24-hour launch feedback. Perfect for gathering code-level critiques, early testers, and an official 'Tool of the Day' badge.",
    actionLabel: "Compare LaunchNests vs DevHunt →",
    actionHref: ROUTES.DEVHUNT_ALTERNATIVE,
  },
  {
    pillarNumber: "03",
    subtitle: "Viral Engineering Spike",
    title: "Authentic Technical Show HN",
    description:
      "A front-page Show HN post can deliver 10,000–50,000 developer visits in 48 hours. The secret: no marketing language. Focus on the architectural problem you solved, post your GitHub repository, and personally answer technical questions in the comments.",
    actionLabel: null,
    actionHref: null,
  },
  {
    pillarNumber: "04",
    subtitle: "AI Agent Discovery",
    title: "Model Context Protocol & /llms.txt",
    description:
      "In 2026, developers increasingly discover libraries through AI coding assistants like Cursor, Claude, and Copilot. Providing an MCP server and /llms.txt index ensures your API is cited when developers ask their IDE for implementation libraries.",
    actionLabel: null,
    actionHref: null,
  },
]

const LAUNCH_CHECKLIST = [
  {
    step: "01",
    title: "A 3-Line Quickstart Code Sample",
    description:
      "Put an npm/pip install command and a 5-line working code snippet above the fold on your homepage. Never make developers read paragraphs before seeing code.",
  },
  {
    step: "02",
    title: "Transparent Self-Serve Pricing",
    description:
      "Clearly disclose whether you are Open Source, Freemium, or Paid. Developers distrust 'Contact Sales' buttons for standard utilities and libraries.",
  },
  {
    step: "03",
    title: "Interactive Playground or Sandbox",
    description:
      "Provide a web-based sandbox (StackBlitz, CodeSandbox, or live API console) so developers can test your API without registering an account or entering credentials.",
  },
  {
    step: "04",
    title: "Embeddable GitHub README Badges",
    description:
      "Include verified directory and build badges on your GitHub repository to pass backlink equity and signal active production adoption to potential contributors.",
  },
]

const WhereToLaunchDevtoolsGuidePage = () => {
  const currentYear = new Date().getFullYear()

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Guides",
      url: `${SITE_CONFIG.url}/guides/where-to-launch-developer-tools-2026`,
    },
    {
      name: "Where to Launch Developer Tools",
      url: `${SITE_CONFIG.url}/guides/where-to-launch-developer-tools-2026`,
    },
  ])

  const articleLd = {
    "@type": "Article",
    "@id": `${SITE_CONFIG.url}/guides/where-to-launch-developer-tools-2026#article`,
    headline: `Where to Launch Developer Tools: Complete Distribution Guide (${currentYear})`,
    description:
      "A comprehensive guide for developer tool creators, detailing channels, tactics, and tech-stack mapping to drive developer adoption.",
    datePublished: "2026-02-01T00:00:00Z",
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
              Where to Launch Developer Tools
            </span>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className={comparisonPageContainer}>
          {/* Hero Section */}
          <header className={comparisonHeroWrapper}>
            <div className={comparisonCategoryPill}>
              <span>Developer Distribution · {currentYear}</span>
            </div>

            <h1 className={comparisonH1}>
              Where to Launch Developer Tools: The Complete 2026 Playbook
            </h1>

            <p className={comparisonLeadParagraph}>
              Marketing to developers requires an entirely different strategy
              than marketing consumer SaaS. Developers despise corporate hype,
              marketing buzzwords, and gated sales demos. They want clean
              documentation, immediate code samples, transparent pricing, and
              proof of real-world production adoption.
            </p>

            <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
              <Button
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT_TOOL} />}
                className="w-full text-xs font-semibold sm:w-auto"
              >
                Submit Your Dev Tool — Free
              </Button>
              <Button
                variant="outline"
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.TOOLS} />}
                className="w-full text-xs font-semibold text-slate-700 sm:w-auto"
              >
                Explore Developer Tools
              </Button>
            </div>

            <div className={comparisonTrustBar}>
              <span>14 min read</span>
              <span>·</span>
              <span>Engineering-First Strategy</span>
              <span>·</span>
              <span>Updated for {currentYear} Workflows</span>
            </div>
          </header>

          {/* Master Channel Matrix */}
          <section id="channel-matrix" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Developer Distribution Channels Ranked by Impact
              </h2>
              <p className={comparisonSectionSubtitle}>
                Comparative analysis of primary developer launchpads, technical
                communities, and programmatic indexing engines.
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
                      Channel
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Category
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Audience Fit
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Traffic Type
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Best Suited For
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Effort
                    </TableHead>
                    <TableHead className="px-4 py-3.5 text-right font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Rating
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-dashed divide-border text-slate-600">
                  {DEV_CHANNELS.map((ch) => (
                    <TableRow
                      key={ch.name}
                      className={
                        ch.name.includes("LaunchNests")
                          ? "border-b border-dashed border-border bg-indigo-50/20 font-medium"
                          : "border-b border-dashed border-border hover:bg-slate-50/50"
                      }
                    >
                      <TableCell className="px-4 py-3.5 font-semibold text-slate-900">
                        {ch.name}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-mono text-xs text-slate-600">
                        {ch.category}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {ch.audienceSize}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 font-medium text-slate-800">
                        {ch.conversionType}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {ch.bestFor}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-xs text-slate-600">
                        {ch.effort}
                      </TableCell>
                      <TableCell className="px-4 py-3.5 text-right font-mono text-xs font-semibold text-indigo-600">
                        {ch.recommendation.split("(")[0].trim()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* 4 Pillars of a High-Impact Launch */}
          <section id="launch-pillars" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                The 4 Pillars of a High-Impact Developer Tool Launch
              </h2>
              <p className={comparisonSectionSubtitle}>
                Successful devtool founders execute launches across four
                distinct timeframes: permanent canonical indexing, community
                launch day, viral developer feedback, and AI agent integration.
              </p>
            </div>

            <div className="relative grid grid-cols-1 divide-y divide-dashed divide-border border border-dashed border-border bg-white md:grid-cols-2 md:divide-y-0 rounded-xl overflow-hidden">
              {LAUNCH_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.pillarNumber}
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
                        Pillar {pillar.pillarNumber}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 uppercase">
                        {pillar.subtitle}
                      </span>
                    </div>

                    <h3 className="mt-3 text-base font-bold text-slate-900">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {pillar.description}
                    </p>
                  </div>

                  {pillar.actionLabel && pillar.actionHref && (
                    <div className="mt-4 border-t border-dashed border-slate-100 pt-3">
                      <Link
                        href={pillar.actionHref}
                        className="font-mono text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                      >
                        {pillar.actionLabel}
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Execution Checklist */}
          <section id="checklist" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                What to Prepare Before Launching a Developer Tool
              </h2>
              <p className={comparisonSectionSubtitle}>
                Key operational and technical checkpoints to complete before
                submitting your project to public developer channels.
              </p>
            </div>

            <div className="relative flex flex-col divide-y divide-dashed divide-border border border-dashed border-border bg-white rounded-xl overflow-hidden">
              {LAUNCH_CHECKLIST.map((item) => (
                <div
                  key={item.step}
                  className="group relative flex flex-col gap-2 p-5 transition-colors hover:bg-slate-50/20 sm:p-6"
                >
                  <CornerBrackets />
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 uppercase">
                      Check {item.step}
                    </span>
                    <span className="text-slate-300">·</span>
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing Call to Action */}
          <ReadyToShowcaseCta
            title={`Ready to Launch Your Developer Tool on ${SITE_CONFIG.name}?`}
            description="Get indexed across our permanent category hubs, connect to verified production builds, and secure permanent Do-Follow SEO backlinks."
            primaryActionLabel="Submit Your Developer Tool"
            primaryActionHref={ROUTES.SUBMIT_TOOL}
            secondaryActionLabel="Explore Developer Tools"
            secondaryActionHref={ROUTES.TOOLS}
          />
        </div>
      </div>
    </>
  )
}

export default WhereToLaunchDevtoolsGuidePage
