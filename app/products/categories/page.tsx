import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { getProductCategories } from "@/db/queries/categories/list"
import { getCachedProductsStats } from "@/db/queries/products/list"
import { CategoryTable } from "@/components/categories/category-table"
import { CategoryFaqSection } from "@/components/shared/category-faqs"
import { PRODUCT_CATEGORY_FAQS } from "@/constants/faqs"
import {
  collectionPageSchema,
  breadcrumbSchema,
  faqSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

export const generateMetadata = async (): Promise<Metadata> => {
  const title = `Software Product Categories — SaaS, AI Apps & Platforms`
  const description = `Explore all verified software product categories, SaaS platforms, developer tools, and micro-apps on ${SITE_CONFIG.name}. Browse categories ranked by community upvotes and verified tech stacks.`
  const canonicalUrl = `${SITE_CONFIG.url}${ROUTES.PRODUCT_CATEGORIES}`

  return {
    title,
    description,
    keywords: [
      "software product categories",
      "SaaS categories",
      "AI products directory",
      "developer products categories",
      "indie hacker products",
      "micro SaaS directory",
      "web applications list",
      ...SITE_CONFIG.keywords,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}

const ProductCategoriesPage = async () => {
  const [categories, stats] = await Promise.all([
    getProductCategories().catch(() => []),
    getCachedProductsStats().catch(() => ({ totalCount: 0, totalLikes: 0 })),
  ])

  const canonicalUrl = `${SITE_CONFIG.url}${ROUTES.PRODUCT_CATEGORIES}`

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Products", url: `${SITE_CONFIG.url}${ROUTES.PRODUCTS}` },
    { name: "Categories", url: canonicalUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: "Software Product Categories",
    description:
      "Directory of software product categories, SaaS tools, and applications.",
    url: canonicalUrl,
    items: categories.map((cat) => ({
      name: `${cat.name} Software Products`,
      url: `${SITE_CONFIG.url}${ROUTES.PRODUCT_CATEGORY(cat.slug)}`,
      description: `Browse verified ${cat.name} software products, SaaS tools, and applications.`,
    })),
  })

  const faqLd = faqSchema(PRODUCT_CATEGORY_FAQS)

  const unifiedLd = buildEntityGraph([breadcrumbs, collectionLd, faqLd])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(unifiedLd) }}
      />

      <div className="flex min-h-screen flex-col bg-slate-50/40">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-white px-6 py-3 text-xs font-medium text-slate-500 md:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li className="flex items-center gap-1">
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-1 transition-colors hover:text-slate-900"
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
                className="transition-colors hover:text-slate-900"
              >
                Products
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
                Categories
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-linear-to-b from-violet-50/30 via-white to-slate-50/30 px-6 py-8 md:px-8 md:py-10">
          <div className="flex max-w-3xl flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Software Product Categories
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Explore products, SaaS applications, developer tooling, and
              micro-businesses across various industries. Discover what other
              founders are building and which tech stacks power them.
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2.5 text-xs font-medium text-slate-600">
              <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 shadow-2xs">
                <strong className="font-semibold text-slate-900">
                  {categories.length}
                </strong>{" "}
                Categories
              </span>
              <span className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-slate-700 shadow-2xs">
                <strong className="font-semibold text-slate-900">
                  {stats.totalCount}
                </strong>{" "}
                Verified Products
              </span>
            </div>
          </div>
        </header>

        {/* Two-Column Full-Width Dashed Categories */}
        <main className="w-full flex-1">
          <CategoryTable type="products" categories={categories} />
          <CategoryFaqSection
            title="Product Categories Guidelines & FAQs"
            description="Frequently asked questions about software product categorization, launching, and ranking."
            faqs={PRODUCT_CATEGORY_FAQS}
            theme="violet"
          />
        </main>
      </div>
    </>
  )
}

export default ProductCategoriesPage
