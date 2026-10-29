import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { getToolCategories } from "@/db/queries/categories/list"
import { getCachedToolsStats } from "@/db/queries/tools/list"
import { CategoryTable } from "@/components/categories/category-table"
import { CategoryFaqSection } from "@/components/shared/category-faqs"
import { TOOL_CATEGORY_FAQS } from "@/constants/faqs"
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
  const title = `Developer Tools Categories — APIs, Infrastructure & SDKs`
  const description = `Explore all verified developer tool categories, APIs, frameworks, and infrastructure on ${SITE_CONFIG.name}. Browse ecosystem categories ranked by production builds and upvotes.`
  const canonicalUrl = `${SITE_CONFIG.url}${ROUTES.TOOL_CATEGORIES}`

  return {
    title,
    description,
    keywords: [
      "developer tools categories",
      "API categories",
      "devtools directory",
      "developer infrastructure categories",
      "software architecture categories",
      "backend as a service categories",
      "database tools directory",
      "authentication APIs list",
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

const ToolCategoriesPage = async () => {
  const [categories, stats] = await Promise.all([
    getToolCategories().catch(() => []),
    getCachedToolsStats().catch(() => ({ totalCount: 0, totalBuilds: 0 })),
  ])

  const canonicalUrl = `${SITE_CONFIG.url}${ROUTES.TOOL_CATEGORIES}`

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}${ROUTES.TOOLS}` },
    { name: "Categories", url: canonicalUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: "Developer Tools Categories",
    description:
      "Directory of developer tool categories, APIs, and infrastructure layers.",
    url: canonicalUrl,
    items: categories.map((cat) => ({
      name: `${cat.name} Developer Tools`,
      url: `${SITE_CONFIG.url}${ROUTES.TOOL_CATEGORY(cat.slug)}`,
      description: `Browse verified ${cat.name} developer tools, APIs, and building blocks.`,
    })),
  })

  const faqLd = faqSchema(TOOL_CATEGORY_FAQS)

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
                href={ROUTES.TOOLS}
                className="transition-colors hover:text-slate-900"
              >
                Tools
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
        <header className="border-b border-dashed border-border bg-linear-to-b from-indigo-50/30 via-white to-slate-50/30 px-6 py-8 md:px-8 md:py-10">
          <div className="flex max-w-3xl flex-col gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              Developer Tools Categories
            </h1>

            <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
              Explore the developer ecosystem categorized by function. Find the
              right API, SDK, database, authentication provider, or cloud
              infrastructure layer for your next build.
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
                Verified Tools
              </span>
            </div>
          </div>
        </header>

        {/* Two-Column Full-Width Dashed Categories */}
        <main className="w-full flex-1">
          <CategoryTable type="tools" categories={categories} />
          <CategoryFaqSection
            title="Tool Categories Guidelines & FAQs"
            description="Frequently asked questions about developer tool categorization, suggestions, and ranking."
            faqs={TOOL_CATEGORY_FAQS}
            theme="indigo"
          />
        </main>
      </div>
    </>
  )
}

export default ToolCategoriesPage
