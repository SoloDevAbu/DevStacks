import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { GlossaryTermView } from "@/components/glossary/glossary-term-view"
import {
  GLOSSARY_HUB,
  GLOSSARY_TERMS,
  getGlossaryCategory,
  getGlossaryTerm,
  getRelatedGlossaryTerms,
} from "@/constants/glossary"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  breadcrumbSchema,
  buildEntityGraph,
  definedTermSchema,
  faqSchema,
  safeJsonLd,
} from "@/lib/seo/schema"
import { buildGlossaryMetaTitle } from "@/utils/glossary"
import { buildSocialMetadata, formatMetaDescription } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"

interface GlossaryTermPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export const generateStaticParams = () =>
  GLOSSARY_TERMS.map(({ slug }) => ({ slug }))

export const generateMetadata = async ({
  params,
}: GlossaryTermPageProps): Promise<Metadata> => {
  const { slug } = await params
  const term = getGlossaryTerm(slug)
  if (!term) return {}

  const title = buildGlossaryMetaTitle(term)
  const description = formatMetaDescription(term.shortDefinition)
  const url = toAbsoluteUrl(ROUTES.GLOSSARY_TERM(term.slug))

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    ...buildSocialMetadata({ title, description, url }),
  }
}

const GlossaryTermPage = async ({ params }: GlossaryTermPageProps) => {
  const { slug } = await params
  const term = getGlossaryTerm(slug)
  if (!term) notFound()

  const url = toAbsoluteUrl(ROUTES.GLOSSARY_TERM(term.slug))
  const hubUrl = toAbsoluteUrl(ROUTES.GLOSSARY)

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Glossary", url: hubUrl },
      { name: term.term, url },
    ]),
    definedTermSchema({
      name: term.term,
      description: term.shortDefinition,
      url,
      alternateName: term.aliases,
      termSet: { name: GLOSSARY_HUB.title, url: hubUrl },
    }),
    faqSchema(term.faqs, `${url}#faq`),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <GlossaryTermView
        term={term}
        categoryLabel={getGlossaryCategory(term.category)?.label ?? ""}
        related={getRelatedGlossaryTerms(term)}
      />
    </>
  )
}

export default GlossaryTermPage
