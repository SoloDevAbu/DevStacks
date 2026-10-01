import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Layers, Sparkles, FolderGit2, Hammer, Code2, Globe } from "lucide-react"
import { getCategoryBySlug, getCategoryStats, getToolCategories } from "@/db/queries/categories/list"
import { getTools } from "@/db/queries/tools/list"
import { ToolCard } from "@/components/shared/tool-card"
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
import { cn } from "@/lib/utils"

export const revalidate = 3600

type CategoryPageProps = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async (props: CategoryPageProps): Promise<Metadata> => {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: `Category Not Found — ${SITE_CONFIG.name}`,
    }
  }

  const stats = await getCategoryStats(category.id)
  const isIndexable = stats.toolCount >= 3

  const title = `${category.name} Developer Tools & APIs | ${SITE_CONFIG.name}`
  const description = `Discover ${stats.toolCount} verified ${category.name} developer tools, APIs, and infrastructure layers on ${SITE_CONFIG.name}. Ranked by community upvotes and ${stats.totalBuilds.toLocaleString()} verified production builds.`
  const canonicalUrl = `${SITE_CONFIG.url}/tools/category/${category.slug}`

  return {
    title,
    description,
    keywords: [
      `${category.name} developer tools`,
      `${category.name} APIs`,
      `${category.name} libraries`,
      `open source ${category.name}`,
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
      title,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${category.name} Developer Tools | ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}

const CategoryToolsPage = async (props: CategoryPageProps) => {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const [toolsList, stats, allCategories] = await Promise.all([
    getTools({ category: category.slug, limit: 100, sortBy: "builds" }),
    getCategoryStats(category.id),
    getToolCategories(),
  ])

  const categoryUrl = `${SITE_CONFIG.url}/tools/category/${category.slug}`
  const markdownTwinUrl = `${SITE_CONFIG.url}/api/md/tools/category/${category.slug}`

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    { name: category.name, url: categoryUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: `${category.name} Developer Tools & Infrastructure`,
    description: `Directory of developer tools, frameworks, and APIs in the ${category.name} ecosystem.`,
    url: categoryUrl,
    items: toolsList.map((t) => ({
      name: t.name,
      url: `${SITE_CONFIG.url}/tools/${t.slug}`,
      description: t.tagline,
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
                className="flex items-center gap-1 hover:text-slate-900"
              >
                <ArrowLeft className="size-3" />
                Home
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <Link href={ROUTES.TOOLS} className="hover:text-slate-900">
                Tools
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-slate-900" aria-current="page">
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
              <span>Category Hub</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
              {category.name} Developer Tools & APIs
            </h1>

            <p className="max-w-3xl text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
              Explore verified developer tools, SDKs, and infrastructure layers in the{" "}
              <strong className="font-semibold text-slate-800">{category.name}</strong>{" "}
              space. Ranked transparently by community adoption, production builds, and developer upvotes.
            </p>

            {/* Live Ecosystem Telemetry */}
            <div className="mt-2 flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-600">
              <Badge variant="outline" className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                <Code2 className="mr-1.5 size-3.5 text-blue-600" />
                {stats.toolCount} Verified {stats.toolCount === 1 ? "Tool" : "Tools"}
              </Badge>

              <Badge variant="outline" className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                <Hammer className="mr-1.5 size-3.5 text-emerald-600" />
                {stats.totalBuilds.toLocaleString()} Production Builds
              </Badge>

              {stats.openSourceCount > 0 && (
                <Badge variant="outline" className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                  <Sparkles className="mr-1.5 size-3.5 text-amber-600" />
                  {stats.openSourceCount} Open Source Options
                </Badge>
              )}

              {stats.productCount > 0 && (
                <Badge variant="outline" className="border-slate-300 bg-slate-50 px-2.5 py-1 text-slate-800">
                  <Layers className="mr-1.5 size-3.5 text-indigo-600" />
                  {stats.productCount} Associated SaaS Products
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
                /api/md/tools/category/{category.slug}
              </a>
            </div>
          </div>
        </header>

        {/* Crawlable Sibling Categories */}
        <div className="border-b border-dashed border-border bg-slate-50/40 px-6 py-3 md:px-8">
          <CrawlableCategoryBar
            type="tools"
            categories={allCategories}
            activeCategory={category.name}
          />
        </div>

        {/* Main Category Feed */}
        <main className="flex-1">
          {toolsList.length > 0 ? (
            <div className="flex flex-col">
              {toolsList.map((tool, idx) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
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
                No tools cataloged in this category yet
              </h2>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Are you building a {category.name} tool or API? Be the first to showcase it on {SITE_CONFIG.name}.
              </p>
              <div className="mt-4">
                <Link
                  href={ROUTES.SUBMIT_TOOL}
                  className="inline-flex items-center gap-1.5 rounded-none bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Submit a {category.name} Tool
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default CategoryToolsPage
