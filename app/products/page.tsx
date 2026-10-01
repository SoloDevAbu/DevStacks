import type { Metadata } from "next"
import { ProductsHero } from "@/components/products/products-hero"
import {
  collectionPageSchema,
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { getProducts, getProductsStats } from "@/db/queries/products/list"
import { getProductCategories } from "@/db/queries/categories/list"
import type { DbProduct } from "@/types/entities"
import { ProductsDirectoryContent } from "./products-content"
import type { ProductSortOption } from "@/components/products/products-filter-bar"
import { CrawlablePagination } from "@/components/shared/crawlable-pagination"
import { CrawlableCategoryBar } from "@/components/shared/crawlable-category-bar"

export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: ProductSortOption
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
    ? `${category} Developer Products & Software${currentPage > 1 ? ` (Page ${currentPage})` : ""}`
    : q
      ? `Search "${q}" Developer Products`
      : filterSuffix.length > 0
        ? `Developer Products (${filterSuffix})`
        : `Developer Products Directory — Verified Software & Tech Stacks`

  const title = baseTitle

  const description = category
    ? `Browse developer-built products and software in the ${category} category on ${SITE_CONFIG.name}. Explore built-with tech stacks, likes, and community reviews.`
    : `Browse the complete directory of developer products, software, and tools on ${SITE_CONFIG.name}.`

  const cleanCategory = category?.trim()
  const hasSearchQuery = Boolean(q && q.trim())

  let canonicalUrl = `${SITE_CONFIG.url}/products`
  if (cleanCategory) {
    canonicalUrl = `${SITE_CONFIG.url}/products?category=${encodeURIComponent(cleanCategory)}`
    if (currentPage > 1) {
      canonicalUrl += `&page=${currentPage}`
    }
  } else if (currentPage > 1) {
    canonicalUrl = `${SITE_CONFIG.url}/products?page=${currentPage}`
  }

  const ogImageUrl = `${SITE_CONFIG.url}${SITE_CONFIG.ogImage}`

  return {
    title,
    description,
    keywords: category
      ? [
          category,
          `${category} software`,
          `${category} products`,
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

const ProductsPage = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: ProductSortOption
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
    { name: "Products", url: `${SITE_CONFIG.url}/products` },
  ]
  if (category) {
    breadcrumbItems.push({
      name: `${category} Products`,
      url: `${SITE_CONFIG.url}/products?category=${encodeURIComponent(category)}`,
    })
  }
  const breadcrumbs = breadcrumbSchema(breadcrumbItems)

  const [initialProducts, stats, categories] = await Promise.all([
    getProducts({
      category,
      q,
      pricing: pricing && pricing.toLowerCase() !== "all" ? pricing : undefined,
      sortBy: sortBy === "upvotes" ? "likes" : sortBy,
      limit: pageSize,
      page: currentPage,
    }).catch(() => []),
    getProductsStats().catch(() => ({ totalCount: 0, totalLikes: 0 })),
    getProductCategories().catch(() => []),
  ])

  const totalPages = Math.ceil(stats.totalCount / pageSize)

  const collectionJsonLd = collectionPageSchema({
    name: category ? `${category} Products` : "Products Directory",
    description: category
      ? `Browse all verified developer products and tools in ${category}`
      : "Browse the complete directory of developer tools and software products",
    url: category
      ? `${SITE_CONFIG.url}/products?category=${encodeURIComponent(category)}`
      : `${SITE_CONFIG.url}/products`,
    items: (initialProducts as DbProduct[]).map((p) => ({
      name: p.name,
      url: `${SITE_CONFIG.url}${ROUTES.PRODUCT(p.slug)}`,
      description: p.tagline,
    })),
  })

  const unifiedJsonLd = buildEntityGraph([breadcrumbs, collectionJsonLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedJsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <ProductsHero
          heading={
            category
              ? `${category} Products & Software`
              : "Developer Products Directory"
          }
          description={
            category
              ? `Browse all verified developer products and software tools in the ${category} category.`
              : "Browse the complete directory of developer tools, APIs, and software products."
          }
          aiPrompt={AI_PROMPTS.products}
          totalCount={stats.totalCount}
          totalLikes={stats.totalLikes}
        />

        <CrawlableCategoryBar
          type="products"
          categories={categories}
          activeCategory={category}
        />

        <ProductsDirectoryContent
          key={`${category ?? "all"}-${q ?? ""}-${pricing ?? "all"}-${sortBy}-${currentPage}`}
          initialCategory={category}
          initialQuery={q}
          initialPricing={pricing ?? "all"}
          initialSortBy={sortBy}
          initialProducts={initialProducts as DbProduct[]}
        />

        <CrawlablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={ROUTES.PRODUCTS}
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

export default ProductsPage
