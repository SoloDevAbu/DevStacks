import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckMethodology } from "@/components/directories/check-methodology"
import { CheckOutcomeBadge } from "@/components/directories/check-outcome-badge"
import {
  type DirectoryFact,
  DirectoryFactList,
} from "@/components/directories/directory-fact-list"
import { FactSources } from "@/components/shared/fact-sources"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import {
  DIRECTORY_CHECK_OUTCOME_META,
  DIRECTORY_COPY,
  DIRECTORY_FACTS_CHECKED_ON,
  DIRECTORY_KIND_LABELS,
  DIRECTORY_KIND_PLURAL_LABELS,
  LINK_PATH_LABELS,
} from "@/constants/directories"
import {
  LAUNCH_DIRECTORIES,
  getLaunchDirectory,
} from "@/constants/launch-directories"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { getDirectoryCheckHistory } from "@/db/queries/directories"
import { breadcrumbSchema, safeJsonLd } from "@/lib/seo/schema"
import type { DirectoryCheck, LaunchDirectory } from "@/types/directory"
import { formatLongDate } from "@/utils/date"
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
  directoryInlineLink,
  directoryLinkCard,
} from "@/utils/styles"

export const revalidate = 3600
export const dynamicParams = false

interface DirectoryPageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = () =>
  LAUNCH_DIRECTORIES.map(({ slug }) => ({ slug }))

const pageUrl = (slug: string) => `${SITE_CONFIG.url}${ROUTES.DIRECTORY(slug)}`

const formatCheckDate = (date: Date) => formatLongDate(date.toISOString())

// The table may not exist yet while a deploy prerenders these pages, so a failed read
// renders "not checked yet" instead of failing the build.
const loadHistory = (slug: string) =>
  getDirectoryCheckHistory(slug).catch((): DirectoryCheck[] => [])

const describeDirectory = (directory: LaunchDirectory) =>
  [
    `${directory.name}: ${directory.summary}`,
    directory.freeOption && `Free: ${directory.freeOption}.`,
    "Includes a weekly machine check of the link on a real listing.",
  ]
    .filter(Boolean)
    .join(" ")

export const generateMetadata = async ({
  params,
}: DirectoryPageProps): Promise<Metadata> => {
  const directory = getLaunchDirectory((await params).slug)
  if (!directory) return {}

  const title = `${directory.name}: Pricing, Review Time and Link Check`
  const description = describeDirectory(directory)
  const url = pageUrl(directory.slug)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url,
      type: "article",
      siteName: SITE_CONFIG.name,
      images: [
        { url: SITE_CONFIG.ogImageUrl, width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}

const ExternalUrl = ({ href }: { href: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer nofollow"
    className={directoryInlineLink}
  >
    {href}
  </a>
)

const measuredFacts = (
  directory: LaunchDirectory,
  check: DirectoryCheck | undefined
): DirectoryFact[] => {
  if (!directory.sample) return []

  const { listingUrl, targetUrl, note } = directory.sample
  const facts: DirectoryFact[] = [
    { label: "Sample listing", value: <ExternalUrl href={listingUrl} /> },
    { label: "Product's site", value: <ExternalUrl href={targetUrl} /> },
  ]
  if (note) facts.push({ label: "About this listing", value: note })
  if (!check) return facts

  return [
    ...facts,
    {
      label: "Result",
      value: DIRECTORY_CHECK_OUTCOME_META[check.outcome].description,
    },
    ...(check.linkPath
      ? [
          { label: "How it links", value: LINK_PATH_LABELS[check.linkPath] },
          {
            label: "rel attribute",
            value: (
              <code className="font-mono text-xs">{check.rel ?? "none"}</code>
            ),
          },
        ]
      : []),
    { label: "Checked", value: formatCheckDate(check.checkedAt) },
  ]
}

const statedFacts = (directory: LaunchDirectory): DirectoryFact[] => [
  {
    label: "Free option",
    value: directory.freeOption ?? DIRECTORY_COPY.NOT_STATED,
  },
  {
    label: "Paid options",
    value: directory.paidOptions ?? DIRECTORY_COPY.NOT_STATED,
  },
  {
    label: "Stated link policy",
    value: directory.statedLinkPolicy ?? DIRECTORY_COPY.NOT_STATED,
  },
  {
    label: "Review time",
    value: directory.reviewTime ?? DIRECTORY_COPY.NOT_STATED,
  },
]

const CheckHistory = ({ history }: { history: readonly DirectoryCheck[] }) => (
  <section className="flex flex-col gap-4">
    <div>
      <h2 className={comparisonSectionTitle}>Check history</h2>
      <p className={comparisonSectionSubtitle}>
        The most recent checks of the same sample listing, newest first.
      </p>
    </div>
    <div className={comparisonTableCard}>
      <Table containerClassName="overflow-x-auto" className="text-xs">
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>Checked</TableHead>
            <TableHead>Result</TableHead>
            <TableHead>rel</TableHead>
            <TableHead>HTTP status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((check) => (
            <TableRow key={check.checkedAt.toISOString()}>
              <TableCell>{formatCheckDate(check.checkedAt)}</TableCell>
              <TableCell>
                <CheckOutcomeBadge check={check} />
              </TableCell>
              <TableCell className="font-mono">{check.rel ?? "–"}</TableCell>
              <TableCell>{check.httpStatus ?? "–"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </section>
)

const DirectoryPage = async ({ params }: DirectoryPageProps) => {
  const directory = getLaunchDirectory((await params).slug)
  if (!directory) notFound()

  const history = await loadHistory(directory.slug)
  const latest = history[0]
  const related = LAUNCH_DIRECTORIES.filter(
    ({ kind, slug }) => kind === directory.kind && slug !== directory.slug
  )
  const kindLabel = DIRECTORY_KIND_LABELS[directory.kind]

  const breadcrumbLd = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    {
      name: "Launch Directories",
      url: `${SITE_CONFIG.url}${ROUTES.DIRECTORIES}`,
    },
    { name: directory.name, url: pageUrl(directory.slug) },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLd) }}
      />

      <PageBreadcrumb
        items={[
          { name: "Home", href: ROUTES.HOME },
          { name: "Launch Directories", href: ROUTES.DIRECTORIES },
          { name: directory.name },
        ]}
      />

      <div className={comparisonPageContainer}>
        <header className={comparisonHeroWrapper}>
          <div className={comparisonCategoryPill}>
            <span>{kindLabel}</span>
          </div>

          <h1 className={comparisonH1}>
            {directory.name}: pricing, review time and link check
          </h1>

          <p className={comparisonLeadParagraph}>{directory.summary}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <CheckOutcomeBadge check={latest} />
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a
                  href={directory.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                />
              }
              className="text-xs font-semibold"
            >
              Visit {directory.name}
              <ExternalLink className="size-3" />
            </Button>
          </div>

          <div className={comparisonTrustBar}>
            <span>
              Facts checked {formatLongDate(DIRECTORY_FACTS_CHECKED_ON)}
            </span>
            {latest && (
              <>
                <span>·</span>
                <span>Link checked {formatCheckDate(latest.checkedAt)}</span>
              </>
            )}
          </div>

          {directory.isOwnSite && (
            <p className="text-xs text-slate-500">
              This is our own site. It is listed and checked exactly like the
              others.
            </p>
          )}
        </header>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={comparisonSectionTitle}>What we measured</h2>
            <p className={comparisonSectionSubtitle}>
              {directory.sample
                ? `We download one real ${directory.name} listing about once a week and read the link it gives the product.`
                : directory.unmeasuredReason}
            </p>
          </div>
          {directory.sample && (
            <DirectoryFactList facts={measuredFacts(directory, latest)} />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className={comparisonSectionTitle}>
              What {directory.name} says
            </h2>
            <p className={comparisonSectionSubtitle}>
              From {directory.name}&apos;s own pages. Where their stated policy
              and our measurement differ, the listing we checked may be on a
              different plan, so compare both.
            </p>
          </div>
          <DirectoryFactList facts={statedFacts(directory)} />
        </section>

        {history.length > 0 && <CheckHistory history={history} />}

        {directory.comparisonPath && (
          <Link href={directory.comparisonPath} className={directoryLinkCard}>
            <span>
              Full comparison: {SITE_CONFIG.name} vs {directory.name}
            </span>
            <ArrowRight className="size-3.5 text-slate-400" />
          </Link>
        )}

        <FactSources
          platformName={directory.name}
          factsCheckedOn={DIRECTORY_FACTS_CHECKED_ON}
          sources={directory.sources}
        />

        <CheckMethodology />

        {related.length > 0 && (
          <section className="flex flex-col gap-4">
            <h2 className={comparisonSectionTitle}>
              Other {DIRECTORY_KIND_PLURAL_LABELS[directory.kind].toLowerCase()}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {related.map(({ slug, name }) => (
                <Link
                  key={slug}
                  href={ROUTES.DIRECTORY(slug)}
                  className={directoryLinkCard}
                >
                  <span>{name}</span>
                  <ArrowRight className="size-3.5 text-slate-400" />
                </Link>
              ))}
              <Link href={ROUTES.DIRECTORIES} className={directoryLinkCard}>
                <span>All launch directories</span>
                <ArrowRight className="size-3.5 text-slate-400" />
              </Link>
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export default DirectoryPage
