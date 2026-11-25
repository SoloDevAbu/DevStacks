import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { indexingRobots } from "@/utils/indexing"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Scale, CheckCircle2 } from "lucide-react"
import { getAlternativesPageData } from "@/lib/alternatives/page-data"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { FramedGrid } from "@/components/shared/framed-grid"
import { ToolCard } from "@/components/shared/tool-card"
import { ToolComparisonLinks } from "@/components/shared/tool-comparison-links"
import { CuratedAlternativeCard } from "@/components/alternatives/curated-alternative-card"
import { ProductLogo } from "@/components/shared/product-logo"
import {
  NOFOLLOW_LINK_REL,
  getCategoryPath,
  getFaviconUrl,
  getOutboundUrl,
  toAbsoluteUrl,
} from "@/utils/urls"
import {
  buildAlternativesTitle,
  formatFactsCheckedOn,
  getAlternativesSubject,
  isToolOpenSource,
  shortAlternativeName,
  toAbsoluteRowUrl,
} from "@/utils/alternatives"
import { buildSocialMetadata, formatMetaDescription } from "@/utils/seo"
import { Badge } from "@/components/ui/badge"
import { GaAlternativeViewTracker } from "@/components/shared/ga-alternative-view-tracker"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import {
  DEFAULT_STICK_WITH,
  DEFAULT_SWITCH_WHEN,
} from "@/constants/alternatives"
import { getAlternativesStaticParams } from "@/lib/catalog/static-params"
import { ROUTES } from "@/constants/routes"
import {
  bulletDot,
  bulletItem,
  bulletList,
  dashedCellTitle,
  dashedGrid2,
  dashedGrid3,
  dashedGridCell,
  monoLabel,
  quickAnswerBlock,
} from "@/utils/styles"

export const revalidate = 86400

const QUICK_ANSWER_PICKS = 3

export const generateStaticParams = getAlternativesStaticParams

type AlternativesPageProps = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async (
  props: AlternativesPageProps
): Promise<Metadata> => {
  const { slug } = await props.params
  const data = await getAlternativesPageData(slug)

  if (!data) {
    return {
      title: "Alternatives Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { tool, curated, rows } = data
  const currentYear = new Date().getFullYear()
  const canonicalUrl = `${SITE_CONFIG.url}/alternatives/${tool.slug}`

  const subject = getAlternativesSubject(tool.name, curated)
  const title = curated
    ? buildAlternativesTitle(subject, rows, currentYear)
    : `Top ${subject} Alternatives & Competitors (${currentYear})`
  const description = curated
    ? formatMetaDescription(
        `Alternatives to ${subject} in ${currentYear}: ${rows
          .slice(0, 4)
          .map(({ name }) => shortAlternativeName(name))
          .join(
            ", "
          )} ${rows.length > 4 ? `and ${rows.length - 4} more, ` : ""}compared on license, pricing and when to switch.`
      )
    : `Compare ${tool.name} alternatives in ${tool.category ?? "developer tools"} for ${currentYear}, ranked by community upvotes and the products built with them on ${SITE_CONFIG.name}.`

  return {
    // Curated titles name the alternatives and need the whole result width, so the brand is left off.
    title: curated ? { absolute: title } : title,
    description,
    keywords: [
      `${subject} alternatives`,
      `tools like ${subject}`,
      `best ${subject} alternatives`,
      `open source ${subject} alternative`,
      `${subject} competitors`,
      ...(tool.category ? [`${tool.category} tools`] : []),
      ...SITE_CONFIG.keywords,
    ],
    alternates: { canonical: canonicalUrl },
    // Catalog siblings share one broad category, so only hand-checked lists are worth indexing.
    robots: indexingRobots(Boolean(curated)),
    ...buildSocialMetadata({ title, description, url: canonicalUrl }),
  }
}

const AlternativesPage = async (props: AlternativesPageProps) => {
  const { slug } = await props.params
  const data = await getAlternativesPageData(slug)

  if (!data) {
    notFound()
  }

  const { tool, curated, entries, rows } = data
  const subject = getAlternativesSubject(tool.name, curated)
  const heading = curated
    ? `${rows.length} ${subject} Alternatives & Competitors`
    : `Top ${subject} Alternatives & Competitors`
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
            url: toAbsoluteUrl(getCategoryPath("tool", tool.categorySlug)),
          },
        ]
      : []),
    { name: tool.name, url: `${SITE_CONFIG.url}/tools/${tool.slug}` },
    { name: "Alternatives", url: pageUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: `${heading} (${currentYear})`,
    description: curated
      ? curated.intro
      : `Developer tools listed alongside ${tool.name} on ${SITE_CONFIG.name}, ranked by production adoption and developer upvotes.`,
    url: pageUrl,
    dateModified: curated ? new Date(curated.factsCheckedOn) : undefined,
    items: rows.map((row) => ({
      name: row.name,
      url: toAbsoluteRowUrl(row),
      description: row.description,
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
                    href={getCategoryPath("tool", tool.categorySlug)}
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
              {heading} ({currentYear})
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              {curated ? (
                <>
                  {curated.intro} License, pricing and platform facts checked on{" "}
                  {formatFactsCheckedOn(curated.factsCheckedOn)}.
                </>
              ) : (
                <>
                  Looking for an alternative to{" "}
                  <strong className="font-semibold text-slate-800">
                    {tool.name}
                  </strong>
                  ? Compare tools and APIs in the{" "}
                  <strong className="font-semibold text-slate-800">
                    {tool.category ?? "Developer Tools"}
                  </strong>{" "}
                  category, ranked by community upvotes and the products built
                  with them on LaunchNests.
                </>
              )}
            </p>

            {curated && (
              <div className={quickAnswerBlock}>
                <span className={monoLabel}>
                  Best {subject} alternatives at a glance
                </span>
                <ul className={bulletList}>
                  {curated.alternatives
                    .slice(0, QUICK_ANSWER_PICKS)
                    .map(({ name, bestFor }) => (
                      <li key={name} className={bulletItem}>
                        <span className={bulletDot} aria-hidden="true" />
                        <span>
                          <strong className="font-semibold text-slate-900">
                            {shortAlternativeName(name)}
                          </strong>
                          : {bestFor}
                        </span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Target Tool Anchor Card */}
            <div className="relative mt-4 flex flex-col gap-4 border border-dashed border-border bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
              <CornerBrackets />
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
                <span>{tool.buildsCount} builds</span>
                <span className="text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span>{tool.upvotesCount} upvotes</span>
                <Link
                  href={ROUTES.TOOL(tool.slug)}
                  className="ml-2 inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  View Profile ↗
                </Link>
              </div>
            </div>

            {/* Contextual Architecture Cross-Link Banner */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-y border-dashed border-border py-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
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
        {rows.length > 0 && (
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
                  {rows.map((row) => (
                    <tr key={row.key} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {row.isExternal ? (
                          <a
                            href={getOutboundUrl(row.href)}
                            target="_blank"
                            rel={NOFOLLOW_LINK_REL}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {row.name}
                          </a>
                        ) : (
                          <Link
                            href={row.href}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {row.name}
                          </Link>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {row.isOpenSource ? (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
                            <CheckCircle2 className="size-3" /> Open Source
                          </span>
                        ) : (
                          <span className="text-slate-500">
                            {row.licenseLabel}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {row.pricing}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {row.buildsCount === null
                          ? "—"
                          : `${row.buildsCount} builds`}
                      </td>
                      <td className="px-4 py-3">{row.upvotesCount ?? "—"}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {row.platforms}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {row.isExternal ? (
                          <a
                            href={getOutboundUrl(row.href)}
                            target="_blank"
                            rel={NOFOLLOW_LINK_REL}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Website ↗
                          </a>
                        ) : (
                          <Link
                            href={row.href}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Explore
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <ToolComparisonLinks toolSlug={tool.slug} toolName={tool.name} />

        {/* Evaluation & Decision Framework */}
        <section className="border-b border-dashed border-border bg-white px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6">
            <div>
              <span className={monoLabel}>Buyer & Developer Guide</span>
              <h2 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                How to Choose Between {tool.name} and Competitors
              </h2>
              <p className="mt-1 max-w-2xl text-xs text-slate-600 sm:text-sm">
                Selecting developer tools requires balancing developer velocity,
                vendor lock-in, and infrastructure budget. Use these three
                evaluation pillars:
              </p>
            </div>

            <FramedGrid className={dashedGrid3}>
              <div className={dashedGridCell}>
                <h3 className={dashedCellTitle}>1. Production Adoption</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {tool.name} has {tool.buildsCount} verified indie and SaaS
                  deployments recorded in {SITE_CONFIG.name}. Tools with higher
                  adoption typically offer better SDK stability and community
                  troubleshooting.
                </p>
              </div>

              <div className={dashedGridCell}>
                <h3 className={dashedCellTitle}>2. Total Cost of Ownership</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  Current pricing model:{" "}
                  <strong className="font-semibold text-slate-800">
                    {tool.pricing}
                  </strong>
                  . Compare usage-based vs seat-based pricing among competitors
                  to avoid surprise billing spikes as your user base scales.
                </p>
              </div>

              <div className={dashedGridCell}>
                <h3 className={dashedCellTitle}>3. Deployment & Licensing</h3>
                <p className="text-xs leading-relaxed text-slate-600">
                  {targetIsOpenSource
                    ? `${tool.name} is open source, allowing self-hosting and maximum code sovereignty.`
                    : `${tool.name} is proprietary/managed SaaS. Check alternatives if self-hosting or data privacy compliance is non-negotiable.`}
                </p>
              </div>
            </FramedGrid>

            {/* Quick Decision Box */}
            <FramedGrid className={dashedGrid2}>
              {[
                {
                  title: `Stick with ${tool.name} if`,
                  reasons: curated?.stickWith ?? DEFAULT_STICK_WITH,
                },
                {
                  title: "Consider switching to an alternative if",
                  reasons: curated?.switchWhen ?? DEFAULT_SWITCH_WHEN,
                },
              ].map(({ title, reasons }) => (
                <div key={title} className={dashedGridCell}>
                  <h3 className={dashedCellTitle}>{title}</h3>
                  <ul className={bulletList}>
                    {reasons.map((reason) => (
                      <li key={reason} className={bulletItem}>
                        <span className={bulletDot} aria-hidden="true" />
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </FramedGrid>
          </div>
        </section>

        {/* Detailed Alternative Cards */}
        <div className="flex-1">
          <div className="border-b border-dashed border-border px-6 py-4 md:px-8">
            <h2 className="text-sm font-bold text-slate-900 sm:text-base">
              Detailed Alternative Profiles ({entries.length})
            </h2>
          </div>

          {entries.length > 0 ? (
            <div className="flex flex-col">
              {entries.map((entry, idx) =>
                entry.kind === "catalog" ? (
                  <ToolCard
                    key={entry.tool.id}
                    tool={entry.tool}
                    index={idx}
                    showMedals={false}
                    showTrendingBadge={false}
                  />
                ) : (
                  <CuratedAlternativeCard
                    key={entry.curated.websiteUrl}
                    alternative={entry.curated}
                    index={idx}
                  />
                )
              )}
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
        </div>
      </div>
    </>
  )
}

export default AlternativesPage
