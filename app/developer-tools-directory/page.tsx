import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Hammer,
  Code2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Globe,
  Layers,
  Database,
  Cpu,
  Terminal,
  Zap,
} from "lucide-react"
import {
  getCachedTools,
  getCachedToolsStats,
} from "@/db/queries/tools/list"
import { getCachedToolCategories } from "@/db/queries/categories/list"
import { ToolCard } from "@/components/shared/tool-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
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
  title: `Developer Tools Directory — Verified APIs, Infrastructure & SDKs (${new Date().getFullYear()})`,
  description:
    "Browse the comprehensive directory of verified developer tools, APIs, frameworks, and cloud infrastructure. Ranked by real production builds, community upvotes, and developer adoption.",
  keywords: [
    "developer tools directory",
    "devtools directory",
    "developer tools list",
    "best developer tools 2026",
    "api directory",
    "open source devtools",
    "submit developer tool",
    "developer infrastructure",
    "software engineering tools",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/developer-tools-directory`,
  },
  openGraph: {
    title: `Developer Tools Directory — Verified APIs & Infrastructure (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
    description:
      "Curated directory of developer tools, APIs, frameworks, and infrastructure layers with verified production builds.",
    url: `${SITE_CONFIG.url}/developer-tools-directory`,
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Developer Tools Directory | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Developer Tools Directory (${new Date().getFullYear()})`,
    description:
      "Curated directory of developer tools, APIs, frameworks, and infrastructure.",
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const DeveloperToolsDirectoryPage = async () => {
  const currentYear = new Date().getFullYear()

  const [tools, stats, categories] = await Promise.all([
    getCachedTools({ limit: 12, sortBy: "builds" }),
    getCachedToolsStats(),
    getCachedToolCategories(),
  ])

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Developer Tools Directory",
      url: `${SITE_CONFIG.url}/developer-tools-directory`,
    },
  ])

  const collectionLd = collectionPageSchema({
    name: `Curated Developer Tools Directory (${currentYear})`,
    description: `Directory of verified developer tools, APIs, and infrastructure layers ranked by verified production builds.`,
    url: `${SITE_CONFIG.url}/developer-tools-directory`,
    items: tools.map((t) => ({
      name: t.name,
      url: `${SITE_CONFIG.url}/tools/${t.slug}`,
      description: t.tagline,
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
                Developer Tools Directory
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Hammer className="size-4 text-blue-600" />
              <span>Building Blocks & Infrastructure ({currentYear})</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Developer Tools Directory — APIs, Infrastructure & SDKs
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Discover verified developer building blocks, backend
              infrastructure, databases, and AI frameworks. Every tool in the{" "}
              <strong className="font-semibold text-slate-800">
                {SITE_CONFIG.name} Developer Tools Directory
              </strong>{" "}
              is transparently ranked by real-world production adoption,
              community upvotes, and live apps built with its SDK.
            </p>

            {/* Live Metrics Row */}
            <div className="mt-2 flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-700">
              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Code2 className="mr-1.5 size-3.5 text-blue-600" />
                {stats.totalCount} Verified Developer Tools
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Hammer className="mr-1.5 size-3.5 text-emerald-600" />
                {stats.totalBuilds.toLocaleString()} Production Builds
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Layers className="mr-1.5 size-3.5 text-indigo-600" />
                {categories.length} Technical Categories
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Terminal className="mr-1.5 size-3.5 text-purple-600" />
                AI Agent Ready (MCP / /llms.txt)
              </Badge>
            </div>

            {/* CTA Group */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={ROUTES.SUBMIT_TOOL} className={cn(buttonVariants({ variant: "default" }), "rounded-none bg-slate-900 text-white")}>
                  Submit a Developer Tool
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              <Link href={ROUTES.TOOLS} className={cn(buttonVariants({ variant: "outline" }), "rounded-none")}>Browse All Developer Tools</Link>
            </div>
          </div>
        </header>

        {/* Category Navigation Hub */}
        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-8 md:px-8">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-base font-bold text-slate-900 sm:text-xl">
              Browse Developer Tools by Technical Domain
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Explore specialized tooling across databases, authentication, AI
              models, DevOps, and frontend frameworks.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={ROUTES.TOOL_CATEGORY(cat.slug)}
                className="flex flex-col justify-between rounded-lg border border-dashed border-border bg-white p-3.5 shadow-2xs transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                <span className="text-xs font-semibold text-slate-900">
                  {cat.name}
                </span>
                <span className="mt-2 text-[11px] font-mono text-slate-500">
                  {cat.count} {cat.count === 1 ? "tool" : "tools"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Developer Tools Feed */}
        <section className="border-b border-dashed border-border bg-white">
          <div className="flex items-center justify-between border-b border-dashed border-border px-6 py-4 md:px-8">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Most Adopted Developer Tools in Production
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by verified live application builds and community developer upvotes.
              </p>
            </div>
            <Link
              href={ROUTES.TOOLS}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Full Directory ({stats.totalCount}) →
            </Link>
          </div>

          <div className="flex flex-col">
            {tools.map((tool, idx) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                index={idx}
                showMedals={false}
                showTrendingBadge={false}
              />
            ))}
          </div>
        </section>

        {/* Educational Developer Guide */}
        <main className="flex-1 px-6 py-12 md:px-8">
          <div className="flex flex-col gap-12">
            {/* The Building Blocks Taxonomy */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Cpu className="size-4 text-blue-600" />
                <span>Modern Software Architecture</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                The Core Pillars of the Modern Developer Tech Stack
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Engineering modern web and AI applications is no longer about
                building everything from scratch. It is about orchestrating
                specialized, production-grade building blocks with high developer
                ergonomics:
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
                <div className="rounded-xl border border-dashed border-border bg-white p-5">
                  <Database className="size-5 text-blue-600" />
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Databases & Storage
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Serverless Postgres, vector embeddings, and object storage
                    engineered for zero-cold-start edge querying.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-5">
                  <ShieldCheck className="size-5 text-emerald-600" />
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Auth & Security
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Drop-in session management, OAuth providers, multi-factor
                    auth, and role-based permissions (RBAC).
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-5">
                  <Sparkles className="size-5 text-purple-600" />
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    AI & Model APIs
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    LLM orchestration frameworks, prompt evaluation pipelines,
                    speech synthesis, and multimodal APIs.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-white p-5">
                  <Zap className="size-5 text-amber-600" />
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Deployment & Observability
                  </h3>
                  <p className="mt-1 text-xs text-slate-600">
                    Edge runtimes, global CDNs, real-time error tracking, and
                    structured telemetry logging.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Devtool Creators Choose LaunchNests */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
                  <Globe className="size-4 text-blue-600" />
                  <span>Distribution for Tool Creators</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Why Devtool Founders & Open Source Maintainers List on LaunchNests
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  Traditional launch sites treat developer tools like mobile
                  games or consumer gadgets. LaunchNests was built from day one
                  to respect the developer buying journey:
                </p>

                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      1. Production Proof
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      'Built With' Case Studies
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      When developers build apps with your SDK, their product
                      pages link back to your tool profile, generating automated
                      social proof.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      2. Permanent SEO Equity
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      Do-Follow Domain Backlinks
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      No no-follow tags or redirect proxies. Verified tools
                      receive clean, direct Do-Follow links passing domain
                      authority in Google search.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      3. AI Agent Search
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      Cursor & Claude Integration
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Our live Model Context Protocol (MCP) server and /llms.txt
                      ensure your API documentation is cited by coding agents.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Developer FAQ */}
            <section className="border-t border-dashed border-border pt-8">
              <div className="mb-6 flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Frequently Asked Questions About the Developer Tools Directory
                </h3>
                <p className="text-xs text-slate-600">
                  Common questions on tooling submissions, open-source criteria,
                  and tech stack verification.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    Can open-source libraries and CLIs be listed?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Yes. We actively encourage open-source projects, frameworks,
                    and developer utilities. You can tag your tool with the "Open
                    Source" pricing tier and link your GitHub repository.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    How do production builds get counted?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    When software creators submit SaaS products on LaunchNests,
                    they specify the tools and APIs used in their stack. Each
                    verified application linked increments your tool's verified
                    build count.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    What are the /alternatives/[slug] pages?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Every tool with related competitors automatically gets an
                    interactive comparison page (e.g. /alternatives/supabase),
                    comparing licensing, pricing models, and production builds.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    Is there an API or MCP server to query developer tools?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Yes. We provide a full Model Context Protocol (MCP) server
                    allowing AI development environments (Cursor, Claude Desktop,
                    Windsurf) to query tools, APIs, and stacks programmatically.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="rounded-2xl bg-slate-900 p-8 text-center text-white md:p-12">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                Building a Developer Tool, API, or Infrastructure Layer?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300 sm:text-sm">
                Get discovered by engineers actively searching for tooling. List
                your dev tool on {SITE_CONFIG.name} with free review turnaround.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={ROUTES.SUBMIT_TOOL}
                  className={cn(buttonVariants({ variant: "default" }), "rounded-none bg-blue-600 text-white hover:bg-blue-500")}
                >
                  Submit a Developer Tool
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <Link
                  href={ROUTES.PRICING}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-none border-slate-700 bg-transparent text-white hover:bg-slate-800")}
                >
                  Explore Partner Tiers
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default DeveloperToolsDirectoryPage
