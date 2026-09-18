import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ArrowLeft,
  Layers,
  Cpu,
  Package,
  PlusCircle,
  Sparkles,
  Info,
  Image as ImageIcon,
  Video,
  Target,
  Sliders,
  DollarSign,
  Hammer,
  FolderGit2,
  Globe,
  Laptop,
  HelpCircle,
} from "lucide-react"
import { resolveTool, getProductsBuiltWithTool } from "@/lib/tools/resolve-tool"
import { getToolFaqs } from "@/db/queries/faqs/get-faqs"
import { MakerProfileCard } from "@/components/shared/maker-profile-card"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { getSocialCardImage } from "@/lib/seo/social-image"
import { formatGeoMetaTags } from "@/utils/country"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { getTools } from "@/db/queries/tools/list"
import {
  toolSchema,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
} from "@/lib/seo/schema"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductCard } from "@/components/shared/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToolActionButtons } from "@/components/tools/tool-action-buttons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import { cn } from "@/lib/utils"
import {
  pricingBadgeColor,
  sectionContentBox,
  toolSpecsContainer,
  specItemBox,
  specItemLabel,
  specItemValue,
  toolDeepDiveContainer,
  deepDiveItem,
  deepDiveItemHeader,
  deepDiveItemTitle,
  deepDiveItemText,
  faqContainer,
  faqItem,
  faqQuestionHeader,
  faqQuestionText,
  faqAnswerText,
  footerAiButton,
  detailSectionText,
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

  const socialImage = getSocialCardImage(tool.logoUrl, tool.images)
  const geoTags = formatGeoMetaTags(tool.submitterCountry, tool.submitterState)

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    ...(Object.keys(geoTags).length > 0 ? { other: geoTags } : {}),
    openGraph: {
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      type: "website",
      images: [
        {
          url: socialImage,
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
      images: [socialImage],
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

  const customFaqs = await getToolFaqs(tool.id)

  const prodJsonLd = toolSchema({
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
    upvotesCount: tool.upvotesCount,
    createdAt: tool.createdAt,
    problemStatement: tool.problemStatement,
    solution: tool.solution,
    uniqueValue: tool.uniqueValue,
    githubUrl: tool.githubUrl,
    twitterUrl: tool.twitterUrl,
    linkedinUrl: tool.linkedinUrl,
    discordUrl: tool.discordUrl,
    websiteUrl: tool.websiteUrl,
    countryOfOrigin: tool.submitterCountry,
    spatialCoverage: tool.geoTarget,
    author: tool.submitterName
      ? {
          name: tool.submitterName,
          url: tool.submitterUsername
            ? `${siteUrl}/makers/${tool.submitterUsername}`
            : undefined,
          country: tool.submitterCountry,
        }
      : undefined,
    screenshots: tool.images,
  })

  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Tools", url: `${siteUrl}/tools` },
    { name: tool.name, url: toolUrl },
  ])

  const toolFaqs = customFaqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }))

  const faqJsonLd = toolFaqs.length > 0 ? faqSchema(toolFaqs) : null
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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
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
                imageUrl={tool.logoUrl}
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
                  <span className="text-xs font-semibold text-blue-600">
                    {tool.buildsCount} builds
                  </span>
                </div>

                {(tool.submitterName || tool.submitterUsername) && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase">
                      Listed by
                    </span>
                    <MakerProfileCard
                      name={tool.submitterName}
                      username={tool.submitterUsername}
                      avatarUrl={tool.submitterAvatarUrl}
                      country={tool.submitterCountry}
                      state={tool.submitterState}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <ToolActionButtons
              slug={tool.slug}
              toolId={tool.id}
              tier={tool.tier}
              initialUpvotes={tool.upvotesCount}
              websiteUrl={tool.websiteUrl}
              githubUrl={tool.githubUrl}
              appStoreUrl={tool.appStoreUrl}
              playStoreUrl={tool.playStoreUrl}
              chromeExtensionUrl={tool.chromeExtensionUrl}
            />
          </div>

          {/* Ask AI Sub-tray with dashed divider */}
          <div className="-mx-6 mt-2 -mb-8 flex flex-col gap-3 border-t border-dashed border-border bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:px-8">
            <div className="flex shrink-0 items-center gap-2">
              <Sparkles className="size-3.5 text-blue-600" />
              <span className="font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                ASK AI
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
                    title={`Ask ${ai.name} about ${tool.name}`}
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
        <section className="border-b border-dashed border-border bg-white">
          <DetailSectionHeader title="About" icon={Info} theme="blue" />
          <div className={sectionContentBox}>
            <p className={detailSectionText}>{tool.description}</p>
          </div>
        </section>

        {/* Screenshots Gallery (if present) */}
        {tool.images && tool.images.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Screenshots & Gallery"
              icon={ImageIcon}
              theme="sky"
            />
            <div className="bg-slate-50/20 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {tool.images.slice(0, 5).map((imgUrl, i) => (
                  <div
                    key={i}
                    className="group relative aspect-video overflow-hidden rounded-xl border border-dashed border-border bg-white shadow-2xs transition-all hover:border-slate-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`${tool.name} preview ${i + 1}`}
                      className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Demo Video (if present) */}
        {tool.demoVideoUrl && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Product Demo Video"
              icon={Video}
              theme="violet"
            />
            <div className="p-6 md:p-8">
              <div className="aspect-video max-w-3xl overflow-hidden rounded-xl border border-dashed border-border bg-black shadow-xs">
                {tool.demoVideoUrl.includes("youtube.com") ||
                tool.demoVideoUrl.includes("youtu.be") ? (
                  <iframe
                    src={tool.demoVideoUrl
                      .replace("watch?v=", "embed/")
                      .replace("youtu.be/", "youtube.com/embed/")}
                    title={`${tool.name} demo video`}
                    className="size-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : tool.demoVideoUrl.includes("loom.com") ? (
                  <iframe
                    src={tool.demoVideoUrl.replace("share/", "embed/")}
                    title={`${tool.name} loom demo`}
                    className="size-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={tool.demoVideoUrl}
                    controls
                    className="size-full"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Use Cases (if present) */}
        {tool.useCases && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Target Use Cases"
              icon={Target}
              theme="emerald"
            />
            <div className={sectionContentBox}>
              <p className={detailSectionText}>{tool.useCases}</p>
            </div>
          </section>
        )}

        {/* Section 2: Tool Specifications */}
        <section className="border-b border-dashed border-border bg-white">
          <DetailSectionHeader
            title="Tool Specifications"
            icon={Sliders}
            theme="slate"
          />

          <div className={toolSpecsContainer}>
            <div className={specItemBox}>
              <span className={specItemLabel}>
                <DollarSign className="size-3 text-slate-400" />
                Pricing Model
              </span>
              <span className={specItemValue}>{tool.pricing}</span>
            </div>

            <div className={specItemBox}>
              <span className={specItemLabel}>
                <Hammer className="size-3 text-slate-400" />
                Ecosystem Builds
              </span>
              <span className="text-xs font-bold text-blue-600">
                {tool.buildsCount.toLocaleString()} projects
              </span>
            </div>

            <div className={specItemBox}>
              <span className={specItemLabel}>
                <FolderGit2 className="size-3 text-slate-400" />
                Category
              </span>
              <span className={specItemValue}>
                {tool.category ?? "Developer Tool"}
              </span>
            </div>
            <div className={specItemBox}>
              <span className={specItemLabel}>
                <Laptop className="size-3 text-slate-400" />
                Platforms
              </span>
              <span
                className={specItemValue}
                title={tool.platforms?.join(", ")}
              >
                {tool.platforms && tool.platforms.length > 0
                  ? tool.platforms.join(", ")
                  : "Web / Cloud"}
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Value Proposition & Deep Dive */}
        {(tool.problemStatement || tool.solution || tool.uniqueValue) && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Value Proposition & Deep Dive"
              icon={Sparkles}
              theme="amber"
            />

            <div className={toolDeepDiveContainer}>
              {tool.problemStatement && (
                <div className={deepDiveItem}>
                  <div className={deepDiveItemHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-rose-100 font-mono text-[10px] font-bold text-rose-700">
                      01
                    </span>
                    <h3 className={deepDiveItemTitle}>The Problem It Solves</h3>
                  </div>
                  <p className={deepDiveItemText}>{tool.problemStatement}</p>
                </div>
              )}

              {tool.solution && (
                <div className={deepDiveItem}>
                  <div className={deepDiveItemHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-emerald-100 font-mono text-[10px] font-bold text-emerald-700">
                      02
                    </span>
                    <h3 className={deepDiveItemTitle}>The Solution</h3>
                  </div>
                  <p className={deepDiveItemText}>{tool.solution}</p>
                </div>
              )}

              {tool.uniqueValue && (
                <div className={deepDiveItem}>
                  <div className={deepDiveItemHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-indigo-100 font-mono text-[10px] font-bold text-indigo-700">
                      03
                    </span>
                    <h3 className={deepDiveItemTitle}>What Makes It Unique</h3>
                  </div>
                  <p className={deepDiveItemText}>{tool.uniqueValue}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 4: AI Summary / Direct Answers (GEO / AEO) */}
        {tool.aiContext && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="AI Overview & Direct Answers"
              subtitle="Machine-readable knowledge snapshot optimized for LLMs and developer search engines"
              icon={Cpu}
              theme="indigo"
            />
            <div className="bg-indigo-50/15 px-6 py-6 md:px-8">
              <p className="max-w-4xl text-xs leading-relaxed whitespace-pre-line text-slate-700 sm:text-sm">
                {tool.aiContext}
              </p>
            </div>
          </section>
        )}

        {/* Section 5: Products Built with this Tool */}
        <section className="border-b border-dashed border-border bg-white">
          <DetailSectionHeader
            title={`Products Built With ${tool.name}`}
            subtitle={`Discover projects and applications using ${tool.name} in production`}
            icon={Package}
            theme="blue"
          >
            <Button
              variant="outline"
              size="sm"
              render={<Link href={ROUTES.SHOWCASE_TOOL(tool.slug)} />}
              className="self-start rounded-none text-xs sm:self-auto"
            >
              <PlusCircle className="mr-1.5 size-3.5" />
              Submit Your Build
            </Button>
          </DetailSectionHeader>

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
            <div className="flex flex-col items-center justify-center bg-slate-50/40 px-6 py-12 text-center md:px-8">
              <Package className="mb-2 size-8 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-800">
                No products submitted yet
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Are you building with {tool.name}? Be the first to showcase your
                project to the community!
              </p>
              <div className="mt-3">
                <Button
                  size="sm"
                  render={<Link href={ROUTES.SHOWCASE_TOOL(tool.slug)} />}
                  className="rounded-none text-xs"
                >
                  <PlusCircle className="mr-1.5 size-3.5" />
                  Add Your Project
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Section 6: Q&A Section */}
        {toolFaqs.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Frequently Asked Questions"
              subtitle={`Common questions and technical details about ${tool.name}`}
              icon={HelpCircle}
              theme="teal"
            />

            <div className={faqContainer}>
              {toolFaqs.map((faq, idx) => (
                <div
                  key={faq.id ?? `${faq.question}-${idx}`}
                  className={faqItem}
                >
                  <div className={faqQuestionHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-teal-100 font-mono text-[10px] font-bold text-teal-800">
                      Q{idx + 1}
                    </span>
                    <h3 className={faqQuestionText}>{faq.question}</h3>
                  </div>
                  <p className={faqAnswerText}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 7: Ecosystem Callout */}
        <section className="border-b border-dashed border-border bg-slate-50/70 px-6 py-10 md:px-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Layers className="size-4 text-indigo-600" /> Ecosystem Showcase
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Built something with {tool.name}?
              </h3>
              <p className="max-w-2xl text-xs text-slate-600">
                Showcase your project on {SITE_CONFIG.name} and get discovered
                by developers searching for tools in this stack.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              className="self-start rounded-none bg-slate-900 text-white hover:bg-slate-800 md:self-auto"
              render={<Link href={ROUTES.SHOWCASE_TOOL(tool.slug)} />}
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
