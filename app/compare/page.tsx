import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { ComparisonLinkGrid } from "@/components/shared/comparison-link-grid"
import { CURATED_ALTERNATIVES } from "@/constants/alternatives"
import { COMPARISON_AUTHOR_LABEL } from "@/constants/comparisons"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import { TOOL_COMPARISONS_HUB } from "@/constants/tool-comparisons"
import {
  breadcrumbSchema,
  buildEntityGraph,
  collectionPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { buildSocialMetadata } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"
import {
  getAllToolComparisons,
  getComparisonTitle,
  getComparisonsForTool,
} from "@/utils/tool-comparisons"
import {
  comparisonCategoryPill,
  comparisonH1,
  comparisonHeroWrapper,
  comparisonLeadParagraph,
  comparisonPageContainer,
  comparisonSectionSubtitle,
  comparisonSectionTitle,
  comparisonTrustBar,
  sectionHeaderCtaButton,
} from "@/utils/styles"

const HUB_URL = toAbsoluteUrl(ROUTES.COMPARE_HUB)

export const metadata: Metadata = {
  title: TOOL_COMPARISONS_HUB.title,
  description: TOOL_COMPARISONS_HUB.description,
  alternates: { canonical: HUB_URL },
  ...buildSocialMetadata({
    title: TOOL_COMPARISONS_HUB.title,
    description: TOOL_COMPARISONS_HUB.description,
    url: HUB_URL,
  }),
}

const CompareHubPage = () => {
  const groups = Object.values(CURATED_ALTERNATIVES)
    .map((curated) => ({
      curated,
      comparisons: getComparisonsForTool(curated.toolSlug),
    }))
    .filter(({ comparisons }) => comparisons.length > 0)

  const allComparisons = getAllToolComparisons()
  const comparisonCount = allComparisons.length

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Compare", url: HUB_URL },
    ]),
    collectionPageSchema({
      name: TOOL_COMPARISONS_HUB.title,
      description: TOOL_COMPARISONS_HUB.description,
      url: HUB_URL,
      items: allComparisons.map((comparison) => ({
        name: getComparisonTitle(comparison),
        url: toAbsoluteUrl(ROUTES.COMPARE(comparison.slug)),
        description: comparison.verdict,
      })),
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="flex w-full flex-col overflow-x-clip bg-white">
        <PageBreadcrumb
          items={[{ name: "Home", href: ROUTES.HOME }, { name: "Compare" }]}
        />
        <div className={comparisonPageContainer}>
          <header className={comparisonHeroWrapper}>
            <span className={comparisonCategoryPill}>Hand-checked facts</span>
            <h1 className={comparisonH1}>{TOOL_COMPARISONS_HUB.heading}</h1>
            <p className={comparisonLeadParagraph}>
              {TOOL_COMPARISONS_HUB.description}
            </p>
            <div className={comparisonTrustBar}>
              <span>{comparisonCount} comparisons</span>
              <span aria-hidden="true">·</span>
              <span>{groups.length} tools</span>
              <span aria-hidden="true">·</span>
              <span>{COMPARISON_AUTHOR_LABEL}</span>
            </div>
            <div className="mt-3 w-full max-w-xl">
              <AskAiBar
                prompt="Help me choose between popular developer tools. Which comparisons matter most for a new project?"
                label="ASK AI ABOUT DEVELOPER TOOLS"
                align="center"
              />
            </div>
          </header>

          {groups.map(({ curated, comparisons }) => (
            <section
              key={curated.toolSlug}
              id={curated.toolSlug}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className={comparisonSectionTitle}>
                    {curated.toolName} comparisons
                  </h2>
                  <p className={comparisonSectionSubtitle}>
                    {curated.toolName} compared head to head with{" "}
                    {comparisons.length} alternatives.
                  </p>
                </div>
                <Link
                  href={ROUTES.ALTERNATIVES(curated.toolSlug)}
                  className={sectionHeaderCtaButton}
                >
                  All {curated.toolName} alternatives{" "}
                  <span className="text-slate-400" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
              <ComparisonLinkGrid comparisons={comparisons} />
            </section>
          ))}
        </div>
      </div>
    </>
  )
}

export default CompareHubPage
