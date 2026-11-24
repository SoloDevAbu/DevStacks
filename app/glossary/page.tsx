import type { Metadata } from "next"
import Link from "next/link"
import { PageBreadcrumb } from "@/components/shared/page-breadcrumb"
import { PageHeader } from "@/components/shared/page-header"
import {
  GLOSSARY_CATEGORIES,
  GLOSSARY_HUB,
  GLOSSARY_TERMS,
  getGlossaryTermsByCategory,
} from "@/constants/glossary"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  breadcrumbSchema,
  buildEntityGraph,
  definedTermSetSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { buildSocialMetadata } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"
import {
  aboutSectionTitle,
  dashedLinkMeta,
  dashedLinkTitle,
  dashedRowCell,
  dashedRowGrid,
  dashedRowItem,
  mutedText,
  sectionHeaderBox,
} from "@/utils/styles"

const HUB_URL = toAbsoluteUrl(ROUTES.GLOSSARY)

export const metadata: Metadata = {
  title: GLOSSARY_HUB.title,
  description: GLOSSARY_HUB.description,
  alternates: { canonical: HUB_URL },
  ...buildSocialMetadata({
    title: GLOSSARY_HUB.title,
    description: GLOSSARY_HUB.description,
    url: HUB_URL,
  }),
}

const GlossaryHubPage = () => {
  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Glossary", url: HUB_URL },
    ]),
    definedTermSetSchema({
      name: GLOSSARY_HUB.title,
      description: GLOSSARY_HUB.description,
      url: HUB_URL,
      terms: GLOSSARY_TERMS.map((term) => ({
        name: term.term,
        description: term.shortDefinition,
        url: toAbsoluteUrl(ROUTES.GLOSSARY_TERM(term.slug)),
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
          items={[{ name: "Home", href: ROUTES.HOME }, { name: "Glossary" }]}
        />
        <PageHeader
          heading={GLOSSARY_HUB.heading}
          description={GLOSSARY_HUB.description}
        />
        {GLOSSARY_CATEGORIES.map((category) => (
          <section key={category.id} id={category.id}>
            <div className={sectionHeaderBox}>
              <h2 className={aboutSectionTitle}>{category.label}</h2>
              <p className={mutedText}>{category.description}</p>
            </div>
            <ul className={dashedRowGrid}>
              {getGlossaryTermsByCategory(category.id).map((term) => (
                <li key={term.slug} className={dashedRowCell}>
                  <Link
                    href={ROUTES.GLOSSARY_TERM(term.slug)}
                    className={dashedRowItem}
                  >
                    <h3 className={dashedLinkTitle}>{term.term}</h3>
                    <p className={dashedLinkMeta}>{term.shortDefinition}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

export default GlossaryHubPage
