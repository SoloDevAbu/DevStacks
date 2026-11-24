import type { Metadata } from "next"
import { notFound, permanentRedirect } from "next/navigation"
import { getComparisonBySlug, getAllComparisons } from "@/constants/comparisons"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { ToolComparisonView } from "@/components/compare/tool-comparison-view"
import {
  breadcrumbSchema,
  buildEntityGraph,
  faqSchema,
  itemListSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import {
  SERP_TITLE_MAX_CHARS,
  buildSocialMetadata,
  formatMetaDescription,
} from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"
import {
  buildComparisonMetaTitle,
  buildToolComparisonFaqs,
  getAllToolComparisons,
  getComparisonTitle,
  getComparisonsForTool,
  getToolComparison,
  type ComparisonSide,
} from "@/utils/tool-comparisons"

interface ComparePageProps {
  params: Promise<{ slug: string }>
}

const RELATED_LIMIT = 8

export const revalidate = 86400

export const generateStaticParams = async () => [
  ...getAllComparisons().map(({ slug }) => ({ slug })),
  ...getAllToolComparisons().map(({ slug }) => ({ slug })),
]

const sideUrl = (side: ComparisonSide) =>
  side.catalogSlug
    ? toAbsoluteUrl(ROUTES.TOOL(side.catalogSlug))
    : side.websiteUrl

export const generateMetadata = async ({
  params,
}: ComparePageProps): Promise<Metadata> => {
  const { slug } = await params
  const lookup = getToolComparison(slug)
  if (lookup?.kind !== "found") return {}

  const { comparison } = lookup
  const year = new Date().getFullYear()
  const title = buildComparisonMetaTitle(comparison, year, SERP_TITLE_MAX_CHARS)
  const description = formatMetaDescription(
    `${getComparisonTitle(comparison)} compared on license, pricing and platforms. ${comparison.verdict}`
  )
  const canonicalUrl = toAbsoluteUrl(ROUTES.COMPARE(comparison.slug))

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    ...buildSocialMetadata({ title, description, url: canonicalUrl }),
  }
}

const ComparePage = async ({ params }: ComparePageProps) => {
  const { slug } = await params

  // Launch-platform comparisons live at their canonical /<platform>-alternative pages.
  const platformComparison = getComparisonBySlug(slug)
  if (platformComparison) {
    permanentRedirect(
      platformComparison.routePath || platformComparison.canonicalUrl
    )
  }

  const lookup = getToolComparison(slug)
  if (!lookup) notFound()
  if (lookup.kind === "redirect") permanentRedirect(ROUTES.COMPARE(lookup.slug))

  const { comparison } = lookup
  const { a, b } = comparison
  const title = getComparisonTitle(comparison)
  const pageUrl = toAbsoluteUrl(ROUTES.COMPARE(comparison.slug))
  const faqs = buildToolComparisonFaqs(comparison)
  const related = [
    ...getComparisonsForTool(a.slug),
    ...getComparisonsForTool(b.slug),
  ]
    .filter(
      (item, index, all) =>
        item.slug !== comparison.slug &&
        all.findIndex(({ slug: other }) => other === item.slug) === index
    )
    .slice(0, RELATED_LIMIT)

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Compare", url: toAbsoluteUrl(ROUTES.COMPARE_HUB) },
      { name: title, url: pageUrl },
    ]),
    itemListSchema(
      [a, b].map((side) => ({
        name: side.name,
        url: sideUrl(side),
        description: side.bestFor,
      })),
      `${pageUrl}#tools`
    ),
    faqSchema(faqs, `${pageUrl}#faq`),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <ToolComparisonView
        comparison={comparison}
        related={related}
        faqs={faqs}
        year={new Date().getFullYear()}
      />
    </>
  )
}

export default ComparePage
