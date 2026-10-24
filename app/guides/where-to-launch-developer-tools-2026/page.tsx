import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  BookOpen,
  Code2,
  Hammer,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Globe,
  CheckCircle2,
  Cpu,
  Flame,
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
  title: `Where to Launch Developer Tools: Complete Distribution Guide (${new Date().getFullYear()})`,
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
    effort: "High (strict formatting & active comment replies)",
    recommendation: "Highest impact if executed with genuine authenticity",
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
                Where to Launch Developer Tools
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Terminal className="size-4 text-blue-600" />
              <span>Developer Marketing & Growth Guide ({currentYear})</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Where to Launch Developer Tools: The Complete 2026 Playbook
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Marketing to developers requires an entirely different strategy
              than marketing consumer SaaS. Developers despise corporate hype,
              marketing buzzwords, and gated sales demos. They want clean
              documentation, immediate code samples, transparent pricing, and{" "}
              <strong className="font-semibold text-slate-800">
                proof of real-world production adoption
              </strong>
              .
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="size-3.5 text-slate-400" />
                14 min read
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5 text-emerald-600" />
                Engineering-First Strategy
              </span>
              <span>•</span>
              <span>Updated for {currentYear} AI workflows</span>
            </div>
          </div>
        </header>

        {/* Master Channel Matrix */}
        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-10 md:px-8">
          <div className="mb-6 flex flex-col gap-1">
            <h2 className="text-lg font-bold text-slate-900 sm:text-2xl">
              Developer Distribution Channels Ranked by Impact
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Comparative analysis of primary developer launchpads, technical
              communities, and programmatic indexing engines.
            </p>
          </div>

          <div className="overflow-x-auto rounded-lg border border-dashed border-border bg-white shadow-2xs">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Channel</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Audience Fit</th>
                  <th className="px-4 py-3">Traffic Type</th>
                  <th className="px-4 py-3">Best Suited For</th>
                  <th className="px-4 py-3">Effort</th>
                  <th className="px-4 py-3 text-right">Strategic Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-600">
                {DEV_CHANNELS.map((ch) => (
                  <tr
                    key={ch.name}
                    className={
                      ch.name.includes("LaunchNests")
                        ? "bg-blue-50/50 font-medium"
                        : "hover:bg-slate-50/60"
                    }
                  >
                    <td className="px-4 py-3.5 font-semibold text-slate-900">
                      {ch.name}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {ch.category}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {ch.audienceSize}
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-slate-800">
                      {ch.conversionType}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {ch.bestFor}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {ch.effort}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-semibold text-blue-600">
                      {ch.recommendation.split("(")[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Deep Dive Sections */}
        <main className="flex-1 px-6 py-12 md:px-8">
          <div className="flex flex-col gap-12">
            {/* The 4 Developer Launch Pillars */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Cpu className="size-4 text-blue-600" />
                <span>Strategic Playbook</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                The 4 Pillars of a High-Impact Developer Tool Launch
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Successful devtool founders execute launches across four distinct
                timeframes: permanent canonical indexing, community launch day,
                viral developer feedback, and AI agent integration.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase">
                    <Hammer className="size-4 text-blue-600" />
                    <span>Pillar 1: Permanent Relational Indexing</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    LaunchNests 'Built With' Graph
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    Engineers evaluate tooling based on real-world proof.
                    Listing your dev tool on LaunchNests links your profile
                    directly to software products using your SDK. You gain
                    permanent Do-Follow backlinks and indexable presence across
                    static category hubs (e.g. Auth, DBs, AI APIs).
                  </p>
                  <Link
                    href={ROUTES.SUBMIT_TOOL}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Submit a Devtool to LaunchNests →
                  </Link>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase">
                    <Terminal className="size-4 text-emerald-600" />
                    <span>Pillar 2: Technical Launch Day Community</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    DevHunt Peer Review
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    DevHunt brings together fellow developers, open-source
                    maintainers, and developer advocates for 24-hour launch
                    feedback. Perfect for gathering code-level critiques, early
                    testers, and an official 'Tool of the Day' badge.
                  </p>
                  <Link
                    href={ROUTES.DEVHUNT_ALTERNATIVE}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                  >
                    Compare LaunchNests vs DevHunt →
                  </Link>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-700 uppercase">
                    <Flame className="size-4 text-purple-600" />
                    <span>Pillar 3: The Hacker News Show HN</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    Authentic Technical Show HN
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    A front-page Show HN post can deliver 10,000–50,000 developer
                    visits in 48 hours. The secret: no marketing language. Focus
                    on the architectural problem you solved, post your GitHub
                    repository, and personally answer technical questions in the
                    comments.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase">
                    <Sparkles className="size-4 text-amber-600" />
                    <span>Pillar 4: Autonomous AI Agent Discovery</span>
                  </div>
                  <h3 className="mt-2 text-base font-bold text-slate-900">
                    Model Context Protocol & /llms.txt
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    In 2026, developers increasingly discover libraries through
                    AI coding assistants like Cursor, Claude, and Copilot.
                    Providing an MCP server and /llms.txt index ensures your API
                    is cited when developers ask their IDE for implementation
                    libraries.
                  </p>
                </div>
              </div>
            </div>

            {/* Tactical Checklist */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Execution Checklist</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Checklist: What to Prepare Before Launching a Developer Tool
                </h3>

                <div className="space-y-3 pt-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <span>
                      <strong className="text-slate-800">
                        1. A 3-line Quickstart Code Sample:
                      </strong>{" "}
                      Put an npm/pip install command and a 5-line working code
                      snippet above the fold on your homepage. Never make
                      developers read paragraphs before seeing code.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <span>
                      <strong className="text-slate-800">
                        2. Transparent Self-Serve Pricing:
                      </strong>{" "}
                      Clearly disclose whether you are Open Source, Freemium, or
                      Paid. Developers distrust "Contact Sales" buttons for
                      standard utilities.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <span>
                      <strong className="text-slate-800">
                        3. Interactive Playground or Sandbox:
                      </strong>{" "}
                      Provide a web-based sandbox (StackBlitz, CodeSandbox, or live
                      API console) so developers can test your API without
                      registering an account.
                    </span>
                  </div>

                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                    <span>
                      <strong className="text-slate-800">
                        4. Embeddable GitHub README Badges:
                      </strong>{" "}
                      Include verified LaunchNests and build badges on your GitHub
                      repository to pass backlink equity and signal active
                      production adoption.
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="rounded-2xl bg-slate-900 p-8 text-center text-white md:p-12">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                Ready to Launch Your Developer Tool on {SITE_CONFIG.name}?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300 sm:text-sm">
                Get indexed across our permanent category hubs, connect to
                verified production builds, and secure permanent Do-Follow SEO
                backlinks.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={ROUTES.SUBMIT_TOOL}
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "rounded-none bg-blue-600 text-white hover:bg-blue-500"
                  )}
                >
                  Submit Your Developer Tool
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <Link
                  href={ROUTES.DEVELOPER_TOOLS_DIRECTORY}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-none border-slate-700 bg-transparent text-white hover:bg-slate-800"
                  )}
                >
                  Explore Developer Tools Directory
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default WhereToLaunchDevtoolsGuidePage
