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
import { productSchema, breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductCard } from "@/components/shared/product-card"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ToolActionButtons } from "@/components/products/tool-action-buttons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { pricingBadgeColor } from "@/utils/styles"
import type { Tier, Pricing } from "@/constants/tiers"

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
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
    },
  }
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
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
    platforms: tool.platforms,
    likesCount: tool.upvotesCount,
    createdAt: tool.createdAt,
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

        {/* Content Body */}
        <div className="grid grid-cols-1 gap-8 p-6 md:p-8 lg:grid-cols-[1fr_340px]">
          {/* Main Column */}
          <main className="flex flex-col gap-8">
            {/* Overview / Description */}
            <section className="flex flex-col gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                About {tool.name}
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {tool.description}
              </p>
            </section>

            {/* Deep Dive: Problem, Solution, Unique Value */}
            {(tool.problemStatement ||
              tool.solution ||
              tool.uniqueValue) && (
              <section className="flex flex-col gap-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Tool Deep Dive
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {tool.problemStatement && (
                    <Card className="rounded-none border-dashed bg-white">
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
                    <Card className="rounded-none border-dashed bg-white">
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
                    <Card className="rounded-none border-dashed bg-white">
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
              </section>
            )}

            {/* AI Summary / Direct Answers (GEO / AEO) */}
            {tool.aiContext && (
              <section className="flex flex-col gap-3 rounded-lg border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                  <Cpu className="size-4" /> AI Overview & Direct Answers
                </div>
                <p className="text-xs leading-relaxed text-slate-700">
                  {tool.aiContext}
                </p>
              </section>
            )}

            {/* Products Built with this Tool */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Products Built With {tool.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Discover projects and applications using {tool.name} in production
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={ROUTES.SUBMIT} />}
                  className="rounded-none text-xs"
                >
                  <PlusCircle className="mr-1.5 size-3.5" />
                  Submit Your Build
                </Button>
              </div>

              {builtWithProducts.length > 0 ? (
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
              ) : (
                <div className="flex flex-col items-center justify-center border border-dashed border-border bg-white p-8 text-center">
                  <Package className="mb-2 size-8 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-800">
                    No products submitted yet
                  </h3>
                  <p className="mt-1 max-w-sm text-xs text-slate-500">
                    Are you building with {tool.name}? Be the first to showcase your project to the community!
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
            </section>

            {/* Q&A Section */}
            <section className="flex flex-col gap-4">
              <h2 className="text-lg font-bold text-slate-900">
                Frequently Asked Questions
              </h2>
              <div className="flex flex-col gap-3">
                {toolFaqs.map((faq) => (
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
                      {tool.pricing}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Upvotes</span>
                    <span className="font-semibold text-slate-900">
                      {tool.upvotesCount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Ecosystem Builds</span>
                    <span className="font-semibold text-blue-600">
                      {tool.buildsCount.toLocaleString()} projects
                    </span>
                  </div>

                  {tool.category && (
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Category</span>
                      <span className="font-semibold text-slate-900">
                        {tool.category}
                      </span>
                    </div>
                  )}

                  {tool.platforms && tool.platforms.length > 0 && (
                    <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Platforms</span>
                      <div className="flex flex-wrap gap-1">
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

                  {tool.targetAudience && (
                    <div className="flex flex-col gap-1 border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Target Audience</span>
                      <span className="font-medium text-slate-700">
                        {tool.targetAudience}
                      </span>
                    </div>
                  )}

                  {tool.geoTarget && (
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Target Region</span>
                      <span className="font-medium text-slate-700">
                        {tool.geoTarget}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-emerald-50/60 p-3 text-xs text-emerald-800">
                  <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
                  <span>
                    Verified submission on {SITE_CONFIG.name}.
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Share and submit callout */}
            <Card className="rounded-none border-dashed bg-slate-900 text-white">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  <Layers className="size-4 text-indigo-400" /> Ecosystem
                </div>
                <h3 className="text-sm font-bold text-white">
                  Built something with {tool.name}?
                </h3>
                <p className="text-xs text-slate-300">
                  Showcase your project on {SITE_CONFIG.name} and get discovered by developers searching for tools in this stack.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-1 w-full rounded-none"
                  render={<Link href={ROUTES.SUBMIT} />}
                >
                  <PlusCircle className="mr-1.5 size-3.5" />
                  Submit Your Build
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </article>
    </>
  )
}
