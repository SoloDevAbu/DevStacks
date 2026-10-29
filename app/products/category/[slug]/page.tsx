import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Layers,
  Sparkles,
  FolderGit2,
  Hammer,
  Package,
  Globe,
} from "lucide-react"
import {
  getCategoryBySlug,
  getCategoryStats,
  getProductCategories,
} from "@/db/queries/categories/list"
import { getProducts } from "@/db/queries/products/list"
import { ProductCard } from "@/components/shared/product-card"
import { CrawlableCategoryBar } from "@/components/shared/crawlable-category-bar"
import {
  collectionPageSchema,
  breadcrumbSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { Badge } from "@/components/ui/badge"

export const revalidate = 3600

type ProductCategoryPageProps = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async (
  props: ProductCategoryPageProps
): Promise<Metadata> => {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "Category Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const stats = await getCategoryStats(category.id)
  const isIndexable = stats.productCount >= 1

  const baseTitle = `${category.name} Developer Products & Software`
  const title = baseTitle
  const description = `Discover ${stats.productCount} verified ${category.name} software products, SaaS tools, and developer projects on ${SITE_CONFIG.name}. Ranked by community upvotes, reviews, and built-with architectures.`
  const canonicalUrl = `${SITE_CONFIG.url}/products/category/${category.slug}`

  return {
    title,
    description,
    keywords: [
      `${category.name} software`,
      `${category.name} SaaS`,
      `${category.name} developer tools`,
      `best ${category.name} apps`,
      ...SITE_CONFIG.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: isIndexable,
      follow: true,
    },
    openGraph: {
      title: `${baseTitle} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} Products | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${baseTitle} | ${SITE_CONFIG.name}`,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}

const CategoryProductsPage = async (props: ProductCategoryPageProps) => {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const [productsList, stats, allCategories] = await Promise.all([
    getProducts({ category: category.slug, limit: 100, sortBy: "likes" }),
    getCategoryStats(category.id),
    getProductCategories(),
  ])

  const categoryUrl = `${SITE_CONFIG.url}/products/category/${category.slug}`
  const markdownTwinUrl = `${SITE_CONFIG.url}/api/md/products/category/${category.slug}`

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Products", url: `${SITE_CONFIG.url}${ROUTES.PRODUCTS}` },
    { name: "Categories", url: `${SITE_CONFIG.url}${ROUTES.PRODUCT_CATEGORIES}` },
    { name: category.name, url: categoryUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: `${category.name} Developer Products & Software`,
    description: `Directory of verified developer products, tools, and SaaS platforms in the ${category.name} ecosystem.`,
    url: categoryUrl,
    items: productsList.map((p) => ({
      name: p.name,
      url: `${SITE_CONFIG.url}/products/${p.slug}`,
      description: p.tagline,
    })),
  })

  const unifiedLd = buildEntityGraph([breadcrumbs, collectionLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedLd) }}
      />

      <div className="flex min-h-screen flex-col bg-white">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-white px-6 py-3 text-xs font-medium text-slate-500 md:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li className="flex items-center gap-1">
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-1 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="size-3" />
                Home
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <Link
                href={ROUTES.PRODUCTS}
                className="hover:text-slate-900 transition-colors"
              >
                Products
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <Link
                href={ROUTES.PRODUCT_CATEGORIES}
                className="hover:text-slate-900 transition-colors"
              >
                Categories
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <span
                className="font-semibold text-slate-900"
                aria-current="page"
              >
                {category.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* Category Hero Header */}
        <header className="border-b border-dashed border-border bg-white px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <FolderGit2 className="size-4 text-blue-600" />
              <span>Product Category Hub</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              {category.name} Developer Products & Software
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Explore verified software products, indie SaaS applications, and
              developer tools in the{" "}
              <strong className="font-semibold text-slate-800">
                {category.name}
              </strong>{" "}
              space. Ranked transparently by community upvotes, maker reviews,
              and live tech stacks.
            </p>

            {/* Live Ecosystem Telemetry */}
            <div className="mt-2 flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-600">
              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800"
              >
                <Package className="mr-1.5 size-3.5 text-blue-600" />
                {stats.productCount} Verified{" "}
                {stats.productCount === 1 ? "Product" : "Products"}
              </Badge>

              {stats.toolCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800"
                >
                  <Hammer className="mr-1.5 size-3.5 text-emerald-600" />
                  {stats.toolCount} Building Block Tools
                </Badge>
              )}

              {stats.freeCount > 0 && (
                <Badge
                  variant="outline"
                  className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800"
                >
                  <Sparkles className="mr-1.5 size-3.5 text-amber-600" />
                  {stats.freeCount} Free / Open Source Options
                </Badge>
              )}
            </div>

            {/* Machine/Agent Discovery bar */}
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
              <Globe className="size-3 text-slate-400" />
              <span>Machine representation:</span>
              <a
                href={markdownTwinUrl}
                className="font-mono text-blue-600 hover:underline"
              >
                /api/md/products/category/{category.slug}
              </a>
            </div>
          </div>
        </header>

        {/* Crawlable Sibling Categories */}
        <div className="border-b border-dashed border-border bg-slate-50/40 px-6 py-3 md:px-8">
          <CrawlableCategoryBar
            type="products"
            categories={allCategories}
            activeCategory={category.name}
          />
        </div>

        {/* Main Category Feed */}
        <main className="flex-1">
          {productsList.length > 0 ? (
            <div className="flex flex-col">
              {productsList.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  showMedals={false}
                  showTrendingBadge={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center md:px-8">
              <FolderGit2 className="mb-3 size-10 text-slate-400" />
              <h2 className="text-base font-semibold text-slate-800">
                No products cataloged in this category yet
              </h2>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Are you building a {category.name} product or SaaS? Be the first
                to launch it on {SITE_CONFIG.name}.
              </p>
              <div className="mt-4">
                <Link
                  href={ROUTES.SUBMIT_PRODUCT}
                  className="inline-flex items-center gap-1.5 rounded-none bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Launch a {category.name} Product
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default CategoryProductsPage
