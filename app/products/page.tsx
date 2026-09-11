import type { Metadata } from "next"
import { ProductsHero } from "@/components/products/products-hero"
import { collectionPageSchema, breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { getProducts, getProductsStats } from "@/db/queries/products/list"
import type { DbProduct } from "@/types/entities"
import { ProductsDirectoryContent } from "./products-content"
import type { ProductSortOption } from "@/components/products/products-filter-bar"

export const revalidate = 60

export const generateMetadata = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: ProductSortOption
  }>
}): Promise<Metadata> => {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q
  const pricing = searchParams?.pricing
  const sortBy = searchParams?.sortBy

  const filterSuffix = [
    category ? `Category: ${category}` : null,
    pricing && pricing.toLowerCase() !== "all" ? `Pricing: ${pricing}` : null,
    sortBy ? `Sorted by: ${sortBy}` : null,
  ]
    .filter(Boolean)
    .join(" • ")

  const title = category
    ? `${category} Developer Products & Software | ${SITE_CONFIG.name}`
    : q
      ? `Search "${q}" Developer Products | ${SITE_CONFIG.name}`
      : filterSuffix.length > 0
        ? `Developer Products (${filterSuffix}) | ${SITE_CONFIG.name}`
        : `Developer Products Directory — Verified Software & Tech Stacks | ${SITE_CONFIG.name}`

  const description = category
    ? `Browse developer-built products and software in the ${category} category on ${SITE_CONFIG.name}. Explore built-with tech stacks, likes, and community reviews.`
    : `Browse the complete directory of developer products, software, and tools on ${SITE_CONFIG.name}.`

  const canonicalUrl = category
    ? `${SITE_CONFIG.url}/products?category=${encodeURIComponent(category)}`
    : `${SITE_CONFIG.url}/products`

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

const ProductsPage = async (props: {
  searchParams: Promise<{
    category?: string
    q?: string
    pricing?: string
    sortBy?: ProductSortOption
  }>
}) => {
  const searchParams = await props.searchParams
  const category = searchParams?.category
  const q = searchParams?.q
  const pricing = searchParams?.pricing
  const sortBy = searchParams?.sortBy ?? "upvotes"

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Products", url: `${SITE_CONFIG.url}/products` },
  ])

  const [initialProducts, stats] = await Promise.all([
    getProducts({
      category,
      q,
      pricing: pricing && pricing.toLowerCase() !== "all" ? pricing : undefined,
      sortBy: sortBy === "upvotes" ? "likes" : sortBy,
      limit: 20,
      page: 1,
    }).catch(() => []),
    getProductsStats().catch(() => ({ totalCount: 0, totalLikes: 0 })),
  ])

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
        <ProductsHero
          heading="Products Directory"
          description={
            category
              ? `Browse all verified developer products and software tools in the ${category} category.`
              : "Browse the complete directory of developer tools, APIs, and software products."
          }
          aiPrompt={AI_PROMPTS.products}
          totalCount={stats.totalCount}
          totalLikes={stats.totalLikes}
        />

        <ProductsDirectoryContent
          key={`${category ?? "all"}-${q ?? ""}-${pricing ?? "all"}-${sortBy}`}
          initialCategory={category}
          initialQuery={q}
          initialPricing={pricing ?? "all"}
          initialSortBy={sortBy}
          initialProducts={initialProducts as DbProduct[]}
        />
      </div>
    </>
  )
}

export default ProductsPage
