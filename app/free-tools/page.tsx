import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import { FREE_TOOLS, FREE_TOOLS_HUB } from "@/constants/free-tools"
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
import {
  dashedLinkMeta,
  dashedLinkTitle,
  dashedRowCell,
  dashedRowGrid,
  dashedRowItem,
} from "@/utils/styles"

const HUB_URL = toAbsoluteUrl(ROUTES.FREE_TOOLS)

export const metadata: Metadata = {
  title: FREE_TOOLS_HUB.title,
  description: FREE_TOOLS_HUB.description,
  alternates: { canonical: HUB_URL },
  ...buildSocialMetadata({
    title: FREE_TOOLS_HUB.title,
    description: FREE_TOOLS_HUB.description,
    url: HUB_URL,
  }),
}

const FreeToolsHubPage = () => {
  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Free Tools", url: HUB_URL },
    ]),
    collectionPageSchema({
      name: FREE_TOOLS_HUB.title,
      description: FREE_TOOLS_HUB.description,
      url: HUB_URL,
      items: FREE_TOOLS.map((tool) => ({
        name: tool.name,
        url: toAbsoluteUrl(ROUTES.FREE_TOOL(tool.slug)),
        description: tool.cardDescription,
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
          items={[{ name: "Home", href: ROUTES.HOME }, { name: "Free Tools" }]}
        />
        <PageHeader
          heading={FREE_TOOLS_HUB.heading}
          description={FREE_TOOLS_HUB.description}
        />
        <ul className={dashedRowGrid}>
          {FREE_TOOLS.map((tool) => (
            <li key={tool.slug} className={dashedRowCell}>
              <Link
                href={ROUTES.FREE_TOOL(tool.slug)}
                className={dashedRowItem}
              >
                <h2 className={dashedLinkTitle}>{tool.name} →</h2>
                <p className={dashedLinkMeta}>{tool.cardDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default FreeToolsHubPage
