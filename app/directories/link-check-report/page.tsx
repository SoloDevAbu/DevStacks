import type { Metadata } from "next"
import Link from "next/link"
import { CheckMethodology } from "@/components/directories/check-methodology"
import { CheckOutcomeBadge } from "@/components/directories/check-outcome-badge"
import { DirectoryStatGrid } from "@/components/directories/stat-grid"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { RelatedResources } from "@/components/shared/related-resources"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DIRECTORY_COPY,
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
import {
  summarizeDirectoryChecks,
  toPercent,
} from "@/utils/directories/summary"
import { buildSocialMetadata } from "@/utils/seo"
import {
  comparisonCategoryPill,
  comparisonH1,
  comparisonHeroWrapper,
  comparisonLeadParagraph,
  comparisonPageContainer,
  comparisonSectionSubtitle,
  comparisonSectionTitle,
  comparisonTableCard,
  comparisonTrustBar,
} from "@/utils/styles"

export const revalidate = 86400

const PAGE_PATH = ROUTES.DIRECTORIES_LINK_CHECK_REPORT
const PAGE_URL = `${SITE_CONFIG.url}${PAGE_PATH}`
const PAGE_TITLE = "Do Launch Directories Give Dofollow Links?"
const SEARCH_TITLE = "Dofollow Launch Directories: Link Check Report"
const PAGE_DESCRIPTION = `We check a real listing on ${LAUNCH_DIRECTORIES.length} launch platforms and software directories every week. Which ones give a dofollow link today, which are nofollow, and what each one claims.`

export const metadata: Metadata = {
  title: SEARCH_TITLE,
  description: PAGE_DESCRIPTION,
  keywords: [
    "dofollow launch directories",
    "dofollow directories list",
    "do startup directories give backlinks",
    "nofollow vs dofollow directory links",
    "launch directory backlinks",
  ],
  alternates: { canonical: PAGE_URL },
  ...buildSocialMetadata({
    title: SEARCH_TITLE,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
  }),
}

const KIND_ORDER = [
  DIRECTORY_KIND.LAUNCH_PLATFORM,
  DIRECTORY_KIND.SOFTWARE_DIRECTORY,
  DIRECTORY_KIND.AI_DIRECTORY,
] as const

const KIND_COLUMNS = [
  "Type",
  "Directories",
  "Free listing",
  "Dofollow",
  "Nofollow",
  "Not measured",
] as const

const POLICY_COLUMNS = [
  "Directory",
  "What the directory says",
  "Measured on a real listing",
] as const

const LinkCheckReportPage = async () => {
  const checks = await loadLatestDirectoryChecks()
  const summary = summarizeDirectoryChecks(LAUNCH_DIRECTORIES, checks)
  const measured = summary.dofollow + summary.nofollow
  const dofollowShare = toPercent(summary.dofollow, measured)

  const stats = [
    { label: "Directories tracked", value: summary.total },
    { label: "Measured on a real listing", value: measured },
    {
      label: "Dofollow share of measured",
      value: measured > 0 ? `${dofollowShare}%` : DIRECTORY_COPY.NOT_MEASURED,
    },
    { label: "Offer a free listing", value: summary.withFreeOption },
  ]

  const findings = [
    `${summary.dofollow} of the ${measured} directories we could measure gave a real listing a dofollow link (${dofollowShare}%). The other ${summary.nofollow} were nofollow.`,
    `${summary.unmeasured} of ${summary.total} could not be measured: the link is added by JavaScript, the site blocks automated checks, or there is no public sample listing.`,
    `${summary.withFreeOption} of ${summary.total} offer a free listing. Many give free listings a nofollow link and paid ones a dofollow link, so compare the measured result with the stated policy below.`,
  ]

  const kindRows = KIND_ORDER.map((kind) => ({
    kind,
    ...summarizeDirectoryChecks(
      LAUNCH_DIRECTORIES.filter((directory) => directory.kind === kind),
      checks
    ),
  }))

  const unifiedLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      {
        name: "Launch Directories",
        url: `${SITE_CONFIG.url}${ROUTES.DIRECTORIES}`,
      },
      { name: "Link Check Report", url: PAGE_URL },
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
        description: directory.statedLinkPolicy ?? directory.summary,
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
          { name: "Launch Directories", href: ROUTES.DIRECTORIES },
          { name: "Link Check Report" },
        ]}
      />

      <div className={comparisonPageContainer}>
        <header className={comparisonHeroWrapper}>
          <div className={comparisonCategoryPill}>
            <span>Link check report</span>
          </div>

          <h1 className={comparisonH1}>{PAGE_TITLE}</h1>

          <p className={comparisonLeadParagraph}>
            Directories describe their links in their own words. We check
            instead: every week our checker opens one real listing on each
            directory and reads whether its link to the product is dofollow or
            nofollow. These are the results of the latest run.
          </p>

          <div className={comparisonTrustBar}>
            {summary.lastCheckedAt ? (
              <span>
                Links checked{" "}
                {formatLongDate(summary.lastCheckedAt.toISOString())}
              </span>
            ) : (
              <span>{DIRECTORY_COPY.NOT_CHECKED}</span>
            )}
            <span>·</span>
            <span>
              Policies read {formatLongDate(DIRECTORY_FACTS_CHECKED_ON)}
            </span>
            <span>·</span>
            <Link
              href={ROUTES.DIRECTORIES}
              className="hover:text-slate-900 hover:underline"
            >
              Full directory database
            </Link>
          </div>
        </header>

        <DirectoryStatGrid stats={stats} />

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={comparisonSectionTitle}>Key findings</h2>
            <p className={comparisonSectionSubtitle}>
              Counted from the latest check of each directory.
            </p>
          </div>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {findings.map((finding) => (
              <li key={finding}>{finding}</li>
            ))}
          </ul>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={comparisonSectionTitle}>
              Results by directory type
            </h2>
            <p className={comparisonSectionSubtitle}>
              Launch platforms, software directories and AI tool directories
              counted separately.
            </p>
          </div>
          <div className={comparisonTableCard}>
            <Table containerClassName="overflow-x-auto" className="text-xs">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  {KIND_COLUMNS.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {kindRows.map((row) => (
                  <TableRow key={row.kind}>
                    <TableCell className="font-semibold text-slate-900">
                      <Link
                        href={`${ROUTES.DIRECTORIES}#${row.kind}`}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {DIRECTORY_KIND_PLURAL_LABELS[row.kind]}
                      </Link>
                    </TableCell>
                    <TableCell>{row.total}</TableCell>
                    <TableCell>{row.withFreeOption}</TableCell>
                    <TableCell>{row.dofollow}</TableCell>
                    <TableCell>{row.nofollow}</TableCell>
                    <TableCell>{row.unmeasured}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={comparisonSectionTitle}>
              Stated link policy vs measured link
            </h2>
            <p className={comparisonSectionSubtitle}>
              What each directory says about its links, next to what our checker
              found on a real listing.
            </p>
          </div>
          <div className={comparisonTableCard}>
            <Table containerClassName="overflow-x-auto" className="text-xs">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  {POLICY_COLUMNS.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {LAUNCH_DIRECTORIES.map((directory) => (
                  <TableRow key={directory.slug}>
                    <TableCell className="min-w-36 align-top font-semibold text-slate-900">
                      <Link
                        href={ROUTES.DIRECTORY(directory.slug)}
                        className="hover:text-blue-600 hover:underline"
                      >
                        {directory.name}
                      </Link>
                    </TableCell>
                    <TableCell className="min-w-64 align-top whitespace-normal text-slate-600">
                      {directory.statedLinkPolicy ?? DIRECTORY_COPY.NOT_STATED}
                    </TableCell>
                    <TableCell className="min-w-36 align-top">
                      {directory.sample ? (
                        <CheckOutcomeBadge check={checks.get(directory.slug)} />
                      ) : (
                        <span className="text-slate-500">
                          {DIRECTORY_COPY.NOT_MEASURED}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <CheckMethodology />

        <RelatedResources currentPath={PAGE_PATH} />
      </div>
    </>
  )
}

export default LinkCheckReportPage
