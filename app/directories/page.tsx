import type { Metadata } from "next"
import { CheckMethodology } from "@/components/directories/check-methodology"
import { DirectoryTable } from "@/components/directories/directory-table"
import { DirectoryStatGrid } from "@/components/directories/stat-grid"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { RelatedResources } from "@/components/shared/related-resources"
import {
  DIRECTORY_FACTS_CHECKED_ON,
  DIRECTORY_KIND,
  DIRECTORY_KIND_PLURAL_LABELS,
} from "@/constants/directories"
import { LAUNCH_DIRECTORIES } from "@/constants/launch-directories"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { loadLatestDirectoryChecks } from "@/lib/directories/latest-checks"
import {
  breadcrumbSchema,
  buildEntityGraph,
  collectionPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { formatLongDate } from "@/utils/date"
import { summarizeDirectoryChecks } from "@/utils/directories/summary"
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

export const revalidate = 86400

const PAGE_PATH = ROUTES.DIRECTORIES
const PAGE_URL = `${SITE_CONFIG.url}${PAGE_PATH}`
const PAGE_TITLE = "Launch Directories with Verified Link Checks"
const PAGE_DESCRIPTION = `${LAUNCH_DIRECTORIES.length} launch platforms and software directories with prices, review times and a weekly machine check of whether a real listing's link is dofollow or nofollow.`

// The H1 keeps the page's own name; the result title targets how founders search for the list.
const SEARCH_TITLE = `Free Startup & SaaS Launch Directories (${new Date().getFullYear()})`

export const metadata: Metadata = {
  title: SEARCH_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "startup launch directories",
    "free SaaS directories",
    "free startup directories",
    "launch directories",
    "dofollow directories",
    "startup directories list",
    "SaaS directories with dofollow links",
    "where to launch a startup",
    "AI tool directories",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `${SEARCH_TITLE} | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${SEARCH_TITLE} | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SEARCH_TITLE,
    description: PAGE_DESCRIPTION,
    images: [SITE_CONFIG.ogImageUrl],
  },
}

const KIND_ORDER = [
  DIRECTORY_KIND.LAUNCH_PLATFORM,
  DIRECTORY_KIND.SOFTWARE_DIRECTORY,
  DIRECTORY_KIND.AI_DIRECTORY,
] as const

const DirectoriesPage = async () => {
  const checks = await loadLatestDirectoryChecks()
  const summary = summarizeDirectoryChecks(LAUNCH_DIRECTORIES, checks)
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

        <DirectoryStatGrid stats={stats} />

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
