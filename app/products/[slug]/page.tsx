import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ArrowLeft,
  Layers,
  Cpu,
  Sparkles,
  Target,
  Zap,
  PlusCircle,
  Wrench,
} from "lucide-react"
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
import { Button } from "@/components/ui/button"
import { ProductActionButtons } from "@/components/products/product-action-buttons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { cn } from "@/lib/utils"
import {
  pricingBadgeColor,
  sectionWrapper,
  sectionHeadingTitle,
  sectionHeadingSubtitle,
  toolSpecsContainer,
  toolDeepDiveContainer,
  footerAiButton,
} from "@/utils/styles"
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

      <article className="relative flex min-h-full flex-col bg-white">
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

          {/* Ask AI Sub-tray with dashed divider */}
          <div className="-mx-6 -mb-8 mt-2 flex flex-col gap-3 border-t border-dashed border-border bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:px-8">
            <div className="flex items-center gap-2 shrink-0">
              <Sparkles className="size-3.5 text-blue-600" />
              <span className="font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                ASK AI ABOUT {product.name.toUpperCase()}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {AI_PROVIDERS.map((ai) => (
                <div key={ai.id} className="group/btn relative inline-flex">
                  <a
                    href={`${ai.url}${encodeURIComponent(aiPrompt)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={footerAiButton}
                    title={`Ask ${ai.name} about ${product.name}`}
                  >
                    <Image
                      src={ai.icon}
                      alt={ai.name}
                      width={14}
                      height={14}
                      className="object-contain mix-blend-multiply"
                    />
                    <span className="text-xs font-medium text-slate-700 transition-colors group-hover/btn:text-slate-950">
                      {ai.name}
                    </span>
                  </a>
                  <HoverOutline />
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* Section 1: About */}
        <section className={cn(sectionWrapper, "bg-white")}>
          <div className="flex flex-col gap-3">
            <h2 className={sectionHeadingTitle}>
              About {product.name}
            </h2>
            <p className="max-w-4xl text-sm leading-relaxed text-slate-600">
              {product.description}
            </p>
          </div>
        </section>

        {/* Section 2: Product Specifications */}
        <section className={cn(sectionWrapper, "bg-slate-50/40")}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className={sectionHeadingTitle}>
                Product Specifications
              </h2>
              <p className={sectionHeadingSubtitle}>
                Key metrics, tier status, and compatibility for {product.name}
              </p>
            </div>

            <div className={toolSpecsContainer}>
              <div className="flex flex-col gap-1.5 p-4.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Pricing Model
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {product.pricing}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-4.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Tier Status
                </span>
                <span className="text-xs font-bold text-slate-900 capitalize">
                  {product.tier}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-4.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Category
                </span>
                <span className="text-xs font-bold text-slate-900 truncate">
                  {product.category ?? "Developer Tools"}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-4.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Total Likes
                </span>
                <span className="text-xs font-bold text-pink-600">
                  {product.likesCount.toLocaleString()}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-4.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Platforms
                </span>
                <span className="text-xs font-bold text-slate-900 truncate" title={product.platforms?.join(", ")}>
                  {product.platforms && product.platforms.length > 0
                    ? product.platforms.join(", ")
                    : "Web / Cloud"}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 p-4.5">
                <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Tools Integrated
                </span>
                <span className="text-xs font-bold text-indigo-600">
                  {(product.builtWithTools ?? []).length} tools
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Product Deep Dive */}
        {(product.problemStatement || product.solution || product.uniqueValue) && (
          <section className={cn(sectionWrapper, "bg-white")}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className={sectionHeadingTitle}>
                  Product Deep Dive
                </h2>
                <p className={sectionHeadingSubtitle}>
                  Architectural insights, developer pain points solved, and core value proposition
                </p>
              </div>

              <div className={toolDeepDiveContainer}>
                {product.problemStatement && (
                  <div className="flex flex-col gap-3.5 p-6 md:p-8 bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-rose-600 uppercase">
                        01 / PROBLEM
                      </span>
                      <div className="flex size-7 items-center justify-center rounded-md border border-rose-200/80 bg-rose-50 text-rose-600">
                        <Target className="size-3.5" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      The Problem It Solves
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {product.problemStatement}
                    </p>
                  </div>
                )}

                {product.solution && (
                  <div className="flex flex-col gap-3.5 p-6 md:p-8 bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-emerald-600 uppercase">
                        02 / ARCHITECTURE
                      </span>
                      <div className="flex size-7 items-center justify-center rounded-md border border-emerald-200/80 bg-emerald-50 text-emerald-600">
                        <Zap className="size-3.5" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      The Solution
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {product.solution}
                    </p>
                  </div>
                )}

                {product.uniqueValue && (
                  <div className="flex flex-col gap-3.5 p-6 md:p-8 bg-slate-50/20 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold tracking-widest text-blue-600 uppercase">
                        03 / ADVANTAGE
                      </span>
                      <div className="flex size-7 items-center justify-center rounded-md border border-blue-200/80 bg-blue-50 text-blue-600">
                        <Sparkles className="size-3.5" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      What Makes It Unique
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-600">
                      {product.uniqueValue}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: AI Summary / Citation Block (GEO / AEO) */}
        {product.aiContext && (
          <section className={cn(sectionWrapper, "bg-indigo-50/30")}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Cpu className="size-4" /> AI Overview & Direct Answers
              </div>
              <p className="max-w-4xl text-xs leading-relaxed text-slate-700">
                {product.aiContext}
              </p>
            </div>
          </section>
        )}

        {/* Section 5: Tech Stack & Tools Used */}
        {product.builtWithTools && product.builtWithTools.length > 0 && (
          <section className={cn(sectionWrapper, "bg-white")}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className={sectionHeadingTitle}>
                  Tech Stack & Tools Used
                </h2>
                <p className={sectionHeadingSubtitle}>
                  Developer tools, APIs, and infrastructure powering {product.name}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.builtWithTools.map((t) =>
                  t.toolSlug ? (
                    <Link
                      key={t.name}
                      href={ROUTES.TOOL(t.toolSlug)}
                      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-slate-50/50 px-3.5 py-2 text-xs font-semibold text-slate-800 transition-all hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-900"
                    >
                      <Wrench className="size-3.5 text-indigo-600" />
                      <span>{t.name}</span>
                    </Link>
                  ) : (
                    <div
                      key={t.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-slate-50/50 px-3.5 py-2 text-xs font-medium text-slate-700"
                    >
                      <Wrench className="size-3.5 text-slate-400" />
                      <span>{t.name}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 6: Q&A Section */}
        <section className="border-b border-dashed border-border bg-white">
          <div className="flex flex-col gap-1 border-b border-dashed border-border bg-slate-50/40 px-6 py-6 md:px-8 md:py-8">
            <h2 className={sectionHeadingTitle}>
              Frequently Asked Questions
            </h2>
            <p className={sectionHeadingSubtitle}>
              Common questions and technical details about {product.name}
            </p>
          </div>

          <div className="flex flex-col divide-y divide-dashed divide-border">
            {productFaqs.map((faq, idx) => (
              <div
                key={faq.question}
                className="flex flex-col gap-2 px-6 py-6 md:px-8 hover:bg-slate-50/40 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-slate-400 select-none pt-0.5 shrink-0">
                    Q{idx + 1}
                  </span>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <h3 className="text-sm font-bold text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="max-w-4xl text-xs leading-relaxed text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Ecosystem Showcase */}
        <section className="border-b border-dashed border-border bg-slate-50/70 px-6 py-10 md:px-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Layers className="size-4 text-indigo-600" /> Ecosystem Showcase
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Built with {product.name}?
              </h3>
              <p className="max-w-2xl text-xs text-slate-600">
                Showcase what you created using {product.name} and get featured in the {SITE_CONFIG.name} directory.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              className="self-start rounded-none md:self-auto bg-slate-900 text-white hover:bg-slate-800"
              render={<Link href={ROUTES.SHOWCASE} />}
            >
              <PlusCircle className="mr-1.5 size-3.5" />
              Showcase Your Build
            </Button>
          </div>
        </section>
      </article>
    </>
  )
}

export default ProductDetailPage
