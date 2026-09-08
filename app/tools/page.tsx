import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { CategoriesSearch } from "@/components/shared/categories-search"
import { collectionPageSchema, breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { getTools } from "@/db/queries/tools/list"
import type { DbTool } from "@/types/entities"
import { ToolsDirectoryContent } from "./tools-content"

export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{ category?: string; q?: string }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q

  const title = category
    ? `${category} Developer Tools, APIs & Infrastructure | ${SITE_CONFIG.name}`
    : q
      ? `Search "${q}" Developer Tools | ${SITE_CONFIG.name}`
      : `Developer Tools Directory — APIs, Infrastructure & SDKs | ${SITE_CONFIG.name}`

  const description = category
    ? `Browse verified developer tools, infrastructure, and APIs in the ${category} category on ${SITE_CONFIG.name}. Explore upvotes and products built with them.`
    : `Browse the complete directory of developer tools, APIs, and infrastructure on ${SITE_CONFIG.name}.`

  const canonicalUrl = category
    ? `${SITE_CONFIG.url}/tools?category=${encodeURIComponent(category)}`
    : `${SITE_CONFIG.url}/tools`

  return {
    title,
    description,
    keywords: category
      ? [
          category,
          `${category} devtools`,
          `${category} APIs`,
          ...SITE_CONFIG.keywords,
        ]
      : [...SITE_CONFIG.keywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: `${SITE_CONFIG.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_CONFIG.url}/twitter-image`],
    },
  }
}

const ToolsPage = async (props: {
  searchParams: Promise<{ category?: string; q?: string }>
}) => {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
  ])

  const initialTools = await getTools({
    category,
    q,
    limit: 20,
    page: 1,
  }).catch(() => [])

  const collectionJsonLd = collectionPageSchema({
    name: category ? `${category} Tools` : "Developer Tools Directory",
    description: category
      ? `Browse all verified developer tools, APIs, and infrastructure in ${category}`
      : "Browse the complete directory of developer tools, APIs, and infrastructure",
    url: category
      ? `${SITE_CONFIG.url}/tools?category=${encodeURIComponent(category)}`
      : `${SITE_CONFIG.url}/tools`,
    items: (initialTools as DbTool[]).map((t) => ({
      name: t.name,
      url: `${SITE_CONFIG.url}${ROUTES.TOOL(t.slug)}`,
      description: t.tagline,
    })),
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading={
            category
              ? `${category} Developer Tools`
              : "Developer Tools Directory"
          }
          description={
            category
              ? `Browse all verified developer tools, APIs, and infrastructure in the ${category} category.`
              : "Browse the complete directory of developer tools, APIs, and infrastructure."
          }
          aiPrompt={AI_PROMPTS.tools}
        />

        <CategoriesSearch
          baseRoute={ROUTES.TOOLS}
          selectedCategory={category}
        />

        <ToolsDirectoryContent
          key={`${category ?? "all"}-${q ?? ""}`}
          initialCategory={category}
          initialQuery={q}
          initialTools={initialTools as DbTool[]}
        />
      </div>
    </>
  )
}

export default ToolsPage
