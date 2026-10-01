import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Package, PlusCircle, Hammer, Sparkles, Globe, Layers } from "lucide-react"
import { resolveTool, getProductsBuiltWithTool } from "@/lib/tools/resolve-tool"
import { ProductCard } from "@/components/shared/product-card"
import { ProductLogo } from "@/components/shared/product-logo"
import { getFaviconUrl } from "@/utils/urls"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

export const generateMetadata = async (props: BuiltWithPageProps): Promise<Metadata> => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    return {
      title: `Showcase Not Found — ${SITE_CONFIG.name}`,
    }
  }

  const builtWithProducts = await getProductsBuiltWithTool(tool.slug, tool.name, 50)
  const isIndexable = builtWithProducts.length >= 3

  const title = `Products Built With ${tool.name} — Production Showcase | ${SITE_CONFIG.name}`
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
          alt: `Products Built With ${tool.name} | ${SITE_CONFIG.name}`,
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

const BuiltWithPage = async (props: BuiltWithPageProps) => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    notFound()
  }

  const builtWithProducts = await getProductsBuiltWithTool(tool.slug, tool.name, 50)

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
                <li className="flex items-center text-slate-400" aria-hidden="true">
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
              <Link href={ROUTES.TOOL(tool.slug)} className="hover:text-slate-900">
                {tool.name}
              </Link>
            </li>
            <li className="flex items-center text-slate-400" aria-hidden="true">
              <ChevronRight className="size-3" />
            </li>
            <li className="flex items-center">
              <span className="font-semibold text-slate-900" aria-current="page">
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
                imageUrl={tool.logoUrl?.trim() || getFaviconUrl(tool.websiteUrl)}
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

                <p className="max-w-2xl text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
                  Discover live applications, SaaS platforms, and indie developer projects verified to run on{" "}
                  <strong className="font-semibold text-slate-800">{tool.name}</strong>. Inspect full stacks and architectures.
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
                  <Badge variant="outline" className="border-slate-300 bg-slate-50 font-semibold text-blue-600">
                    {builtWithProducts.length} Verified {builtWithProducts.length === 1 ? "Product" : "Products"}
                  </Badge>

                  <Link
                    href={ROUTES.TOOL(tool.slug)}
                    className="font-medium text-slate-700 hover:text-slate-900 hover:underline"
                  >
                    View {tool.name} Tool Profile ↗
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
        </main>
      </div>
    </>
  )
}

export default BuiltWithPage
