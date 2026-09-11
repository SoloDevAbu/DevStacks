import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ArrowLeft, Layers, ShieldCheck, Cpu } from "lucide-react"
import { resolveProduct } from "@/lib/products/resolve-product"
import { resolveTool } from "@/lib/tools/resolve-tool"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { getProducts } from "@/db/queries/products/list"
import { productSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ProductActionButtons } from "@/components/products/product-action-buttons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { pricingBadgeColor } from "@/utils/styles"
import type { Tier, Pricing } from "@/constants/plans"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () => {
  try {
    const products = await getProducts({ limit: 50 })
    return (products ?? []).map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export const generateMetadata = async ({
  params,
}: ProductPageProps): Promise<Metadata> => {
  const { slug } = await params
  const product = await resolveProduct(slug)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested developer product could not be found.",
    }
  }

  const title = product.metaTitle ?? `${product.name} — ${product.tagline}`
  const description =
    product.metaDescription ??
    product.description ??
    `Learn about ${product.name} on ${SITE_CONFIG.name}. Features, pricing, community likes, and developer insights.`
  const canonicalUrl = `${SITE_CONFIG.url}/products/${product.slug}`
  const keywords = product.keywords
    ? product.keywords.split(",").map((k) => k.trim())
    : [
        product.name,
        ...(product.tags ?? []),
        "developer product",
        "software",
        SITE_CONFIG.name,
      ]

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [
        {
          url: product.logoUrl ?? `${SITE_CONFIG.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${product.name} on ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [product.logoUrl ?? `${SITE_CONFIG.url}/twitter-image`],
    },
  }
}

const ProductDetailPage = async ({ params }: ProductPageProps) => {
  const { slug } = await params
  const product = await resolveProduct(slug)

  if (!product) {
    const tool = await resolveTool(slug)
    if (tool) {
      redirect(ROUTES.TOOL(slug))
    }
    notFound()
  }

  const siteUrl = SITE_CONFIG.url
  const productUrl = `${siteUrl}/products/${product.slug}`

  const prodJsonLd = productSchema({
    name: product.name,
    description: product.description,
    url: productUrl,
    slug: product.slug,
    logoUrl: product.logoUrl,
    keywords: product.keywords,
    pricing: product.pricing,
    tier: product.tier,
    asoCategory: product.asoCategory,
    category: product.category,
    platforms: product.platforms,
    likesCount: product.likesCount,
    createdAt: product.createdAt,
    problemStatement: product.problemStatement,
    solution: product.solution,
    uniqueValue: product.uniqueValue,
    githubUrl: product.githubUrl,
    twitterUrl: product.twitterUrl,
    websiteUrl: product.websiteUrl,
    isRelatedTo: (product.builtWithTools ?? []).map((t) => ({
      name: t.name,
      url: `${siteUrl}${ROUTES.TOOL(t.toolSlug ?? t.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"))}`,
    })),
  })

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Products", url: `${siteUrl}${ROUTES.PRODUCTS}` },
    { name: product.name, url: productUrl },
  ])

  const productFaqs = [
    {
      question: `What is ${product.name}?`,
      answer: product.description,
    },
    {
      question: `What problem does ${product.name} solve for developers?`,
      answer:
        product.problemStatement ??
        `${product.name} eliminates developer friction by offering a streamlined solution for ${product.tagline}.`,
    },
    {
      question: `What is the pricing model for ${product.name}?`,
      answer: `${product.name} is available under the ${product.pricing} model. Check the official website for tier breakdowns.`,
    },
    {
      question: `Which platforms and environments does ${product.name} support?`,
      answer:
        product.platforms.length > 0
          ? `${product.name} supports: ${product.platforms.join(", ")}.`
          : `${product.name} is available for Web and Cloud environments.`,
    },
  ]

  const faqJsonLd = faqSchema(productFaqs)
  const aiPrompt = AI_PROMPTS.product(product.name, product.tagline)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(prodJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="relative flex min-h-full flex-col bg-slate-50/50 pb-20">
        {/* Top Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 border-b border-dashed border-border bg-white px-6 py-3 text-xs font-medium text-slate-500 md:px-8"
        >
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1 hover:text-slate-900"
          >
            <ArrowLeft className="size-3" />
            Home
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <Link href={ROUTES.PRODUCTS} className="hover:text-slate-900">
            Products
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-semibold text-slate-900">{product.name}</span>
        </nav>

        {/* Hero Header */}
        <header className="flex flex-col gap-6 border-b border-dashed border-border bg-white px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <ProductLogo
                text={product.name.slice(0, 2).toUpperCase()}
                bgColor="bg-slate-900"
                textColor="text-white"
                className="size-16 shrink-0 rounded-2xl border border-slate-200 text-2xl shadow-sm md:size-20 md:text-3xl"
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    {product.name}
                  </h1>
                  <VerifiedBadge tier={product.tier as Tier} />
                  <Badge
                    variant="outline"
                    className={pricingBadgeColor(product.pricing as Pricing)}
                  >
                    {product.pricing}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-600 md:text-base">
                  {product.tagline}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-none bg-slate-100 text-xs font-semibold text-slate-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs font-medium text-slate-400">
                    {product.viewsCount.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>

            <ProductActionButtons
              slug={product.slug}
              productId={product.id}
              tier={product.tier}
              initialLikes={product.likesCount}
              websiteUrl={product.websiteUrl}
              githubUrl={product.githubUrl}
            />
          </div>

          {/* Ask AI About This Tool (AEO / LLMO Integration) */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Ask AI Assistant about {product.name}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {AI_PROVIDERS.map((ai) => (
                <div key={ai.id} className="group/btn relative inline-flex">
                  <a
                    href={`${ai.url}${encodeURIComponent(aiPrompt)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative z-10 flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                  >
                    <Image
                      src={ai.icon}
                      alt={ai.name}
                      width={12}
                      height={12}
                      className="object-contain mix-blend-multiply"
                    />
                    <span>{ai.name}</span>
                  </a>
                  <HoverOutline />
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <main className="flex flex-col gap-8">
            {/* Overview / Description */}
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                About {product.name}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {product.description}
              </p>
            </section>

            {/* Deep Dive: Problem, Solution, Unique Value */}
            {(product.problemStatement ||
              product.solution ||
              product.uniqueValue) && (
              <section className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Product Deep Dive
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {product.problemStatement && (
                    <Card className="rounded-none border-dashed bg-white">
                      <CardContent className="flex flex-col gap-2 p-5">
                        <h3 className="text-sm font-bold text-slate-900">
                          The Problem It Solves
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {product.problemStatement}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {product.solution && (
                    <Card className="rounded-none border-dashed bg-white">
                      <CardContent className="flex flex-col gap-2 p-5">
                        <h3 className="text-sm font-bold text-slate-900">
                          The Solution
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {product.solution}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {product.uniqueValue && (
                    <Card className="rounded-none border-dashed bg-white">
                      <CardContent className="flex flex-col gap-2 p-5">
                        <h3 className="text-sm font-bold text-slate-900">
                          What Makes It Unique
                        </h3>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {product.uniqueValue}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>
            )}

            {/* AI Summary / Citation Block (GEO / AEO) */}
            {product.aiContext && (
              <section className="flex flex-col gap-3 rounded-lg border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                  <Cpu className="size-4" /> AI Overview & Direct Answers
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  {product.aiContext}
                </p>
              </section>
            )}

            {/* Q&A Section */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-3">
                {productFaqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="rounded-md border border-slate-200 bg-white p-4"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Sidebar Specifications */}
          <aside className="flex flex-col gap-6">
            <Card className="rounded-none border-dashed bg-white">
              <CardContent className="flex flex-col gap-4 p-5">
                <h2 className="text-sm font-bold tracking-wider text-slate-900 uppercase">
                  Tool Specifications
                </h2>

                <div className="flex flex-col gap-3 text-xs">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Pricing Model</span>
                    <span className="font-semibold text-slate-900">
                      {product.pricing}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Tier Status</span>
                    <span className="font-semibold text-slate-900 capitalize">
                      {product.tier}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Category</span>
                    <span className="font-semibold text-slate-900">
                      {product.category ?? "Developer Tools"}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Likes</span>
                    <span className="font-semibold text-pink-600">
                      {product.likesCount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {product.platforms.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2">
                    <span className="text-xs font-bold text-slate-700">
                      Supported Platforms
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.platforms.map((plat) => (
                        <Badge
                          key={plat}
                          variant="outline"
                          className="border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700"
                        >
                          {plat}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {product.builtWithTools && product.builtWithTools.length > 0 && (
                  <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-700">
                      Built With
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.builtWithTools.map((t) =>
                        t.toolSlug ? (
                          <Link
                            key={t.name}
                            href={ROUTES.TOOL(t.toolSlug)}
                            className="rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                          >
                            {t.name}
                          </Link>
                        ) : (
                          <Badge
                            key={t.name}
                            variant="outline"
                            className="border-slate-200 bg-slate-50 text-[11px] font-medium text-slate-700"
                          >
                            {t.name}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-none border-dashed bg-slate-50/80">
              <CardContent className="flex flex-col gap-3 p-5 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <Layers className="size-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Built with {product.name}?
                </h3>
                <p className="text-xs text-slate-500">
                  Showcase what you created using {product.name} and get
                  featured in the DevStacks directory.
                </p>
                <Link
                  href={ROUTES.SHOWCASE}
                  className="mt-1 inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Showcase Your Build
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </article>
    </>
  )
}

export default ProductDetailPage
