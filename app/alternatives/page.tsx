import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import {
  ALTERNATIVES_HUB,
  CURATED_ALTERNATIVES,
} from "@/constants/alternatives"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  breadcrumbSchema,
  buildEntityGraph,
  collectionPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { buildSocialMetadata } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"
import { shortAlternativeName } from "@/utils/alternatives"
import {
  aboutSectionBlock,
  aboutSectionTitle,
  inlineTextLink,
  proseParagraph,
} from "@/utils/styles"

const HUB_URL = toAbsoluteUrl(ROUTES.ALTERNATIVES_HUB)
const PREVIEW_COUNT = 4

export const metadata: Metadata = {
  title: ALTERNATIVES_HUB.title,
  description: ALTERNATIVES_HUB.description,
  alternates: { canonical: HUB_URL },
  ...buildSocialMetadata({
    title: ALTERNATIVES_HUB.title,
    description: ALTERNATIVES_HUB.description,
    url: HUB_URL,
  }),
}

const AlternativesHubPage = () => {
  const lists = Object.values(CURATED_ALTERNATIVES).toSorted((a, b) =>
    a.toolName.localeCompare(b.toolName)
  )

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Alternatives", url: HUB_URL },
    ]),
    collectionPageSchema({
      name: ALTERNATIVES_HUB.title,
      description: ALTERNATIVES_HUB.description,
      url: HUB_URL,
      items: lists.map((curated) => ({
        name: `${curated.toolName} alternatives`,
        url: toAbsoluteUrl(ROUTES.ALTERNATIVES(curated.toolSlug)),
        description: curated.intro,
      })),
    }),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <div className="flex min-h-full flex-col bg-white">
        <PageBreadcrumb
          items={[
            { name: "Home", href: ROUTES.HOME },
            { name: "Alternatives" },
          ]}
        />
        <PageHeader
          heading={ALTERNATIVES_HUB.heading}
          description={ALTERNATIVES_HUB.description}
        />
        {lists.map((curated) => (
          <section key={curated.toolSlug} className={aboutSectionBlock}>
            <h2 className={aboutSectionTitle}>
              <Link
                href={ROUTES.ALTERNATIVES(curated.toolSlug)}
                className="hover:underline"
              >
                {curated.toolName} alternatives
              </Link>
            </h2>
            <p className={proseParagraph}>
              {curated.alternatives
                .slice(0, PREVIEW_COUNT)
                .map(({ name }) => shortAlternativeName(name))
                .join(", ")}
              {curated.alternatives.length > PREVIEW_COUNT
                ? ` and ${curated.alternatives.length - PREVIEW_COUNT} more`
                : ""}
              .
            </p>
            <Link
              href={ROUTES.ALTERNATIVES(curated.toolSlug)}
              className={inlineTextLink}
            >
              Compare {curated.alternatives.length} {curated.toolName}{" "}
              alternatives →
            </Link>
          </section>
        ))}
      </div>
    </>
  )
}

export default AlternativesHubPage
