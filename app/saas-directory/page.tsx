import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight, HelpCircle } from "lucide-react"
import {
  getCachedProducts,
  getCachedProductsStats,
} from "@/db/queries/products/list"
import { getCachedProductCategories } from "@/db/queries/categories/list"
import { ProductCard } from "@/components/shared/product-card"
import { Button } from "@/components/ui/button"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { ReadyToShowcaseCta } from "@/components/shared/ready-to-showcase-cta"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  comparisonPageContainer,
  comparisonHeroWrapper,
  comparisonCategoryPill,
  comparisonH1,
  comparisonLeadParagraph,
  comparisonTrustBar,
  comparisonSectionTitle,
  comparisonSectionSubtitle,
  comparisonTableCard,
} from "@/utils/styles"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "SaaS Directory: Discover & Submit SaaS Products",
  description:
    "Explore the curated directory of verified SaaS products, indie software tools, and tech-stack architectures. Submit your SaaS for permanent discovery, Do-Follow backlinks, and AI agent citations.",
  keywords: [
    "saas directory",
    "submit saas",
    "software directory",
    "best saas tools 2026",
    "saas listing sites",
    "indie saas directory",
    "where to submit saas",
    "saas launch platform",
    "free saas directories",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/saas-directory`,
  },
  openGraph: {
    title: `SaaS Directory — Discover & Submit Software Products (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
    description:
      "Curated directory of verified SaaS products, indie software tools, and live tech stacks. Submit your product for continuous discovery.",
    url: `${SITE_CONFIG.url}/saas-directory`,
    type: "website",
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `SaaS Directory | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `SaaS Directory — Discover & Submit Software (${new Date().getFullYear()})`,
    description:
      "Curated directory of verified SaaS products, indie software tools, and live tech stacks.",
    images: [SITE_CONFIG.ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const DIRECTORY_COMPARISONS = [
  {
    platform: "LaunchNests SaaS Directory",
    cost: "Free or $15 one-time",
    lifespan: "Perpetual static catalog",
    linkType: "Permanent Do-Follow",
    techStack: "Two-way 'Built With' graph",
    aiReadiness: "/llms.txt + MCP server",
    highlight: true,
  },
  {
    platform: "Legacy Review Portals (G2/Capterra)",
    cost: "Free basic; $1,000s/mo enterprise",
    lifespan: "Perpetual review listing",
    linkType: "Redirects / No-Follow",
    techStack: "None",
    aiReadiness: "Restricted / Paywalled",
  },
  {
    platform: "24-Hour Launch Boards (Product Hunt)",
    cost: "Free core; high ad pricing",
    lifespan: "24 hours then archived",
    linkType: "Tracking redirect (/r/)",
    techStack: "None",
    aiReadiness: "Standard HTML only",
  },
  {
    platform: "Consumer AI Directories (CodeHype)",
    cost: "Free (long queue) or $39–$299",
    lifespan: "Category listings",
    linkType: "Profile backlink",
    techStack: "None",
    aiReadiness: "Standard HTML only",
  },
]

const EDITORIAL_APPROVED = [
  "Live, functional SaaS products with active landing pages or sign-up flows.",
  "Developer tools, APIs, libraries, and open-source infrastructure.",
  "Transparent pricing information (Free, Freemium, or Paid tiers).",
  "Verified tech stacks connecting your product to underlying developer tools.",
]

const EDITORIAL_REJECTED = [
  "Empty landing pages with nothing more than an email capture form and no product.",
  "Low-quality link farms, spun affiliate pages, or spam aggregators.",
  "Websites with broken SSL certificates or malicious redirects.",
  "Duplicated submissions of identical products under different names.",
]

const FAQS = [
  {
    question: "How long does it take for a SaaS submission to be reviewed?",
    answer:
      "Our team reviews submissions within 12 to 24 hours. Once approved, your product is immediately published, indexed in the sitemap, and added to the /llms.txt AI feed.",
  },
  {
    question: "Do I get a permanent Do-Follow SEO backlink?",
    answer:
      "Yes. All approved products on the Premium and Premium+ tiers receive a direct Do-Follow link to their site. Free listings get a nofollow link, or a Do-Follow link while the LaunchNests badge stays active on their site.",
  },
  {
    question: "What is the 'Built With' tech-stack graph?",
    answer:
      "When you submit your SaaS, you can tag the developer tools, databases, and APIs you built with (e.g. Next.js, Supabase, Stripe). Your product is then cross-promoted on those tools' ecosystem showcase pages.",
  },
  {
    question: "How does LaunchNests help with AI search visibility (GEO)?",
    answer:
      "Every page is mirrored with a raw Markdown twin endpoint (/api/md/*) and indexed into our /llms.txt and /llms-full.txt files. AI assistants like Cursor, ChatGPT, and Claude read these endpoints when answering user queries.",
  },
]

const SaasDirectoryPage = async () => {
  const currentYear = new Date().getFullYear()

  const [products, stats, categories] = await Promise.all([
    getCachedProducts({ limit: 12, sortBy: "likes" }),
    getCachedProductsStats(),
    getCachedProductCategories(),
  ])

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "SaaS Directory", url: `${SITE_CONFIG.url}/saas-directory` },
  ])

  const collectionLd = collectionPageSchema({
    name: `Curated SaaS Directory (${currentYear})`,
    description: `Directory of verified SaaS platforms and indie software products ranked by community adoption.`,
    url: `${SITE_CONFIG.url}/saas-directory`,
    items: products.map((p) => ({
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

      <div className="flex w-full flex-col overflow-x-clip bg-white">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="border-b border-dashed border-border bg-slate-50/50 px-4 py-3 text-xs font-medium text-slate-500 sm:px-6 md:px-8"
        >
          <div className="mx-auto flex max-w-6xl min-w-0 items-center gap-2">
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
            <span
              className="truncate font-semibold text-slate-900"
              aria-current="page"
            >
              SaaS Directory
            </span>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className={comparisonPageContainer}>
          {/* Hero Section */}
          <header className={comparisonHeroWrapper}>
            <div className={comparisonCategoryPill}>
              <span>Software Catalog · {currentYear}</span>
            </div>

            <h1 className={comparisonH1}>
              Curated SaaS Directory for Modern Software & Indie Tools
            </h1>

            <p className={comparisonLeadParagraph}>
              Discover verified software-as-a-service (SaaS) products, indie
              developer utilities, and AI applications. Every product in the{" "}
              <strong className="font-semibold text-slate-800">
                {SITE_CONFIG.name} SaaS Directory
              </strong>{" "}
              is hand-moderated for quality, transparently ranked by community
              feedback, and mapped to its underlying developer tech stack.
            </p>

            <div className="mt-2 flex w-full flex-wrap items-center justify-center gap-3">
              <Button
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT_PRODUCT} />}
                className="w-full text-xs font-semibold sm:w-auto"
              >
                Submit Your SaaS — Free
              </Button>
              <Button
                variant="outline"
                size="default"
                nativeButton={false}
                render={<Link href={ROUTES.PRODUCTS} />}
                className="w-full text-xs font-semibold text-slate-700 sm:w-auto"
              >
                Explore All Products
              </Button>
            </div>

            <div className={comparisonTrustBar}>
              <span>{stats.totalCount} Verified Products</span>
              <span>·</span>
              <span>{categories.length} Specialized Categories</span>
              <span>·</span>
              <span>12–24h Review Turnaround</span>
              <span>·</span>
              <span>Permanent Do-Follow Links</span>
            </div>
          </header>

          {/* Category Navigation Hub */}
          <section id="categories" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Browse SaaS Products by Category
              </h2>
              <p className={comparisonSectionSubtitle}>
                Explore specialized software collections across development,
                marketing, productivity, and artificial intelligence.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 border border-dashed border-border bg-white rounded-xl overflow-hidden">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={ROUTES.PRODUCT_CATEGORY(cat.slug)}
                  className="group relative flex flex-col justify-between p-3.5 border-b border-r border-dashed border-border transition-colors hover:bg-slate-50/50"
                >
                  <span className="text-xs font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                    {cat.name}
                  </span>
                  <span className="mt-2 font-mono text-[11px] text-slate-500">
                    {cat.count} {cat.count === 1 ? "product" : "products"}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Rated SaaS Products Feed */}
          <section id="top-products" className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className={comparisonSectionTitle}>
                  Top Rated SaaS Products
                </h2>
                <p className={comparisonSectionSubtitle}>
                  Ranked by community upvotes and verified developer architectures.
                </p>
              </div>
              <Link
                href={ROUTES.PRODUCTS}
                className="font-mono text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                View Full Directory ({stats.totalCount}) →
              </Link>
            </div>

            <div className="flex flex-col divide-y divide-dashed divide-border border border-dashed border-border bg-white rounded-xl overflow-hidden shadow-2xs">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={idx}
                  showMedals={false}
                  showTrendingBadge={false}
                />
              ))}
            </div>
          </section>

          {/* Directory Comparison Matrix */}
          <section id="directory-comparison" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Why Submit Your SaaS to LaunchNests vs Traditional Directories?
              </h2>
              <p className={comparisonSectionSubtitle}>
                A direct comparison across submission costs, discovery lifespan,
                link equity, and autonomous AI search readiness.
              </p>
            </div>

            <div className={comparisonTableCard}>
              <Table
                containerClassName="overflow-x-auto"
                className="w-full text-left text-xs"
              >
                <TableHeader className="border-b border-dashed border-border bg-slate-50/80">
                  <TableRow className="border-b border-dashed border-border">
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Platform Type
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Submission Cost
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Discovery Lifespan
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Backlink Type
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      Tech Stack
                    </TableHead>
                    <TableHead className="px-4 py-3.5 font-mono text-xs font-bold tracking-wider text-slate-700 uppercase">
                      AI Readiness
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-dashed divide-border text-slate-600">
                  {DIRECTORY_COMPARISONS.map((row) => (
                    <TableRow
                      key={row.platform}
                      className={
                        row.highlight
                          ? "border-b border-dashed border-border bg-indigo-50/20 font-medium"
                          : "border-b border-dashed border-border hover:bg-slate-50/50"
                      }
                    >
                      <TableCell className="px-4 py-3.5 font-semibold text-slate-900">
                        {row.platform}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3.5 text-xs ${
                          row.highlight
                            ? "font-semibold text-indigo-700"
                            : "text-slate-700"
                        }`}
                      >
                        {row.cost}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3.5 text-xs ${
                          row.highlight
                            ? "font-semibold text-indigo-700"
                            : "text-slate-600"
                        }`}
                      >
                        {row.lifespan}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3.5 text-xs ${
                          row.highlight
                            ? "font-semibold text-emerald-700"
                            : "text-slate-500"
                        }`}
                      >
                        {row.linkType}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3.5 text-xs ${
                          row.highlight
                            ? "font-semibold text-indigo-700"
                            : "text-slate-500"
                        }`}
                      >
                        {row.techStack}
                      </TableCell>
                      <TableCell
                        className={`px-4 py-3.5 text-xs ${
                          row.highlight
                            ? "font-semibold text-indigo-700"
                            : "text-slate-500"
                        }`}
                      >
                        {row.aiReadiness}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Submission Guidelines & Editorial Standards */}
          <section id="guidelines" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                What Gets Approved in the LaunchNests SaaS Directory?
              </h2>
              <p className={comparisonSectionSubtitle}>
                To protect our directory authority and maintain high trust with
                search engine crawlers and users, every listing undergoes human
                verification.
              </p>
            </div>

            <div className="relative grid grid-cols-1 divide-y divide-dashed divide-border border border-dashed border-border bg-white md:grid-cols-2 md:divide-y-0 md:divide-x rounded-xl overflow-hidden">
              <div className="group relative flex flex-col p-6 md:p-8">
                <CornerBrackets />
                <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                  <span className="font-mono text-xs font-bold tracking-wider text-emerald-700 uppercase">
                    Editorial Standards
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-emerald-600">
                    APPROVED
                  </span>
                </div>
                <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600 sm:text-sm">
                  {EDITORIAL_APPROVED.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-emerald-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="group relative flex flex-col p-6 md:p-8">
                <CornerBrackets />
                <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
                  <span className="font-mono text-xs font-bold tracking-wider text-rose-700 uppercase">
                    Editorial Standards
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-rose-600">
                    REJECTED
                  </span>
                </div>
                <ul className="mt-4 flex flex-col gap-2.5 text-xs text-slate-600 sm:text-sm">
                  {EDITORIAL_REJECTED.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-rose-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Frequently Asked Questions */}
          <section id="faqs" className="flex flex-col gap-4">
            <div>
              <h2 className={comparisonSectionTitle}>
                Frequently Asked Questions About the SaaS Directory
              </h2>
              <p className={comparisonSectionSubtitle}>
                Everything you need to know about listing your software, SEO
                backlinks, and moderation.
              </p>
            </div>

            <div className="flex flex-col divide-y divide-dashed divide-border rounded-xl border border-dashed border-border bg-white shadow-2xs">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-5 sm:p-6">
                  <div className="flex items-start gap-2.5">
                    <HelpCircle className="mt-0.5 size-4 shrink-0 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {faq.question}
                    </h3>
                  </div>
                  <p className="pl-6.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Closing Call to Action */}
          <ReadyToShowcaseCta
            title={`Ready to Get Your SaaS Discovered by Developers & Buyers?`}
            description={`Join hundreds of verified software products cataloged on ${SITE_CONFIG.name}. Start with a free submission today.`}
            primaryActionLabel="Launch Your SaaS Today"
            primaryActionHref={ROUTES.SUBMIT_PRODUCT}
            secondaryActionLabel="View Listing Plans"
            secondaryActionHref={ROUTES.PRICING}
          />
        </div>
      </div>
    </>
  )
}

export default SaasDirectoryPage
