import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { GuideView } from "@/components/guides/guide-view"
import { GUIDES, getGuide } from "@/constants/guides"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  breadcrumbSchema,
  buildEntityGraph,
  faqSchema,
  safeJsonLd,
  techArticleSchema,
} from "@/lib/seo/schema"
import { getGuideUrl } from "@/utils/guides"
import { buildSocialMetadata, canonicalWithMarkdown } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export const generateStaticParams = () => GUIDES.map(({ slug }) => ({ slug }))

export const generateMetadata = async ({
  params,
}: GuidePageProps): Promise<Metadata> => {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) return {}

  const url = getGuideUrl(guide)

  return {
    title: { absolute: guide.metaTitle },
    description: guide.description,
    keywords: [...guide.keywords],
    alternates: canonicalWithMarkdown(url),
    ...buildSocialMetadata({
      title: guide.metaTitle,
      description: guide.description,
      url,
    }),
  }
}

const GuidePage = async ({ params }: GuidePageProps) => {
  const { slug } = await params
  const guide = getGuide(slug)
  if (!guide) notFound()

  const url = getGuideUrl(guide)

  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Guides", url: toAbsoluteUrl(ROUTES.GUIDES) },
      { name: guide.title, url },
    ]),
    techArticleSchema({
      title: guide.title,
      description: guide.description,
      url,
      publishedAt: new Date(guide.publishedOn),
      updatedAt: new Date(guide.updatedOn),
      keywords: [...guide.keywords],
      byFounder: true,
    }),
    faqSchema(guide.faqs, `${url}#faq`),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <GuideView guide={guide} />
    </>
  )
}

export default GuidePage
