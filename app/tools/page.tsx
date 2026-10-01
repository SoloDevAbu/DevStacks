import type { Metadata } from "next"
import { ToolsHero } from "@/components/tools/tools-hero"
import {
  collectionPageSchema,
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { getTools, getToolsStats } from "@/db/queries/tools/list"
import { getToolCategories } from "@/db/queries/categories/list"
import type { DbTool } from "@/types/entities"
import { ToolsDirectoryContent } from "./tools-content"
import type { SortOption } from "@/components/tools/tools-filter-bar"
import { CrawlablePagination } from "@/components/shared/crawlable-pagination"
import { CrawlableCategoryBar } from "@/components/shared/crawlable-category-bar"

export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: SortOption
    page?: string
  }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q
  const pricing = searchParams?.pricing
  const sortBy = searchParams?.sortBy
  const pageStr = searchParams?.page
  const parsedPage = pageStr ? parseInt(pageStr, 10) : 1
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1

  const filterSuffix = [
    category ? `Category: ${category}` : null,
    pricing && pricing.toLowerCase() !== "all" ? `Pricing: ${pricing}` : null,
    sortBy ? `Sorted by: ${sortBy}` : null,
    currentPage > 1 ? `Page ${currentPage}` : null,
  ]
    .filter(Boolean)
    .join(" • ")

  const baseTitle = category
    ? `${category} Developer Tools, APIs & Infrastructure${currentPage > 1 ? ` (Page ${currentPage})` : ""}`
    : q
      ? `Search "${q}" Developer Tools`
      : filterSuffix.length > 0
        ? `Developer Tools (${filterSuffix})`
        : `Developer Tools Directory — APIs, Infrastructure & SDKs`

  const title = baseTitle

  const description = category
    ? `Browse verified developer tools, infrastructure, and APIs in the ${category} category on ${SITE_CONFIG.name}. Explore upvotes and products built with them.`
    : `Browse the complete directory of developer tools, APIs, and infrastructure on ${SITE_CONFIG.name}.`

  const cleanCategory = category?.trim()
  const hasSearchQuery = Boolean(q && q.trim())

  let canonicalUrl = `${SITE_CONFIG.url}/tools`
  if (cleanCategory) {
    canonicalUrl = `${SITE_CONFIG.url}/tools?category=${encodeURIComponent(cleanCategory)}`
    if (currentPage > 1) {
      canonicalUrl += `&page=${currentPage}`
    }
  } else if (currentPage > 1) {
    canonicalUrl = `${SITE_CONFIG.url}/tools?page=${currentPage}`
  }

  const ogImageUrl = SITE_CONFIG.ogImageUrl

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
    robots: hasSearchQuery
      ? {
          index: false,
          follow: true,
        }
      : undefined,
    openGraph: {
      title: `${baseTitle} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${baseTitle} | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} | ${SITE_CONFIG.name}`,
      description,
      images: [ogImageUrl],
    },
  }
}

const ToolsPage = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: SortOption
    page?: string
  }>
}) => {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q
  const pricing = searchParams?.pricing
  const sortBy = searchParams?.sortBy ?? "upvotes"
  const pageStr = searchParams?.page
  const parsedPage = pageStr ? parseInt(pageStr, 10) : 1
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 1 ? parsedPage : 1
  const pageSize = 20

  const breadcrumbItems = [
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
  ]
  if (category) {
    breadcrumbItems.push({
      name: `${category} Tools`,
      url: `${SITE_CONFIG.url}/tools?category=${encodeURIComponent(category)}`,
    })
  }
  const breadcrumbs = breadcrumbSchema(breadcrumbItems)

  const [initialTools, stats, categories] = await Promise.all([
    getTools({
      category,
      q,
      pricing: pricing && pricing.toLowerCase() !== "all" ? pricing : undefined,
      sortBy,
      limit: pageSize,
      page: currentPage,
    }).catch(() => []),
    getToolsStats().catch(() => ({ totalCount: 0, totalBuilds: 0 })),
    getToolCategories().catch(() => []),
  ])

  const totalPages = Math.ceil(stats.totalCount / pageSize)

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

  const unifiedJsonLd = buildEntityGraph([breadcrumbs, collectionJsonLd])
  const toolsList = (initialTools ?? []) as DbTool[]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedJsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <ToolsHero
          heading={
            category ? `${category} Tools & APIs` : "Developer Tools Directory"
          }
          description={
            category
              ? `Browse all verified developer tools, APIs, and infrastructure in the ${category} category.`
              : "Browse the complete directory of developer tools, APIs, and building blocks powering modern applications."
          }
          aiPrompt={AI_PROMPTS.tools}
          totalCount={stats.totalCount}
          totalBuilds={stats.totalBuilds}
        />

        <CrawlableCategoryBar
          type="tools"
          categories={categories}
          activeCategory={category}
        />

        <ToolsDirectoryContent
          key={`${category ?? "all"}-${q ?? ""}-${pricing ?? "all"}-${sortBy}-${currentPage}`}
          initialCategory={category}
          initialQuery={q}
          initialPricing={pricing ?? "all"}
          initialSortBy={sortBy}
          initialTools={toolsList}
        />

        <CrawlablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={ROUTES.TOOLS}
          params={{
            category,
            pricing:
              pricing && pricing.toLowerCase() !== "all" ? pricing : undefined,
            sortBy: sortBy !== "upvotes" ? sortBy : undefined,
          }}
        />
      </div>
    </>
  )
}

export default ToolsPage
