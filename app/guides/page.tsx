import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import {
  GUIDE_LINKS,
  GUIDES_HUB,
  GUIDES_UPDATED_ON,
} from "@/constants/guides"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  breadcrumbSchema,
  buildEntityGraph,
  collectionPageSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { buildSocialMetadata, canonicalWithMarkdown } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"
import {
  dashedLinkMeta,
  dashedLinkTitle,
  dashedRowCell,
  dashedRowGrid,
  dashedRowItem,
} from "@/utils/styles"

const HUB_URL = toAbsoluteUrl(ROUTES.GUIDES)

export const metadata: Metadata = {
  title: GUIDES_HUB.title,
  description: GUIDES_HUB.description,
  alternates: canonicalWithMarkdown(HUB_URL),
  ...buildSocialMetadata({
    title: GUIDES_HUB.title,
    description: GUIDES_HUB.description,
    url: HUB_URL,
  }),
}

const GuidesHubPage = () => {
  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Guides", url: HUB_URL },
    ]),
    collectionPageSchema({
      name: GUIDES_HUB.title,
      description: GUIDES_HUB.description,
      url: HUB_URL,
      dateModified: new Date(GUIDES_UPDATED_ON),
      items: GUIDE_LINKS.map(({ href, title, description }) => ({
        name: title,
        url: toAbsoluteUrl(href),
        description,
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
          items={[{ name: "Home", href: ROUTES.HOME }, { name: "Guides" }]}
        />
        <PageHeader
          heading={GUIDES_HUB.heading}
          description={GUIDES_HUB.description}
        />
        <ul className={dashedRowGrid}>
          {GUIDE_LINKS.map(({ href, title, description }) => (
            <li key={href} className={dashedRowCell}>
              <Link href={href} className={dashedRowItem}>
                <h2 className={dashedLinkTitle}>{title}</h2>
                <p className={dashedLinkMeta}>{description}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default GuidesHubPage
