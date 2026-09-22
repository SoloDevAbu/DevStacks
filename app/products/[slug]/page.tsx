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
import { getSocialCardImage } from "@/lib/seo/social-image"
import { formatGeoMetaTags } from "@/utils/country"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { getProducts } from "@/db/queries/products/list"
import { getProductFaqs } from "@/db/queries/faqs/get-faqs"
import { MakerProfileCard } from "@/components/shared/maker-profile-card"
import { productSchema, breadcrumbSchema, faqSchema, safeJsonLd } from "@/lib/seo/schema"
import { ProductLogo } from "@/components/shared/product-logo"
import { getFaviconUrl } from "@/utils/urls"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { LaunchBadge } from "@/components/shared/launch-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductActionButtons } from "@/components/products/product-action-buttons"
import { HoverOutline } from "@/components/shared/hover-outline"
import { DetailSectionHeader } from "@/components/shared/detail-section-header"
import { CommentsSection } from "@/components/shared/comments-section"
import { cn } from "@/lib/utils"
import {
  pricingBadgeColor,
  sectionContentBox,
  productSpecsContainer,
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
    `Explore ${product.name} — ${product.tagline} on ${SITE_CONFIG.name}. Verified Premium launch featuring architecture breakdown, live demo, and maker insights.`
  const canonicalUrl = `${SITE_CONFIG.url}/products/${product.slug}`
  const keywords = product.keywords
    ? product.keywords.split(",").map((k) => k.trim())
    : [
        product.name,
        ...(product.tags ?? []),
        "developer product",
        "verified developer launch",
        "First 100 Launches",
        "software",
        SITE_CONFIG.name,
      ]

  const socialImage = getSocialCardImage(product.logoUrl, product.images)
  const geoTags = formatGeoMetaTags(product.submitterCountry, product.submitterState)

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
          alt: `${product.name} on ${SITE_CONFIG.name}`,
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
    countryOfOrigin: product.submitterCountry,
    spatialCoverage: product.geoTarget,
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
  const aiPrompt = AI_PROMPTS.product(
    product.name,
    product.tagline,
    product.aiContext || product.description,
    productUrl,
    `${productUrl}.md`
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(prodJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
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
                imageUrl={
                  product.logoUrl?.trim() || getFaviconUrl(product.websiteUrl)
                }
                websiteUrl={product.websiteUrl}
                alt={product.name}
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
                  <LaunchBadge />
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
          <DetailSectionHeader title="About" icon={Info} theme="blue" />
          <div className={sectionContentBox}>
            <p className={detailSectionText}>{product.description}</p>
          </div>
        </section>

        {/* Screenshots Gallery (if present) */}
        {product.images && product.images.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Screenshots & Gallery"
              icon={ImageIcon}
              theme="sky"
            />
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
            <DetailSectionHeader
              title="Product Demo Video"
              icon={Video}
              theme="violet"
            />
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
            <DetailSectionHeader
              title="Target Use Cases"
              icon={Target}
              theme="emerald"
            />
            <div className={sectionContentBox}>
              <p className={detailSectionText}>{product.useCases}</p>
            </div>
          </section>
        )}

        {/* Section 2: Product Specifications */}
        <section className="border-b border-dashed border-border bg-white">
          <DetailSectionHeader
            title="Product Specifications"
            icon={Sliders}
            theme="slate"
          />

          <div className={productSpecsContainer}>
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
            <DetailSectionHeader
              title="Value Proposition & Deep Dive"
              icon={Sparkles}
              theme="amber"
            />

            <div className={toolDeepDiveContainer}>
              {product.problemStatement && (
                <div className={deepDiveItem}>
                  <div className={deepDiveItemHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-rose-100 font-mono text-[10px] font-bold text-rose-700">
                      01
                    </span>
                    <h3 className={deepDiveItemTitle}>The Problem It Solves</h3>
                  </div>
                  <p className={deepDiveItemText}>{product.problemStatement}</p>
                </div>
              )}

              {product.solution && (
                <div className={deepDiveItem}>
                  <div className={deepDiveItemHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-emerald-100 font-mono text-[10px] font-bold text-emerald-700">
                      02
                    </span>
                    <h3 className={deepDiveItemTitle}>The Solution</h3>
                  </div>
                  <p className={deepDiveItemText}>{product.solution}</p>
                </div>
              )}

              {product.uniqueValue && (
                <div className={deepDiveItem}>
                  <div className={deepDiveItemHeader}>
                    <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-sm bg-indigo-100 font-mono text-[10px] font-bold text-indigo-700">
                      03
                    </span>
                    <h3 className={deepDiveItemTitle}>What Makes It Unique</h3>
                  </div>
                  <p className={deepDiveItemText}>{product.uniqueValue}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Section 5: Tech Stack & Tools Used */}
        {product.builtWithTools && product.builtWithTools.length > 0 && (
          <section className="border-b border-dashed border-border bg-white">
            <DetailSectionHeader
              title="Tech Stack & Tools Used"
              subtitle={`Developer tools, APIs, and infrastructure powering ${product.name}`}
              icon={Wrench}
              theme="indigo"
            />

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
            <DetailSectionHeader
              title="Frequently Asked Questions"
              subtitle={`Common questions and developer answers about ${product.name}`}
              icon={HelpCircle}
              theme="teal"
            />

            <div className={faqContainer}>
              {productFaqs.map((faq, idx) => (
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

        {/* Section: Comments & Community Discussion */}
        <CommentsSection
          entityType="product"
          slug={product.slug}
          entityName={product.name}
        />

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
