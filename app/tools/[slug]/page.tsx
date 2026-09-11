import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ArrowLeft,
  Layers,
  ShieldCheck,
  Cpu,
  Package,
  PlusCircle,
} from "lucide-react"
import { resolveTool, getProductsBuiltWithTool } from "@/lib/tools/resolve-tool"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { getTools } from "@/db/queries/tools/list"
import {
  productSchema,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/seo/schema"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductCard } from "@/components/shared/product-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToolActionButtons } from "@/components/tools/tool-action-buttons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { cn } from "@/lib/utils"
import {
  pricingBadgeColor,
  sectionWrapper,
  sectionHeadingTitle,
  sectionHeadingSubtitle,
  specCard,
} from "@/utils/styles"
import type { Tier, Pricing } from "@/constants/plans"

interface ToolPageProps {
  params: Promise<{ slug: string }>
}

export const generateStaticParams = async () => {
  try {
    const toolsList = await getTools({ limit: 50 })
    return (toolsList ?? []).map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export const generateMetadata = async ({
  params,
}: ToolPageProps): Promise<Metadata> => {
  const { slug } = await params
  const tool = await resolveTool(slug)

  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested developer tool could not be found.",
    }
  }

  const title = tool.metaTitle ?? `${tool.name} — ${tool.tagline}`
  const description =
    tool.metaDescription ??
    tool.description ??
    `Learn about ${tool.name} on ${SITE_CONFIG.name}. Features, pricing, community upvotes, and developer builds.`
  const canonicalUrl = `${SITE_CONFIG.url}/tools/${tool.slug}`
  const keywords = tool.keywords
    ? tool.keywords.split(",").map((k) => k.trim())
    : [
        tool.name,
        ...(tool.tags ?? []),
        "developer tool",
        "API",
        "infrastructure",
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
          url: tool.logoUrl ?? `${SITE_CONFIG.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `${tool.name} on ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [tool.logoUrl ?? `${SITE_CONFIG.url}/twitter-image`],
    },
  }
}

const ToolDetailPage = async ({ params }: ToolPageProps) => {
  const { slug } = await params
  const tool = await resolveTool(slug)

  if (!tool) {
    notFound()
  }

  const builtWithProducts = await getProductsBuiltWithTool(
    tool.slug,
    tool.name,
    10
  )

  const siteUrl = SITE_CONFIG.url
  const toolUrl = `${siteUrl}/tools/${tool.slug}`

  const prodJsonLd = productSchema({
    name: tool.name,
    description: tool.description,
    url: toolUrl,
    slug: tool.slug,
    logoUrl: tool.logoUrl,
    keywords: tool.keywords,
    pricing: tool.pricing,
    tier: tool.tier,
    asoCategory: tool.asoCategory,
    category: tool.category,
    platforms: tool.platforms,
    likesCount: tool.upvotesCount,
    createdAt: tool.createdAt,
    problemStatement: tool.problemStatement,
    solution: tool.solution,
    uniqueValue: tool.uniqueValue,
    githubUrl: tool.githubUrl,
    twitterUrl: tool.twitterUrl,
    websiteUrl: tool.websiteUrl,
    isRelatedTo: builtWithProducts.map((p) => ({
      name: p.name,
      url: `${siteUrl}${ROUTES.PRODUCT(p.slug)}`,
    })),
  })

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Tools", url: `${siteUrl}/tools` },
    { name: tool.name, url: toolUrl },
  ])

  const toolFaqs = [
    {
      question: `What is ${tool.name}?`,
      answer: tool.description,
    },
    {
      question: `What problem does ${tool.name} solve for developers?`,
      answer:
        tool.problemStatement ??
        `${tool.name} eliminates developer friction by offering a streamlined solution for ${tool.tagline}.`,
    },
    {
      question: `What is the pricing model for ${tool.name}?`,
      answer: `${tool.name} is available under the ${tool.pricing} model. Check the official website for tier breakdowns.`,
    },
    {
      question: `Which platforms and environments does ${tool.name} support?`,
      answer:
        tool.platforms && tool.platforms.length > 0
          ? `${tool.name} supports: ${tool.platforms.join(", ")}.`
          : `${tool.name} is available for Web and Cloud environments.`,
    },
  ]

  const faqJsonLd = faqSchema(toolFaqs)
  const aiPrompt = AI_PROMPTS.tool(tool.name, tool.tagline)

  const builtWithJsonLd =
    builtWithProducts.length > 0
      ? itemListSchema(
          builtWithProducts.map((p) => ({
            name: p.name,
            url: `${siteUrl}${ROUTES.PRODUCT(p.slug)}`,
            description: p.tagline,
          }))
        )
      : null

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
      {builtWithJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(builtWithJsonLd) }}
        />
      )}

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
          <Link href={ROUTES.TOOLS} className="hover:text-slate-900">
            Tools
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-semibold text-slate-900">{tool.name}</span>
        </nav>

        {/* Hero Header */}
        <header className="flex flex-col gap-6 border-b border-dashed border-border bg-white px-6 py-8 md:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-4 md:gap-5">
              <ProductLogo
                text={tool.name.slice(0, 2).toUpperCase()}
                bgColor="bg-slate-900"
                textColor="text-white"
                className="size-16 shrink-0 rounded-2xl border border-slate-200 text-2xl shadow-sm md:size-20 md:text-3xl"
              />
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                    {tool.name}
                  </h1>
                  <VerifiedBadge tier={tool.tier as Tier} />
                  <Badge
                    variant="outline"
                    className={pricingBadgeColor(tool.pricing as Pricing)}
                  >
                    {tool.pricing}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-slate-600 md:text-base">
                  {tool.tagline}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {(tool.tags ?? []).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-none bg-slate-100 text-xs font-semibold text-slate-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs font-medium text-slate-400">
                    {tool.viewsCount.toLocaleString()} views
                  </span>
                  <span className="text-xs font-semibold text-blue-600">
                    {tool.buildsCount} builds
                  </span>
                </div>
              </div>
            </div>

            <ToolActionButtons
              slug={tool.slug}
              toolId={tool.id}
              tier={tool.tier}
              initialUpvotes={tool.upvotesCount}
              websiteUrl={tool.websiteUrl}
              githubUrl={tool.githubUrl}
            />
          </div>

          {/* Ask AI About This Tool (AEO / LLMO Integration) */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                Ask AI Assistant about {tool.name}
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

        {/* Section 1: About */}
        <section className={cn(sectionWrapper, "bg-white")}>
          <div className="flex flex-col gap-3">
            <h2 className={sectionHeadingTitle}>
              About {tool.name}
            </h2>
            <p className="max-w-4xl text-sm leading-relaxed text-slate-600">
              {tool.description}
            </p>
          </div>
        </section>

        {/* Section 2: Tool Specifications */}
        <section className={cn(sectionWrapper, "bg-slate-50/40")}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className={sectionHeadingTitle}>
                Tool Specifications
              </h2>
              <p className={sectionHeadingSubtitle}>
                Key metrics, platform support, and technical compatibility for {tool.name}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              <div className={specCard}>
                <span className="text-xs font-medium text-slate-500">Pricing Model</span>
                <span className="text-sm font-semibold text-slate-900">
                  {tool.pricing}
                </span>
              </div>

              <div className={specCard}>
                <span className="text-xs font-medium text-slate-500">Total Upvotes</span>
                <span className="text-sm font-semibold text-slate-900">
                  {tool.upvotesCount.toLocaleString()}
                </span>
              </div>

              <div className={specCard}>
                <span className="text-xs font-medium text-slate-500">Ecosystem Builds</span>
                <span className="text-sm font-semibold text-blue-600">
                  {tool.buildsCount.toLocaleString()} projects
                </span>
              </div>

              {tool.category && (
                <div className={specCard}>
                  <span className="text-xs font-medium text-slate-500">Category</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {tool.category}
                  </span>
                </div>
              )}

              {tool.targetAudience && (
                <div className={specCard}>
                  <span className="text-xs font-medium text-slate-500">Target Audience</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {tool.targetAudience}
                  </span>
                </div>
              )}

              {tool.geoTarget && (
                <div className={specCard}>
                  <span className="text-xs font-medium text-slate-500">Target Region</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {tool.geoTarget}
                  </span>
                </div>
              )}

              {tool.platforms && tool.platforms.length > 0 && (
                <div className={cn(specCard, "sm:col-span-2")}>
                  <span className="text-xs font-medium text-slate-500">Supported Platforms</span>
                  <div className="flex flex-wrap gap-1 mt-0.5">
                    {tool.platforms.map((p) => (
                      <Badge
                        key={p}
                        variant="secondary"
                        className="rounded-none bg-slate-100 text-[10px] text-slate-600"
                      >
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className={cn(specCard, "sm:col-span-2 flex-row items-center gap-2.5 border-emerald-200 bg-emerald-50/50 text-emerald-800")}>
                <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                <span className="text-xs font-medium">
                  Verified submission on {SITE_CONFIG.name}.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Tool Deep Dive */}
        {(tool.problemStatement || tool.solution || tool.uniqueValue) && (
          <section className={cn(sectionWrapper, "bg-white")}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <h2 className={sectionHeadingTitle}>
                  Tool Deep Dive
                </h2>
                <p className={sectionHeadingSubtitle}>
                  Architectural insights, developer pain points solved, and core value proposition
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {tool.problemStatement && (
                  <Card className="rounded-none border-dashed bg-slate-50/40 shadow-none">
                    <CardContent className="flex flex-col gap-2 p-5">
                      <h3 className="text-sm font-bold text-slate-900">
                        The Problem It Solves
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {tool.problemStatement}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {tool.solution && (
                  <Card className="rounded-none border-dashed bg-slate-50/40 shadow-none">
                    <CardContent className="flex flex-col gap-2 p-5">
                      <h3 className="text-sm font-bold text-slate-900">
                        The Solution
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {tool.solution}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {tool.uniqueValue && (
                  <Card className="rounded-none border-dashed bg-slate-50/40 shadow-none">
                    <CardContent className="flex flex-col gap-2 p-5">
                      <h3 className="text-sm font-bold text-slate-900">
                        What Makes It Unique
                      </h3>
                      <p className="text-xs leading-relaxed text-slate-600">
                        {tool.uniqueValue}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Section 4: AI Summary / Direct Answers (GEO / AEO) */}
        {tool.aiContext && (
          <section className={cn(sectionWrapper, "bg-indigo-50/30")}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Cpu className="size-4" /> AI Overview & Direct Answers
              </div>
              <p className="max-w-4xl text-xs leading-relaxed text-slate-700">
                {tool.aiContext}
              </p>
            </div>
          </section>
        )}

        {/* Section 5: Products Built with this Tool */}
        <section className={cn(sectionWrapper, "bg-white")}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={sectionHeadingTitle}>
                  Products Built With {tool.name}
                </h2>
                <p className={sectionHeadingSubtitle}>
                  Discover projects and applications using {tool.name} in production
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={ROUTES.SUBMIT} />}
                className="self-start sm:self-auto rounded-none text-xs"
              >
                <PlusCircle className="mr-1.5 size-3.5" />
                Submit Your Build
              </Button>
            </div>

            {builtWithProducts.length > 0 ? (
              <div className="flex flex-col border border-dashed border-border">
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
            ) : (
              <div className="flex flex-col items-center justify-center border border-dashed border-border bg-slate-50/40 p-8 text-center">
                <Package className="mb-2 size-8 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-800">
                  No products submitted yet
                </h3>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  Are you building with {tool.name}? Be the first to showcase
                  your project to the community!
                </p>
                <div className="mt-3">
                  <Button
                    size="sm"
                    render={<Link href={ROUTES.SUBMIT} />}
                    className="rounded-none text-xs"
                  >
                    <PlusCircle className="mr-1.5 size-3.5" />
                    Add Your Project
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Section 6: Q&A Section */}
        <section className={cn(sectionWrapper, "bg-slate-50/40")}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h2 className={sectionHeadingTitle}>
                Frequently Asked Questions
              </h2>
              <p className={sectionHeadingSubtitle}>
                Common questions and technical details about {tool.name}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {toolFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-dashed border-border bg-white p-5"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Ecosystem Callout */}
        <section className="border-b border-dashed border-border bg-slate-900 px-6 py-10 text-white md:px-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-400 uppercase">
                <Layers className="size-4" /> Ecosystem Showcase
              </div>
              <h3 className="text-lg font-bold text-white">
                Built something with {tool.name}?
              </h3>
              <p className="max-w-2xl text-xs text-slate-300">
                Showcase your project on {SITE_CONFIG.name} and get discovered by developers searching for tools in this stack.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="self-start rounded-none md:self-auto"
              render={<Link href={ROUTES.SUBMIT} />}
            >
              <PlusCircle className="mr-1.5 size-3.5" />
              Submit Your Build
            </Button>
          </div>
        </section>
      </article>
    </>
  )
}

export default ToolDetailPage
