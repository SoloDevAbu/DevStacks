import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronRight,
  ArrowLeft,
  Layers,
  Sparkles,
  PlusCircle,
  Wrench,
  Info,
  Image as ImageIcon,
  Video,
  Target,
  Sliders,
  DollarSign,
  FolderGit2,
  Laptop,
  HelpCircle,
} from "lucide-react"
import { resolveProduct } from "@/lib/products/resolve-product"
import { resolveTool } from "@/lib/tools/resolve-tool"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { getProducts } from "@/db/queries/products/list"
import { getProductFaqs } from "@/db/queries/faqs/get-faqs"
import { MakerProfileCard } from "@/components/shared/maker-profile-card"
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
  sectionHeadingTitle,
  sectionHeadingSubtitle,
  sectionHeaderBox,
  sectionContentBox,
  toolSpecsContainer,
  specItemBox,
  specItemLabel,
  specItemValue,
  toolDeepDiveContainer,
  deepDiveSubSection,
  deepDiveSubSectionHeader,
  deepDiveSubHeading,
  deepDiveSubSubtitle,
  deepDiveSubSectionBody,
  deepDiveSubSectionText,
  faqContainer,
  faqItem,
  faqQuestionHeader,
  faqQuestionText,
  faqAnswerBody,
  faqAnswerText,
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

  const customFaqs = await getProductFaqs(product.id)

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
    linkedinUrl: product.linkedinUrl,
    discordUrl: product.discordUrl,
    appStoreUrl: product.appStoreUrl,
    playStoreUrl: product.playStoreUrl,
    chromeExtensionUrl: product.chromeExtensionUrl,
    websiteUrl: product.websiteUrl,
    author: product.submitterName
      ? {
          name: product.submitterName,
          url: product.submitterUsername
            ? `${siteUrl}/makers/${product.submitterUsername}`
            : undefined,
          country: product.submitterCountry,
        }
      : undefined,
    screenshots: product.images,
    videoUrl: product.demoVideoUrl,
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

  const productFaqs = customFaqs.map((f) => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
  }))

  const faqJsonLd = productFaqs.length > 0 ? faqSchema(productFaqs) : null
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
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
                imageUrl={product.logoUrl}
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
                </div>

                {(product.submitterName || product.submitterUsername) && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[11px] font-semibold text-slate-400 uppercase">
                      Built by
                    </span>
                    <MakerProfileCard
                      name={product.submitterName}
                      username={product.submitterUsername}
                      avatarUrl={product.submitterAvatarUrl}
                      country={product.submitterCountry}
                      state={product.submitterState}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            </div>

            <ProductActionButtons
              slug={product.slug}
              productId={product.id}
              tier={product.tier}
              initialLikes={product.likesCount}
              websiteUrl={product.websiteUrl}
              githubUrl={product.githubUrl}
              appStoreUrl={product.appStoreUrl}
              playStoreUrl={product.playStoreUrl}
              chromeExtensionUrl={product.chromeExtensionUrl}
            />
          </div>

          {/* Ask AI Sub-tray with dashed divider */}
          <div className="-mx-6 mt-2 -mb-8 flex flex-col gap-3 border-t border-dashed border-border bg-slate-50/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:-mx-8 md:px-8">
            <div className="flex shrink-0 items-center gap-2">
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
        <section className="border-b border-dashed border-border bg-white">
          <div className={sectionHeaderBox}>
            <h2 className={sectionHeadingTitle}>
              <Info className="size-3.5 text-slate-400" />
              About
            </h2>
          </div>
          <div className={sectionContentBox}>
            <p className="max-w-4xl text-sm leading-relaxed whitespace-pre-line text-slate-700 sm:text-base/7">
              {product.description}
            </p>
          </div>
        </section>

        {/* Screenshots Gallery (if present) */}
        {product.images && product.images.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <div className={sectionHeaderBox}>
              <h2 className={sectionHeadingTitle}>
                <ImageIcon className="size-3.5 text-slate-400" />
                Screenshots & Gallery
              </h2>
            </div>
            <div className="bg-slate-50/20 p-6 md:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {product.images.slice(0, 5).map((imgUrl, i) => (
                  <div
                    key={i}
                    className="group relative aspect-video overflow-hidden rounded-xl border border-dashed border-border bg-white shadow-2xs transition-all hover:border-slate-300"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`${product.name} preview ${i + 1}`}
                      className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Demo Video (if present) */}
        {product.demoVideoUrl && (
          <section className="border-b border-dashed border-border bg-white">
            <div className={sectionHeaderBox}>
              <h2 className={sectionHeadingTitle}>
                <Video className="size-3.5 text-slate-400" />
                Product Demo Video
              </h2>
            </div>
            <div className="p-6 md:p-8">
              <div className="aspect-video max-w-3xl overflow-hidden rounded-xl border border-dashed border-border bg-black shadow-xs">
                {product.demoVideoUrl.includes("youtube.com") ||
                product.demoVideoUrl.includes("youtu.be") ? (
                  <iframe
                    src={product.demoVideoUrl
                      .replace("watch?v=", "embed/")
                      .replace("youtu.be/", "youtube.com/embed/")}
                    title={`${product.name} demo video`}
                    className="size-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : product.demoVideoUrl.includes("loom.com") ? (
                  <iframe
                    src={product.demoVideoUrl.replace("share/", "embed/")}
                    title={`${product.name} loom demo`}
                    className="size-full border-0"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.demoVideoUrl}
                    controls
                    className="size-full"
                  />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Use Cases (if present) */}
        {product.useCases && (
          <section className="border-b border-dashed border-border bg-white">
            <div className={sectionHeaderBox}>
              <h2 className={sectionHeadingTitle}>
                <Target className="size-3.5 text-slate-400" />
                Target Use Cases
              </h2>
            </div>
            <div className={sectionContentBox}>
              <p className="max-w-4xl text-sm leading-relaxed whitespace-pre-line text-slate-700 sm:text-base/7">
                {product.useCases}
              </p>
            </div>
          </section>
        )}

        {/* Section 2: Product Specifications */}
        <section className="border-b border-dashed border-border bg-white">
          <div className={sectionHeaderBox}>
            <h2 className={sectionHeadingTitle}>
              <Sliders className="size-3.5 text-slate-400" />
              Product Specifications
            </h2>
          </div>

          <div className={toolSpecsContainer}>
            <div className={specItemBox}>
              <span className={specItemLabel}>
                <DollarSign className="size-3 text-slate-400" />
                Pricing Model
              </span>
              <span className={specItemValue}>{product.pricing}</span>
            </div>

            <div className={specItemBox}>
              <span className={specItemLabel}>
                <FolderGit2 className="size-3 text-slate-400" />
                Category
              </span>
              <span className={specItemValue}>
                {product.category ?? "Developer Tools"}
              </span>
            </div>

            <div className={specItemBox}>
              <span className={specItemLabel}>
                <Laptop className="size-3 text-slate-400" />
                Platforms
              </span>
              <span
                className={specItemValue}
                title={product.platforms?.join(", ")}
              >
                {product.platforms && product.platforms.length > 0
                  ? product.platforms.join(", ")
                  : "Web / Cloud"}
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Value Proposition & Deep Dive */}
        {(product.problemStatement ||
          product.solution ||
          product.uniqueValue) && (
          <section className="border-b border-dashed border-border bg-white">
            <div className={sectionHeaderBox}>
              <h2 className={sectionHeadingTitle}>
                <Sparkles className="size-3.5 text-amber-600" />
                Value Proposition & Deep Dive
              </h2>
            </div>

            <div className={toolDeepDiveContainer}>
              {product.problemStatement && (
                <div className={deepDiveSubSection}>
                  <div className={deepDiveSubSectionHeader}>
                    <h3 className={deepDiveSubHeading}>
                      <span className="inline-flex size-5 items-center justify-center rounded-sm bg-rose-100 font-mono text-[10px] font-bold text-rose-700">
                        01
                      </span>
                      The Problem It Solves
                    </h3>
                  </div>
                  <div className={deepDiveSubSectionBody}>
                    <p className={deepDiveSubSectionText}>
                      {product.problemStatement}
                    </p>
                  </div>
                </div>
              )}

              {product.solution && (
                <div className={deepDiveSubSection}>
                  <div className={deepDiveSubSectionHeader}>
                    <h3 className={deepDiveSubHeading}>
                      <span className="inline-flex size-5 items-center justify-center rounded-sm bg-emerald-100 font-mono text-[10px] font-bold text-emerald-700">
                        02
                      </span>
                      The Solution
                    </h3>
                  </div>
                  <div className={deepDiveSubSectionBody}>
                    <p className={deepDiveSubSectionText}>{product.solution}</p>
                  </div>
                </div>
              )}

              {product.uniqueValue && (
                <div className={deepDiveSubSection}>
                  <div className={deepDiveSubSectionHeader}>
                    <h3 className={deepDiveSubHeading}>
                      <span className="inline-flex size-5 items-center justify-center rounded-sm bg-indigo-100 font-mono text-[10px] font-bold text-indigo-700">
                        03
                      </span>
                      What Makes It Unique
                    </h3>
                  </div>
                  <div className={deepDiveSubSectionBody}>
                    <p className={deepDiveSubSectionText}>
                      {product.uniqueValue}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 5: Tech Stack & Tools Used */}
        {product.builtWithTools && product.builtWithTools.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <div className={sectionHeaderBox}>
              <h2 className={sectionHeadingTitle}>
                <Wrench className="size-3.5 text-indigo-600" />
                Tech Stack & Tools Used
              </h2>
              <p className={sectionHeadingSubtitle}>
                Developer tools, APIs, and infrastructure powering{" "}
                {product.name}
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 p-6 md:p-8">
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
          </section>
        )}

        {/* Section 6: Frequently Asked Questions */}
        {productFaqs.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <div className={sectionHeaderBox}>
              <h2 className={sectionHeadingTitle}>
                <HelpCircle className="size-3.5 text-slate-400" />
                Frequently Asked Questions
              </h2>
              <p className={sectionHeadingSubtitle}>
                Common questions and developer answers about {product.name}
              </p>
            </div>

            <div className={faqContainer}>
              {productFaqs.map((faq, idx) => (
                <div
                  key={faq.id ?? `${faq.question}-${idx}`}
                  className={faqItem}
                >
                  <div className={faqQuestionHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-slate-200 font-mono text-[10px] font-bold text-slate-700">
                      Q{idx + 1}
                    </span>
                    <h3 className={faqQuestionText}>{faq.question}</h3>
                  </div>
                  <div className={faqAnswerBody}>
                    <p className={faqAnswerText}>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 7: Ecosystem Showcase */}
        {/* <section className="border-b border-dashed border-border bg-slate-50/70 px-6 py-10 md:px-8 md:py-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-700 uppercase">
                <Layers className="size-4 text-indigo-600" /> Ecosystem Showcase
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Built with {product.name}?
              </h3>
              <p className="max-w-2xl text-xs text-slate-600">
                Showcase what you created using {product.name} and get featured
                in the {SITE_CONFIG.name} directory.
              </p>
            </div>
            <Button
              variant="default"
              size="sm"
              className="self-start rounded-none bg-slate-900 text-white hover:bg-slate-800 md:self-auto"
              render={<Link href={ROUTES.SHOWCASE} />}
            >
              <PlusCircle className="mr-1.5 size-3.5" />
              Showcase Your Build
            </Button>
          </div>
        </section> */}
      </article>
    </>
  )
}

export default ProductDetailPage
