import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Scale,
  Sparkles,
  DollarSign,
  Hammer,
  ThumbsUp,
  Globe,
  Layers,
  CheckCircle2,
  AlertCircle,
  Code2,
} from "lucide-react"
import { resolveTool } from "@/lib/tools/resolve-tool"
import { getRelatedTools } from "@/db/queries/tools/get"
import { ToolCard } from "@/components/shared/tool-card"
import { ProductLogo } from "@/components/shared/product-logo"
import { getFaviconUrl } from "@/utils/urls"
import { Badge } from "@/components/ui/badge"
import { GaAlternativeViewTracker } from "@/components/shared/ga-alternative-view-tracker"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

type AlternativesPageProps = {
  params: Promise<{ slug: string }>
}

const isToolOpenSource = (t: {
  githubUrl?: string | null
  tags?: string[]
}): boolean =>
  Boolean(
    t.githubUrl ||
      t.tags?.some((tag) => tag.toLowerCase().includes("open source"))
  )

export const generateMetadata = async (
  props: AlternativesPageProps
): Promise<Metadata> => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    return {
      title: "Alternatives Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const currentYear = new Date().getFullYear()
  const alternatives = tool.categoryId
    ? await getRelatedTools(tool.categoryId, tool.id, 20)
    : []

  const isIndexable = alternatives.length >= 1

  const baseTitle = `Top ${tool.name} Alternatives & Competitors (${currentYear})`
  const title = baseTitle
  const description = `Compare the best verified ${tool.name} alternatives in ${tool.category ?? "developer tools"} for ${currentYear}. Ranked by real-world production builds, pricing models, and developer upvotes on ${SITE_CONFIG.name}.`
  const canonicalUrl = `${SITE_CONFIG.url}/alternatives/${tool.slug}`

  return {
    title,
    description,
    keywords: [
      `${tool.name} alternatives`,
      `tools like ${tool.name}`,
      `best ${tool.name} alternatives`,
      `open source ${tool.name} alternative`,
      `${tool.name} competitors`,
      ...(tool.category ? [`${tool.category} tools`] : []),
      ...SITE_CONFIG.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndexable,
      follow: true,
    },
    openGraph: {
      title: `${baseTitle} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${tool.name} Alternatives | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} | ${SITE_CONFIG.name}`,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}

const AlternativesPage = async (props: AlternativesPageProps) => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    notFound()
  }

  const alternatives = tool.categoryId
    ? await getRelatedTools(tool.categoryId, tool.id, 20)
    : []

  const currentYear = new Date().getFullYear()
  const pageUrl = `${SITE_CONFIG.url}/alternatives/${tool.slug}`
  const markdownTwinUrl = `${SITE_CONFIG.url}/api/md/alternatives/${tool.slug}`
  const targetIsOpenSource = isToolOpenSource(tool)

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    ...(tool.category
      ? [
          {
            name: tool.category,
            url: `${SITE_CONFIG.url}/tools/category/${tool.categorySlug ?? encodeURIComponent(tool.category)}`,
          },
        ]
      : []),
    { name: tool.name, url: `${SITE_CONFIG.url}/tools/${tool.slug}` },
    { name: "Alternatives", url: pageUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: `Best ${tool.name} Alternatives & Competitors (${currentYear})`,
    description: `Verified developer tool alternatives to ${tool.name} ranked by production adoption and developer upvotes.`,
    url: pageUrl,
    items: alternatives.map((alt) => ({
      name: alt.name,
      url: `${SITE_CONFIG.url}/tools/${alt.slug}`,
      description: alt.tagline,
    })),
  })

  const unifiedLd = buildEntityGraph([breadcrumbs, collectionLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedLd) }}
      />

      <GaAlternativeViewTracker
        alternativeSlug={tool.slug}
        itemName={tool.name}
        category={tool.category}
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
              <Link href={ROUTES.TOOLS} className="hover:text-slate-900">
                Tools
              </Link>
            </li>
            {tool.category && (
              <>
                <li
                  className="flex items-center text-slate-400"
                  aria-hidden="true"
                >
                  <ChevronRight className="size-3" />
                </li>
                <li className="flex items-center">
                  <Link
                    href={
                      tool.categorySlug
                        ? ROUTES.TOOL_CATEGORY(tool.categorySlug)
                        : `/tools/category/${encodeURIComponent(tool.category)}`
                    }
                    className="hover:text-slate-900"
                  >
                    {tool.category}
                  </Link>
                </li>
              </>
            )}
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <Link
                href={ROUTES.TOOL(tool.slug)}
                className="hover:text-slate-900"
              >
                {tool.name}
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
                Alternatives
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
              <Scale className="size-4 text-indigo-600" />
              <span>Competitor & Alternative Guide</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Top {tool.name} Alternatives & Competitors ({currentYear})
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Looking for an alternative to{" "}
              <strong className="font-semibold text-slate-800">
                {tool.name}
              </strong>
              ? Compare verified tools and APIs in the{" "}
              <strong className="font-semibold text-slate-800">
                {tool.category ?? "Developer Tools"}
              </strong>{" "}
              category. Ranked transparently by verified production builds,
              pricing tiers, and developer upvotes.
            </p>

            {/* Target Tool Anchor Card */}
            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-dashed border-border bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <ProductLogo
                  text={tool.name.slice(0, 2).toUpperCase()}
                  imageUrl={
                    tool.logoUrl?.trim() || getFaviconUrl(tool.websiteUrl)
                  }
                  websiteUrl={tool.websiteUrl}
                  alt={tool.name}
                  bgColor="bg-slate-900"
                  textColor="text-white"
                  className="size-12 shrink-0 rounded-xl border border-slate-200 text-xl shadow-xs"
                />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Current Tool:
                    </span>
                    <Link
                      href={ROUTES.TOOL(tool.slug)}
                      className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                    >
                      {tool.name}
                    </Link>
                    <Badge variant="outline" className="text-[11px]">
                      {tool.pricing}
                    </Badge>
                    {targetIsOpenSource && (
                      <Badge
                        variant="secondary"
                        className="bg-emerald-50 text-[10px] text-emerald-700"
                      >
                        Open Source
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{tool.tagline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-1">
                  <Hammer className="size-3.5 text-blue-600" />
                  {tool.buildsCount} builds
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3.5 text-emerald-600" />
                  {tool.upvotesCount} upvotes
                </span>
                <Link
                  href={ROUTES.TOOL(tool.slug)}
                  className="ml-2 inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  View Profile ↗
                </Link>
              </div>
            </div>

            {/* Contextual Architecture Cross-Link Banner */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Layers className="size-4 text-blue-600" />
                <span>
                  Want to inspect real projects using this stack? See live tech
                  stacks in the{" "}
                  <Link
                    href={ROUTES.BUILT_WITH(tool.slug)}
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Built with {tool.name} showcase →
                  </Link>
                </span>
              </div>
              {tool.categorySlug && (
                <Link
                  href={ROUTES.TOOL_CATEGORY(tool.categorySlug)}
                  className="font-medium text-slate-500 hover:text-slate-800"
                >
                  Browse all {tool.category} tools →
                </Link>
              )}
            </div>

            {/* Machine/Agent Discovery bar */}
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
              <Globe className="size-3 text-slate-400" />
              <span>Machine representation:</span>
              <a
                href={markdownTwinUrl}
                className="font-mono text-blue-600 hover:underline"
              >
                /api/md/alternatives/{tool.slug}
              </a>
            </div>
          </div>
        </header>

        {/* Comparative Overview Table */}
        {alternatives.length > 0 && (
          <section className="border-b border-dashed border-border bg-slate-50/20 px-6 py-6 md:px-8">
            <h2 className="mb-3 text-sm font-bold tracking-tight text-slate-900 sm:text-base">
              Feature Comparison Matrix: {tool.name} vs Top Alternatives
            </h2>
            <div className="overflow-x-auto rounded-lg border border-dashed border-border bg-white shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Tool</th>
                    <th className="px-4 py-3">License</th>
                    <th className="px-4 py-3">Pricing</th>
                    <th className="px-4 py-3">Production Builds</th>
                    <th className="px-4 py-3">Upvotes</th>
                    <th className="px-4 py-3">Platforms</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-600">
                  {/* Target Tool Row */}
                  <tr className="bg-blue-50/30 font-medium">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{tool.name}</span>
                        <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                          Current
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {targetIsOpenSource ? (
                        <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                          <CheckCircle2 className="size-3" /> Open Source
                        </span>
                      ) : (
                        <span className="text-slate-500">Commercial</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {tool.pricing}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {tool.buildsCount} builds
                    </td>
                    <td className="px-4 py-3">{tool.upvotesCount}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {(tool.platforms ?? []).join(", ") || "Web / Cloud"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={ROUTES.TOOL(tool.slug)}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Profile
                      </Link>
                    </td>
                  </tr>

                  {/* Alternative Tools Rows */}
                  {alternatives.map((alt) => {
                    const altIsOpenSource = isToolOpenSource(alt)
                    return (
                      <tr key={alt.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <Link
                            href={ROUTES.TOOL(alt.slug)}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {alt.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          {altIsOpenSource ? (
                            <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                              <CheckCircle2 className="size-3" /> Open Source
                            </span>
                          ) : (
                            <span className="text-slate-500">Commercial</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {alt.pricing}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {alt.buildsCount} builds
                        </td>
                        <td className="px-4 py-3">{alt.upvotesCount}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {(alt.platforms ?? []).join(", ") || "Web / Cloud"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link
                            href={ROUTES.TOOL(alt.slug)}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Explore
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Evaluation & Decision Framework */}
        <section className="border-b border-dashed border-border bg-white px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <Code2 className="size-4 text-slate-600" />
                <span>Buyer & Developer Guide</span>
              </div>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                How to Choose Between {tool.name} and Competitors
              </h2>
              <p className="mt-1 max-w-2xl text-xs text-slate-600 sm:text-sm">
                Selecting developer tools requires balancing developer velocity,
                vendor lock-in, and infrastructure budget. Use these three
                evaluation pillars:
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-dashed border-border bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Hammer className="size-4 text-blue-600" />
                  <span>1. Production Adoption</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {tool.name} has {tool.buildsCount} verified indie and SaaS
                  deployments recorded in {SITE_CONFIG.name}. Tools with higher
                  adoption typically offer better SDK stability and community
                  troubleshooting.
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <DollarSign className="size-4 text-emerald-600" />
                  <span>2. Total Cost of Ownership</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  Current pricing model:{" "}
                  <strong className="font-semibold text-slate-800">
                    {tool.pricing}
                  </strong>
                  . Compare usage-based vs seat-based pricing among competitors
                  to avoid surprise billing spikes as your user base scales.
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-slate-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Sparkles className="size-4 text-indigo-600" />
                  <span>3. Deployment & Licensing</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {targetIsOpenSource
                    ? `${tool.name} is open source, allowing self-hosting and maximum code sovereignty.`
                    : `${tool.name} is proprietary/managed SaaS. Check alternatives if self-hosting or data privacy compliance is non-negotiable.`}
                </p>
              </div>
            </div>

            {/* Quick Decision Box */}
            <div className="grid grid-cols-1 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  <span>Stick with {tool.name} if:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li>
                    • Your tech stack is already integrated with its APIs and
                    SDKs.
                  </li>
                  <li>
                    • Its feature roadmap aligns with your core delivery
                    velocity.
                  </li>
                  <li>
                    • You value its established community and verified
                    production track record.
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <AlertCircle className="size-4 text-amber-600" />
                  <span>Consider switching to an alternative if:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li>
                    • You require an open-source or self-hosted architecture.
                  </li>
                  <li>
                    • Alternative pricing tiers provide a cheaper runway for
                    early-stage validation.
                  </li>
                  <li>
                    • A competitor provides specialized edge or regional
                    infrastructure you need.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Alternative Cards */}
        <main className="flex-1">
          <div className="border-b border-dashed border-border px-6 py-4 md:px-8">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Detailed Alternative Profiles ({alternatives.length})
            </h2>
          </div>

          {alternatives.length > 0 ? (
            <div className="flex flex-col">
              {alternatives.map((alt, idx) => (
                <ToolCard
                  key={alt.id}
                  tool={alt}
                  index={idx}
                  showMedals={false}
                  showTrendingBadge={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center md:px-8">
              <Scale className="mb-3 size-10 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-800">
                No direct alternatives cataloged in this category yet
              </h2>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Know an alternative to {tool.name}? Submit it to help fellow
                developers compare tooling options.
              </p>
              <div className="mt-4">
                <Link
                  href={ROUTES.SUBMIT_TOOL}
                  className="inline-flex items-center gap-1.5 rounded-none bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Submit an Alternative
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default AlternativesPage
