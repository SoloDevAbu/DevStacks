import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { FreeToolView } from "@/components/free-tools/free-tool-view"
import { FREE_TOOLS, getFreeTool } from "@/constants/free-tools"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import {
  breadcrumbSchema,
  buildEntityGraph,
  faqSchema,
  howToSchema,
  safeJsonLd,
  webApplicationSchema,
} from "@/lib/seo/schema"
import { buildSocialMetadata } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"

interface FreeToolPageProps {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export const generateStaticParams = () =>
  FREE_TOOLS.map(({ slug }) => ({ slug }))

export const generateMetadata = async ({
  params,
}: FreeToolPageProps): Promise<Metadata> => {
  const tool = getFreeTool((await params).slug)
  if (!tool) return {}

  const url = toAbsoluteUrl(ROUTES.FREE_TOOL(tool.slug))
  return {
    title: { absolute: tool.metaTitle },
    description: tool.metaDescription,
    alternates: { canonical: url },
    ...buildSocialMetadata({
      title: tool.metaTitle,
      description: tool.metaDescription,
      url,
    }),
  }
}

const FreeToolPage = async ({ params }: FreeToolPageProps) => {
  const tool = getFreeTool((await params).slug)
  if (!tool) notFound()

  const url = toAbsoluteUrl(ROUTES.FREE_TOOL(tool.slug))
  const jsonLd = buildEntityGraph([
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Free Tools", url: toAbsoluteUrl(ROUTES.FREE_TOOLS) },
      { name: tool.name, url },
    ]),
    webApplicationSchema({
      name: tool.name,
      description: tool.metaDescription,
      url,
    }),
    howToSchema({
      name: `How to use the ${tool.name}`,
      url,
      steps: tool.howTo,
    }),
    faqSchema(tool.faqs, `${url}#faq`),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <FreeToolView tool={tool} />
    </>
  )
}

export default FreeToolPage
