import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { headers } from "next/headers"
import {
  ArrowLeft,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  Layers,
  Compass,
  PlusCircle,
} from "lucide-react"
import { getBlogBySlug, getSimilarBlogs } from "@/db/queries/blogs"
import { BlogRowItem } from "@/components/blog/blog-row-item"
import { getAdminSession } from "@/lib/auth/admin"
import { auth } from "@/lib/auth"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { PLANS, type Tier } from "@/constants/plans"
import { BlogPreviewBanner } from "@/components/blog/blog-preview-banner"
import { BlogVerdictBox } from "@/components/blog/blog-verdict-box"
import { BlogMarkdownContent } from "@/components/blog/blog-markdown-content"
import { BlogSidebarCard } from "@/components/blog/blog-sidebar-card"
import { BlogTableOfContents } from "@/components/blog/blog-table-of-contents"
import { BlogMobileToc } from "@/components/blog/blog-mobile-toc"
import { BlogFaqs } from "@/components/blog/blog-faqs"
import { extractHeadingsFromMarkdown, type BlogTocItem } from "@/lib/blog/headings"
import { AskAiBar } from "@/components/shared/ask-ai-bar"
import { Button } from "@/components/ui/button"
import {
  comparisonHeroWrapper,
  comparisonCategoryPill,
  comparisonH1,
  comparisonLeadParagraph,
  comparisonTrustBar,
  comparisonCtaCard,
  comparisonSectionTitle,
  comparisonSectionSubtitle,
} from "@/utils/styles"
import {
  safeJsonLd,
  breadcrumbSchema,
  buildEntityGraph,
  techArticleSchema,
  faqSchema,
  productSchema,
  toolSchema,
} from "@/lib/seo/schema"

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export const generateMetadata = async ({
  params,
}: BlogPostPageProps): Promise<Metadata> => {
  const { slug } = await params
  const reqHeaders = await headers()

  // Authenticate viewer for scheduled preview check
  const [adminAuth, session] = await Promise.all([
    getAdminSession(reqHeaders),
    auth.api.getSession({ headers: reqHeaders }).catch(() => null),
  ])

  const isAdmin = adminAuth.isAdmin
  const viewerId = session?.user?.id || null

  const data = await getBlogBySlug(slug, {
    allowScheduledPreview: true,
    isAdmin,
    viewerId,
  })

  if (!data) {
    return {
      title: `Launch Story Not Found | ${SITE_CONFIG.name}`,
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { blog, tool, product } = data
  const item = tool || product
  const canonicalUrl = `${SITE_CONFIG.url}/blog/${blog.slug}`

  const now = new Date()
  const isScheduledPreview = Boolean(
    blog.publishedAt && blog.publishedAt > now
  )

  return {
    title: `${blog.metaTitle} | ${SITE_CONFIG.name}`,
    description: blog.metaDescription,
    robots: isScheduledPreview
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      canonical: canonicalUrl,
      types: {
        "text/markdown": `${SITE_CONFIG.url}/blog/${blog.slug}.md`,
      },
    },
    openGraph: {
      title: blog.title,
      description: blog.metaDescription,
      url: canonicalUrl,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
      modifiedTime: blog.updatedAt.toISOString(),
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: blog.coverImageUrl || item?.logoUrl || SITE_CONFIG.ogImageUrl,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.metaDescription,
      images: [blog.coverImageUrl || item?.logoUrl || SITE_CONFIG.ogImageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const reqHeaders = await headers()

  // Authenticate viewer for scheduled preview check
  const [adminAuth, session] = await Promise.all([
    getAdminSession(reqHeaders),
    auth.api.getSession({ headers: reqHeaders }).catch(() => null),
  ])

  const isAdmin = adminAuth.isAdmin
  const viewerId = session?.user?.id || null

  const data = await getBlogBySlug(slug, {
    allowScheduledPreview: true,
    isAdmin,
    viewerId,
  })

  if (!data) {
    notFound()
  }

  const { blog, tool, product, submitter } = data
  const item = tool || product

  if (!item) {
    notFound()
  }

  const now = new Date()
  const isScheduledPreview = Boolean(
    blog.publishedAt && blog.publishedAt > now
  )

  const formattedDate = (blog.publishedAt || blog.createdAt).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  )

  const similarBlogs = await getSimilarBlogs({
    currentBlogId: blog.id,
    categoryId: item.categoryId,
    limit: 3,
  })

  // Extract headings from markdown and build comprehensive Table of Contents
  const markdownHeadings = extractHeadingsFromMarkdown(blog.content)
  const allTocItems: BlogTocItem[] = [
    { id: "quick-verdict", text: "Quick Verdict", level: 2 },
    ...markdownHeadings,
  ]

  if (blog.faqs && blog.faqs.length > 0) {
    allTocItems.push({
      id: "faqs",
      text: "Frequently Asked Questions",
      level: 2,
    })
  }

  allTocItems.push({
    id: "product-overview",
    text: `About ${item.name}`,
    level: 2,
  })

  if (similarBlogs && similarBlogs.length > 0) {
    allTocItems.push({
      id: "similar-stories",
      text: "Similar Launches",
      level: 2,
    })
  }

  // Multi-entity JSON-LD Schema
  const schemas: any[] = [
    breadcrumbSchema([
      { name: "Home", url: SITE_CONFIG.url },
      { name: "Launch Stories", url: `${SITE_CONFIG.url}/blog` },
      { name: item.name, url: `${SITE_CONFIG.url}/blog/${blog.slug}` },
    ]),
    techArticleSchema({
      title: blog.title,
      description: blog.metaDescription,
      url: `${SITE_CONFIG.url}/blog/${blog.slug}`,
      publishedAt: blog.publishedAt,
      updatedAt: blog.updatedAt,
      authorName: submitter?.name || SITE_CONFIG.creator,
      coverImageUrl: blog.coverImageUrl || item.logoUrl,
      keywords: item.tags || [],
    }),
  ]

  if (blog.faqs && blog.faqs.length > 0) {
    schemas.push(faqSchema(blog.faqs))
  }

  if (data.product) {
    schemas.push(
      productSchema({
        name: data.product.name,
        description: data.product.description,
        url: `${SITE_CONFIG.url}/products/${data.product.slug}`,
        slug: data.product.slug,
        logoUrl: data.product.logoUrl,
        pricing: data.product.pricing,
        tier: data.product.tier,
        websiteUrl: data.product.websiteUrl,
      })
    )
  } else if (data.tool) {
    schemas.push(
      toolSchema({
        name: data.tool.name,
        description: data.tool.description,
        url: `${SITE_CONFIG.url}/tools/${data.tool.slug}`,
        slug: data.tool.slug,
        logoUrl: data.tool.logoUrl,
        pricing: data.tool.pricing,
        tier: data.tool.tier,
        websiteUrl: data.tool.websiteUrl,
      })
    )
  }

  const jsonLd = buildEntityGraph(schemas)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />

      <div className="flex w-full flex-col overflow-x-clip bg-white">
        {/* Breadcrumb Strip (matches producthunt-alternative) */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-500 sm:px-6 md:px-8"
        >
          <div className="mx-auto flex max-w-7xl min-w-0 items-center gap-2">
            <Link
              href={ROUTES.HOME}
              className="flex shrink-0 items-center gap-1 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="size-3 shrink-0" />
              Home
            </Link>
            <ChevronRight
              className="size-3 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <Link
              href={ROUTES.BLOG}
              className="flex shrink-0 items-center gap-1 transition-colors hover:text-slate-900"
            >
              Launch Stories
            </Link>
            <ChevronRight
              className="size-3 shrink-0 text-slate-400"
              aria-hidden="true"
            />
            <span
              className="truncate font-semibold text-slate-900"
              aria-current="page"
            >
              {item.name}
            </span>
          </div>
        </nav>

        {/* Hero Section (matches comparisonHeroWrapper) */}
        <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pt-8 sm:pt-12 pb-10 flex flex-col gap-5 border-b border-dashed border-border text-center items-center">
          <div className={comparisonCategoryPill}>
            <Sparkles className="size-3.5" />
            <span>LAUNCH SPOTLIGHT & TECH ARCHITECTURE</span>
          </div>

          <h1 className={comparisonH1}>{blog.title}</h1>

          <p className={comparisonLeadParagraph}>{blog.excerpt}</p>

          {/* Action CTAs */}
          <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
            <Button
              size="default"
              nativeButton={false}
              render={
                <a
                  href={item.websiteUrl}
                  target="_blank"
                  rel="noopener"
                  title={`Visit ${item.name}`}
                />
              }
              className="w-full gap-2 text-xs font-semibold sm:w-auto"
            >
              <ExternalLink className="size-4" />
              Visit {item.name} Website
            </Button>
            <Button
              variant="outline"
              size="default"
              nativeButton={false}
              render={
                <Link
                  href={
                    data.product
                      ? ROUTES.PRODUCT(data.product.slug)
                      : ROUTES.TOOL(data.tool!.slug)
                  }
                />
              }
              className="w-full gap-2 text-xs font-semibold text-slate-700 sm:w-auto"
            >
              <Compass className="size-4 text-slate-500" />
              View Directory Profile & Upvotes
            </Button>
          </div>

          {/* Trust and Verification Bar (matches comparisonTrustBar) */}
          <div className={comparisonTrustBar}>
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              Verified Editorial Review
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5 text-blue-600" />
              {formattedDate}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5 text-indigo-600" />
              {blog.readingTimeMinutes} Min Read
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Layers className="size-3.5 text-amber-600" />
              Permanent Do-Follow Link
            </span>
          </div>

          {/* Interactive Ask AI Assistant Bar */}
          <div className="mt-3 w-full max-w-xl">
            <AskAiBar
              prompt={`Tell me about ${item.name}: what is it, its core architecture, and is it recommended for developers?`}
              label={`ASK AI ABOUT ${item.name.toUpperCase()}`}
              align="center"
            />
          </div>
        </header>

        {/* Content Layout with Left Sticky TOC + Center Article + Right Sticky Product Card */}
        <div className="mx-auto flex w-full max-w-7xl min-h-[calc(100vh-4rem)] min-w-0 bg-white items-start">
          {/* Left Column: Sticky Table of Contents */}
          <BlogTableOfContents items={allTocItems} />

          {/* Center Main Article Column: bounded by the two vertical dashed lines */}
          <main className="flex-1 min-w-0 lg:border-l xl:border-r border-dashed border-border flex flex-col divide-y divide-dashed divide-border bg-white">
            {/* Mobile collapsible TOC (< lg) */}
            <div className="p-4 sm:p-6 block lg:hidden">
              <BlogMobileToc items={allTocItems} />
            </div>

            {/* Scheduled Preview Banner if not live yet */}
            {isScheduledPreview && (
              <div className="p-4 sm:p-6 bg-amber-50/40">
                <BlogPreviewBanner launchDate={blog.publishedAt} />
              </div>
            )}

            {/* Quick Verdict Box with full-width Key Strengths & Tradeoffs comparison table */}
            <BlogVerdictBox
              rating={blog.verdictRating || 4.7}
              summary={blog.verdictSummary || blog.excerpt}
              pros={blog.pros || []}
              cons={blog.cons || []}
              brandName={item.name}
            />

            {/* Main Markdown Body */}
            <div className="p-6 sm:p-8 md:p-10">
              <BlogMarkdownContent markdown={blog.content} />
            </div>

            {/* Technical FAQs (matches producthunt-alternative) */}
            {blog.faqs && blog.faqs.length > 0 && (
              <BlogFaqs faqs={blog.faqs} />
            )}

            {/* Mobile / Tablet Inlined Product Card (shown only when right sidebar is hidden on < xl) */}
            <div className="p-6 sm:p-8 block xl:hidden bg-slate-50/20">
              <BlogSidebarCard
                itemType={data.product ? "product" : "tool"}
                item={item}
                submitter={submitter}
                isSidebar={false}
              />
            </div>

            {/* Similar Launch Stories / Related Architecture Breakdowns */}
            {similarBlogs && similarBlogs.length > 0 && (
              <section id="similar-stories" className="flex flex-col scroll-mt-24">
                <div className="flex flex-col gap-1.5 border-b border-dashed border-border bg-slate-50/50 px-6 py-5 sm:px-8 md:px-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-indigo-600" />
                    <h3 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase">
                      Similar Launch Stories
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Explore more deep-dive architectural breakdowns, technical spotlights, and verified developer launches.
                  </p>
                </div>

                <div className="flex flex-col divide-y divide-dashed border-b border-dashed border-border">
                  {similarBlogs.map((similarItem) => (
                    <BlogRowItem
                      key={similarItem.blog.id}
                      blog={similarItem.blog}
                      tool={similarItem.tool}
                      product={similarItem.product}
                      submitter={similarItem.submitter}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Bottom CTA Card */}
            <div className="p-6 sm:p-8 md:p-10">
              <section className={comparisonCtaCard}>
                <div className="flex flex-col gap-2">
                  <h3 className={comparisonSectionTitle}>
                    Get Discovered by AI Search Engines & Verified Developers
                  </h3>
                  <p className={comparisonSectionSubtitle}>
                    Submit your project to {SITE_CONFIG.name} to index and get cited across modern AI answer engines including ChatGPT, Perplexity, Claude, Gemini, and Grok. Unlock permanent Do-Follow SEO backlinks by embedding our verified launch badge or upgrading to a Premium listing, complete with in-depth technical architecture spotlights.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    size="default"
                    nativeButton={false}
                    render={<Link href={ROUTES.SUBMIT} />}
                    className="gap-2 text-xs font-semibold"
                  >
                    <PlusCircle className="size-4" />
                    Submit Your Project
                  </Button>
                  <Button
                    variant="outline"
                    size="default"
                    nativeButton={false}
                    render={<Link href={ROUTES.PRICING} />}
                    className="gap-2 text-xs font-semibold text-slate-700"
                  >
                    View Launch Plans
                  </Button>
                </div>
              </section>
            </div>
          </main>

          {/* Right Column: Sticky Product Card on XL screens */}
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-80 shrink-0 flex-col overflow-y-auto bg-white p-5 sm:p-6 xl:flex scrollbar-thin">
            <BlogSidebarCard
              itemType={data.product ? "product" : "tool"}
              item={item}
              submitter={submitter}
              isSidebar={true}
            />
          </aside>
        </div>
      </div>
    </>
  )
}
