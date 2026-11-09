import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  ListOrdered,
  Rocket,
  Scale,
  XCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  breadcrumbSchema,
  buildEntityGraph,
  collectionPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  COMPARISON_BIAS_NOTE,
  getAllComparisons,
} from "@/constants/comparisons"
import { COMPARISON_FACTS_CHECKED_ON } from "@/constants/comparisons/launchnests"
import {
  PRODUCT_HUNT_ALTERNATIVES,
  PRODUCT_HUNT_REFERENCE,
  ROUNDUP_CRITERIA,
} from "@/constants/comparisons/roundup"
import type { RoundupEntry } from "@/types/comparison"
import { RelatedResources } from "@/components/shared/related-resources"
import { formatLongDate } from "@/utils/date"

export const revalidate = 3600

const PAGE_PATH = ROUTES.PRODUCTHUNT_ALTERNATIVES
const PAGE_URL = `${SITE_CONFIG.url}${PAGE_PATH}`
const ALTERNATIVE_NAMES = PRODUCT_HUNT_ALTERNATIVES.map(
  ({ name }) => name
).join(", ")
const PAGE_DESCRIPTION = `${PRODUCT_HUNT_ALTERNATIVES.length} Product Hunt alternatives ranked for launching a developer tool: ${ALTERNATIVE_NAMES}. Costs, launch windows and link policies, sourced from each site.`

export const metadata: Metadata = {
  title: `Best Product Hunt Alternatives for Developer Tools (${new Date().getFullYear()})`,
  description: PAGE_DESCRIPTION,
  keywords: [
    "Product Hunt alternatives",
    "best Product Hunt alternatives",
    "sites like Product Hunt",
    "where to launch developer tools",
    "where to launch SaaS",
    "Product Hunt competitors",
    "free product launch sites",
  ],
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: `Best Product Hunt Alternatives for Developer Tools | ${SITE_CONFIG.name}`,
    description: PAGE_DESCRIPTION,
    url: PAGE_URL,
    type: "article",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Product Hunt Alternatives | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Best Product Hunt Alternatives (${new Date().getFullYear()})`,
    description: PAGE_DESCRIPTION,
    images: [SITE_CONFIG.ogImageUrl],
  },
}

const isLaunchNests = (entry: RoundupEntry) => entry.name === SITE_CONFIG.name

const EntryAction = ({ entry }: { entry: RoundupEntry }) => {
  if (entry.comparisonPath) {
    return (
      <Link
        href={entry.comparisonPath}
        className="font-semibold text-blue-600 hover:underline"
      >
        {entry.name} vs {SITE_CONFIG.name}, with sources →
      </Link>
    )
  }
  return (
    <Link
      href={ROUTES.SUBMIT}
      className="font-semibold text-blue-600 hover:underline"
    >
      Launch on {SITE_CONFIG.name} →
    </Link>
  )
}

const EntryCard = ({ entry, rank }: { entry: RoundupEntry; rank?: number }) => (
  <article className="flex flex-col justify-between rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {rank && (
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-900 font-mono text-xs font-bold text-white">
              {rank}
            </span>
          )}
          <div>
            <h3 className="text-lg font-bold text-slate-900">{entry.name}</h3>
            <p className="text-xs text-slate-500">Best for: {entry.bestFor}</p>
          </div>
        </div>
        <Badge variant="outline" className="shrink-0 text-xs">
          {entry.cost}
        </Badge>
      </div>

      <p className="text-sm leading-relaxed text-slate-700">{entry.verdict}</p>

      <dl className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <dt className="font-semibold text-slate-800">Launch window</dt>
          <dd className="text-slate-600">{entry.launchWindow}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Free dofollow link</dt>
          <dd className="text-slate-600">{entry.freeLink}</dd>
        </div>
      </dl>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-800">Strengths</span>
        <ul className="space-y-1 text-xs text-slate-600">
          {entry.strengths.map((strength) => (
            <li key={strength} className="flex items-start gap-1.5">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold text-slate-800">
          Limitations
        </span>
        <ul className="space-y-1 text-xs text-slate-600">
          {entry.limitations.map((limitation) => (
            <li key={limitation} className="flex items-start gap-1.5">
              <XCircle className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
              <span>{limitation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

    <div className="mt-6 border-t border-dashed border-slate-100 pt-4 text-xs">
      <EntryAction entry={entry} />
    </div>
  </article>
)

const ProductHuntAlternativesPage = () => {
  const currentYear = new Date().getFullYear()
  const tableRows = [PRODUCT_HUNT_REFERENCE, ...PRODUCT_HUNT_ALTERNATIVES]

  const unifiedLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Product Hunt Alternatives", url: PAGE_URL },
    ]),
    collectionPageSchema({
      name: `Best Product Hunt Alternatives for Developer Tools (${currentYear})`,
      description: PAGE_DESCRIPTION,
      url: PAGE_URL,
      items: PRODUCT_HUNT_ALTERNATIVES.map((entry) => ({
        name: entry.name,
        url: entry.websiteUrl,
        description: `Best for: ${entry.bestFor}`,
      })),
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedLd) }}
      />

      <div className="flex min-h-screen flex-col bg-white">
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
                Product Hunt Alternatives
              </span>
            </li>
          </ol>
        </nav>

        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Scale className="size-4 text-blue-600" />
              <span>Launch platform guide ({currentYear})</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-5xl">
              The Best Product Hunt Alternatives for Developer Tools
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Product Hunt is still the biggest place to launch, but a launch
              there lasts one day and its team decides which launches are
              featured. Most founders also list on smaller sites. Below are{" "}
              {PRODUCT_HUNT_ALTERNATIVES.length} of them, ranked for launching a
              developer tool, with what each costs, how long a launch lasts and
              whether a free listing gets a dofollow link.
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
              <span>
                Facts checked {formatLongDate(COMPARISON_FACTS_CHECKED_ON)}
              </span>
              <span>•</span>
              <span>Written by the {SITE_CONFIG.name} team</span>
              <span>•</span>
              <span>{COMPARISON_BIAS_NOTE}</span>
            </div>
          </div>
        </header>

        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-8 md:px-8">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-base font-bold text-slate-900 sm:text-xl">
              At a glance
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Product Hunt is included for reference. Prices and rules come from
              each site&apos;s own pages; the comparison guides link to them.
            </p>
          </div>

          <div className="rounded-lg border border-dashed border-border bg-white shadow-2xs">
            <Table className="text-xs sm:text-sm">
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead>Best for</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Launch window</TableHead>
                  <TableHead>Free dofollow link</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableRows.map((entry) => (
                  <TableRow
                    key={entry.name}
                    className={
                      isLaunchNests(entry) ? "bg-blue-50/40" : undefined
                    }
                  >
                    <TableCell className="font-semibold text-slate-900">
                      {entry.comparisonPath ? (
                        <Link
                          href={entry.comparisonPath}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {entry.name}
                        </Link>
                      ) : (
                        entry.name
                      )}
                    </TableCell>
                    <TableCell className="text-xs whitespace-normal text-slate-600">
                      {entry.bestFor}
                    </TableCell>
                    <TableCell className="text-xs whitespace-normal text-slate-800">
                      {entry.cost}
                    </TableCell>
                    <TableCell className="text-xs whitespace-normal text-slate-600">
                      {entry.launchWindow}
                    </TableCell>
                    <TableCell className="text-xs whitespace-normal text-slate-600">
                      {entry.freeLink}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <div className="flex-1 px-6 py-10 md:px-8">
          <div className="flex flex-col gap-10">
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <ListOrdered className="size-4 text-blue-600" />
                <span>How we ranked them</span>
              </div>
              <p className="text-sm text-slate-600">
                The order is our judgement for someone launching a developer
                tool or technical SaaS, based on:
              </p>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-600">
                {ROUNDUP_CRITERIA.map((criterion) => (
                  <li key={criterion}>{criterion}</li>
                ))}
              </ol>
              <p className="text-sm text-slate-600">
                For a consumer app or a pre-launch waitlist the order would be
                different. Audience figures are what each site reports about
                itself; we haven&apos;t audited them.
              </p>
            </section>

            <section className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                  <Rocket className="size-4 text-blue-600" />
                  <span>The ranking</span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  {PRODUCT_HUNT_ALTERNATIVES.length} Product Hunt alternatives,
                  ranked
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {PRODUCT_HUNT_ALTERNATIVES.map((entry, index) => (
                  <EntryCard key={entry.name} entry={entry} rank={index + 1} />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                For reference: Product Hunt
              </h2>
              <EntryCard entry={PRODUCT_HUNT_REFERENCE} />
            </section>

            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
                  <Layers className="size-4 text-blue-600" />
                  <span>Putting it together</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  A launch plan across several sites
                </h3>

                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Weeks before
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      Queue early
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Join Uneed&apos;s free line (50+ days out) and submit a
                      waitlist to BetaList if you&apos;re pre-launch. List on
                      LaunchNests and CodeHype, which take a couple of weeks at
                      most.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Launch week
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      DevHunt and Product Hunt
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Launch on DevHunt for the developer audience and on
                      Product Hunt for reach, on days when your audience can
                      show up.
                    </p>
                  </div>

                  <div className="rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-blue-600 uppercase">
                      Afterwards
                    </span>
                    <h4 className="mt-1 text-sm font-semibold text-slate-900">
                      Keep listings working
                    </h4>
                    <p className="mt-1 text-xs text-slate-600">
                      Keep any badges that earn you a dofollow link on your
                      site, and list the tools you&apos;re built with so tool
                      pages keep sending visitors.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <RelatedResources currentPath={PAGE_PATH} />

            <section className="border-t border-dashed border-border pt-8">
              <h3 className="mb-3 text-sm font-bold text-slate-900 sm:text-base">
                Full comparisons, with sources
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {getAllComparisons().map((comparison) => (
                  <Link
                    key={comparison.slug}
                    href={comparison.routePath}
                    className="flex items-center justify-between rounded-lg border border-dashed border-border p-3.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-blue-600"
                  >
                    <span>
                      {SITE_CONFIG.name} vs {comparison.comparedPlatformName}
                    </span>
                    <ArrowRight className="size-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductHuntAlternativesPage
