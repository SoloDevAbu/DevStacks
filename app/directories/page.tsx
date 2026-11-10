import type { Metadata } from "next"
import { CheckMethodology } from "@/components/directories/check-methodology"
import { DirectoryTable } from "@/components/directories/directory-table"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { RelatedResources } from "@/components/shared/related-resources"
import {
  DIRECTORY_CHECK_OUTCOME,
  DIRECTORY_FACTS_CHECKED_ON,
  DIRECTORY_KIND,
  DIRECTORY_KIND_PLURAL_LABELS,
} from "@/constants/directories"
import { LAUNCH_DIRECTORIES } from "@/constants/launch-directories"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { getLatestDirectoryChecks } from "@/db/queries/directories"
import {
  breadcrumbSchema,
  buildEntityGraph,
  collectionPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import type { DirectoryCheck } from "@/types/directory"
import { formatLongDate } from "@/utils/date"
import {
  comparisonCategoryPill,
  comparisonH1,
  comparisonHeroWrapper,
  comparisonLeadParagraph,
  comparisonPageContainer,
  comparisonSectionSubtitle,
  comparisonSectionTitle,
  comparisonTrustBar,
} from "@/utils/styles"

export const revalidate = 3600

const PAGE_PATH = ROUTES.DIRECTORIES
const PAGE_URL = `${SITE_CONFIG.url}${PAGE_PATH}`
const PAGE_TITLE = "Launch Directories with Verified Link Checks"
const PAGE_DESCRIPTION = `${LAUNCH_DIRECTORIES.length} launch platforms and software directories with prices, review times and a weekly machine check of whether a real listing's link is dofollow or nofollow.`

export const metadata: Metadata = {
  title: `${PAGE_TITLE} (${new Date().getFullYear()})`,
  description: PAGE_DESCRIPTION,
  keywords: [
    "launch directories",
    "dofollow directories",
    "startup directories list",
    "SaaS directories with dofollow links",
    "where to launch a startup",
    "AI tool directories",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${PAGE_TITLE} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${PAGE_TITLE} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    images: [SITE_CONFIG.ogImageUrl],
  },
}

const KIND_ORDER = [
  DIRECTORY_KIND.LAUNCH_PLATFORM,
  DIRECTORY_KIND.SOFTWARE_DIRECTORY,
  DIRECTORY_KIND.AI_DIRECTORY,
] as const

// The table may not exist yet while a deploy prerenders this page, so a failed read
// renders "not checked yet" instead of failing the build.
const loadLatestChecks = () =>
  getLatestDirectoryChecks().catch(() => new Map<string, DirectoryCheck>())

const summarizeChecks = (checks: ReadonlyMap<string, DirectoryCheck>) => {
  const results = [...checks.values()]
  const count = (outcome: DirectoryCheck["outcome"]) =>
    results.filter((check) => check.outcome === outcome).length
  const lastCheckedAt = results.reduce<Date | null>(
    (latest, { checkedAt }) =>
      !latest || checkedAt > latest ? checkedAt : latest,
    null
  )

  return {
    dofollow: count(DIRECTORY_CHECK_OUTCOME.DOFOLLOW),
    nofollow: count(DIRECTORY_CHECK_OUTCOME.NOFOLLOW),
    unmeasured:
      LAUNCH_DIRECTORIES.length -
      count(DIRECTORY_CHECK_OUTCOME.DOFOLLOW) -
      count(DIRECTORY_CHECK_OUTCOME.NOFOLLOW),
    lastCheckedAt,
  }
}

const DirectoriesPage = async () => {
  const checks = await loadLatestChecks()
  const summary = summarizeChecks(checks)
  const stats = [
    { label: "Directories", value: LAUNCH_DIRECTORIES.length },
    { label: "Dofollow on a real listing", value: summary.dofollow },
    { label: "Nofollow on a real listing", value: summary.nofollow },
    { label: "Not measured", value: summary.unmeasured },
  ]

  const unifiedLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Launch Directories", url: PAGE_URL },
    ]),
    collectionPageSchema({
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      dateModified:
        summary.lastCheckedAt ?? new Date(DIRECTORY_FACTS_CHECKED_ON),
      items: LAUNCH_DIRECTORIES.map((directory) => ({
        name: directory.name,
        url: `${SITE_CONFIG.url}${ROUTES.DIRECTORY(directory.slug)}`,
        description: directory.summary,
      })),
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedLd) }}
      />

      <PageBreadcrumb
        items={[
          { name: "Home", href: ROUTES.HOME },
          { name: "Launch Directories" },
        ]}
      />

      <div className={comparisonPageContainer}>
        <header className={comparisonHeroWrapper}>
          <div className={comparisonCategoryPill}>
            <span>Launch directory database</span>
          </div>

          <h1 className={comparisonH1}>{PAGE_TITLE}</h1>

          <p className={comparisonLeadParagraph}>
            Every directory says something about the link you get. We list what
            each one charges and how long review takes, then check a real
            listing every week to see whether its link to the product is
            dofollow or nofollow today.
          </p>

          <div className={comparisonTrustBar}>
            <span>
              Prices checked {formatLongDate(DIRECTORY_FACTS_CHECKED_ON)}
            </span>
            {summary.lastCheckedAt && (
              <>
                <span>·</span>
                <span>
                  Links checked{" "}
                  {formatLongDate(summary.lastCheckedAt.toISOString())}
                </span>
              </>
            )}
            <span>·</span>
            <span>Includes {SITE_CONFIG.name}, checked the same way</span>
          </div>
        </header>

        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl border border-dashed border-border bg-white p-4 shadow-2xs"
            >
              <dt className="text-xs text-slate-500">{label}</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {KIND_ORDER.map((kind) => {
          const directories = LAUNCH_DIRECTORIES.filter(
            (directory) => directory.kind === kind
          )
          return (
            <section key={kind} id={kind} className="flex flex-col gap-4">
              <div>
                <h2 className={comparisonSectionTitle}>
                  {DIRECTORY_KIND_PLURAL_LABELS[kind]} ({directories.length})
                </h2>
                <p className={comparisonSectionSubtitle}>
                  Open a directory for its sources, the sample listing we check
                  and its check history.
                </p>
              </div>
              <DirectoryTable directories={directories} checks={checks} />
            </section>
          )
        })}

        <CheckMethodology />

        <RelatedResources currentPath={PAGE_PATH} />
      </div>
    </>
  )
}

export default DirectoriesPage
