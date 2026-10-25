import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Package,
  PlusCircle,
  Hammer,
  Sparkles,
  Globe,
  Layers,
  Scale,
  Code2,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import { resolveTool, getProductsBuiltWithTool } from "@/lib/tools/resolve-tool"
import { getRelatedTools } from "@/db/queries/tools/get"
import { ProductCard } from "@/components/shared/product-card"
import { ProductLogo } from "@/components/shared/product-logo"
import { getFaviconUrl } from "@/utils/urls"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ToolCard } from "@/components/shared/tool-card"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

type BuiltWithPageProps = {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async (
  props: BuiltWithPageProps
): Promise<Metadata> => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    return {
      title: "Showcase Not Found",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const builtWithProducts = await getProductsBuiltWithTool(
    tool.slug,
    tool.name,
    50
  )
  const isIndexable = builtWithProducts.length >= 1

  const baseTitle = `Products Built With ${tool.name} — Production Showcase`
  const title = baseTitle
  const description = `Discover ${builtWithProducts.length} verified live apps, SaaS products, and developer projects built with ${tool.name}. Explore tech stacks, maker profiles, and architectures on ${SITE_CONFIG.name}.`
  const canonicalUrl = `${SITE_CONFIG.url}/built-with/${tool.slug}`

  return {
    title,
    description,
    keywords: [
      `apps built with ${tool.name}`,
      `built with ${tool.name}`,
      `${tool.name} showcase`,
      `${tool.name} examples`,
      `${tool.name} tech stack`,
      ...(tool.category ? [`${tool.category} products`] : []),
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
          alt: `Products Built With ${tool.name} | ${SITE_CONFIG.name}`,
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

const BuiltWithPage = async (props: BuiltWithPageProps) => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    notFound()
  }

  const [builtWithProducts, relatedTools] = await Promise.all([
    getProductsBuiltWithTool(tool.slug, tool.name, 50),
    tool.categoryId
      ? getRelatedTools(tool.categoryId, tool.id, 4)
      : Promise.resolve([]),
  ])

  // Anti-thin circuit breaker: If 0 builds, redirect to the tool's main profile
  if (builtWithProducts.length === 0) {
    redirect(ROUTES.TOOL(tool.slug))
  }

  const pageUrl = `${SITE_CONFIG.url}/built-with/${tool.slug}`
  const markdownTwinUrl = `${SITE_CONFIG.url}/api/md/built-with/${tool.slug}`

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Tools", url: `${SITE_CONFIG.url}/tools` },
    ...(tool.category
      ? [
          {
            name: tool.category,
            url: `${SITE_CONFIG.url}/tools/category/${tool.categorySlug ?? encodeURIComponent(tool.category)}`,
          },
        ]
      : []),
    { name: tool.name, url: `${SITE_CONFIG.url}/tools/${tool.slug}` },
    { name: "Built With", url: pageUrl },
  ])

  const collectionLd = collectionPageSchema({
    name: `Products Built With ${tool.name}`,
    description: `Verified software and developer products utilizing ${tool.name} in production.`,
    url: pageUrl,
    items: builtWithProducts.map((p) => ({
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
            {tool.category && (
              <>
                <li
                  className="flex items-center text-slate-400"
                  aria-hidden="true"
                >
                  <ChevronRight className="size-3" />
                </li>
                <li className="flex items-center">
                  <Link
                    href={`/tools/category/${tool.categorySlug ?? encodeURIComponent(tool.category)}`}
                    className="hover:text-slate-900"
                  >
                    {tool.category}
                  </Link>
                </li>
              </>
            )}
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <Link
                href={ROUTES.TOOL(tool.slug)}
                className="hover:text-slate-900"
              >
                {tool.name}
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
                Built With
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <ProductLogo
                text={tool.name.slice(0, 2).toUpperCase()}
                imageUrl={
                  tool.logoUrl?.trim() || getFaviconUrl(tool.websiteUrl)
                }
                websiteUrl={tool.websiteUrl}
                alt={tool.name}
                bgColor="bg-slate-900"
                textColor="text-white"
                className="size-14 shrink-0 rounded-xl border border-slate-200 text-2xl shadow-xs md:size-16"
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
                  <Hammer className="size-4 text-blue-600" />
                  <span>Production Showcase</span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl">
                  Products Built With {tool.name}
                </h1>

                <p className="max-w-2xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
                  Discover live applications, SaaS platforms, and indie
                  developer projects verified to run on{" "}
                  <strong className="font-semibold text-slate-800">
                    {tool.name}
                  </strong>
                  . Inspect real-world tech stacks and production architectures.
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                  <Badge
                    variant="outline"
                    className="border-slate-300 bg-slate-50 font-semibold text-blue-600"
                  >
                    {builtWithProducts.length} Verified{" "}
                    {builtWithProducts.length === 1 ? "Product" : "Products"}
                  </Badge>

                  <Link
                    href={ROUTES.TOOL(tool.slug)}
                    className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    View {tool.name} Profile ↗
                  </Link>

                  <span className="text-slate-300">•</span>

                  <Link
                    href={`/alternatives/${tool.slug}`}
                    className="font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Compare {tool.name} Alternatives ↗
                  </Link>
                </div>
              </div>
            </div>

            <Button
              variant="default"
              size="sm"
              className="self-start rounded-none bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800 md:self-auto"
              render={<Link href={ROUTES.SHOWCASE_TOOL(tool.slug)} />}
            >
              <PlusCircle className="mr-1.5 size-3.5" />
              Submit Your Build
            </Button>
          </div>

          {/* Machine/Agent Discovery bar */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Globe className="size-3 text-slate-400" />
            <span>Machine representation:</span>
            <a
              href={markdownTwinUrl}
              className="font-mono text-blue-600 hover:underline"
            >
              /api/md/built-with/{tool.slug}
            </a>
          </div>
        </header>

        {/* Section Heading */}
        <div className="border-b border-dashed border-border bg-slate-50/50 px-6 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
              Verified Production Applications ({builtWithProducts.length})
            </h2>
            <span className="text-xs text-slate-500">
              Ranked by community likes & adoption
            </span>
          </div>
        </div>

        {/* Products List */}
        <main className="flex-1">
          <div className="flex flex-col">
            {builtWithProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                index={idx}
                showMedals={false}
                showTrendingBadge={false}
              />
            ))}
          </div>

          {/* Architectural Deep Dive Section */}
          <section className="border-t border-dashed border-border bg-slate-50/30 px-6 py-10 md:px-8 md:py-12">
            <div className="mx-auto max-w-4xl space-y-8">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
                  <Code2 className="size-4 text-blue-600" />
                  <span>Architecture Guide</span>
                </div>
                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Why Developers Choose {tool.name} for Production
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {tool.description ||
                    tool.tagline ||
                    `${tool.name} provides critical infrastructure for modern web applications and APIs.`}
                </p>
              </div>

              {(tool.problemStatement || tool.solution || tool.uniqueValue) && (
                <div className="grid gap-4 sm:grid-cols-3">
                  {tool.problemStatement && (
                    <div className="rounded-lg border border-dashed border-border bg-white p-4">
                      <h3 className="text-xs font-bold uppercase text-slate-500">
                        Problem Solved
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                        {tool.problemStatement}
                      </p>
                    </div>
                  )}
                  {tool.solution && (
                    <div className="rounded-lg border border-dashed border-border bg-white p-4">
                      <h3 className="text-xs font-bold uppercase text-slate-500">
                        Core Solution
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                        {tool.solution}
                      </p>
                    </div>
                  )}
                  {tool.uniqueValue && (
                    <div className="rounded-lg border border-dashed border-border bg-white p-4">
                      <h3 className="text-xs font-bold uppercase text-slate-500">
                        Key Differentiator
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                        {tool.uniqueValue}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Cross-Link Ecosystem Box */}
              <div className="rounded-xl border border-dashed border-border bg-white p-6 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900">
                  Explore Related Tools in {tool.category ?? "Developer Tools"}
                </h3>
                <p className="mt-1 text-xs text-slate-600">
                  Compare tooling stacks, evaluate alternative libraries, and
                  inspect competitor features.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href={`/alternatives/${tool.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-none bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                  >
                    <Scale className="size-3.5" />
                    Top {tool.name} Alternatives
                  </Link>

                  {tool.category && (
                    <Link
                      href={`/tools/category/${tool.categorySlug ?? encodeURIComponent(tool.category)}`}
                      className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      <Layers className="size-3.5 text-blue-600" />
                      Browse {tool.category} Category Hub
                    </Link>
                  )}

                  <Link
                    href={ROUTES.TOOL(tool.slug)}
                    className="inline-flex items-center gap-1.5 rounded-none border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                  >
                    Full {tool.name} Specifications ↗
                  </Link>
                </div>
              </div>

              {/* Sibling Related Tools Feed */}
              {relatedTools.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-bold text-slate-900">
                    Popular Related Developer Tools
                  </h3>
                  <div className="flex flex-col border border-dashed border-border bg-white">
                    {relatedTools.map((rel, idx) => (
                      <ToolCard
                        key={rel.id}
                        tool={rel}
                        index={idx}
                        showMedals={false}
                        showTrendingBadge={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default BuiltWithPage
