import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Globe,
  Hammer,
  Search,
  Zap,
  TrendingUp,
} from "lucide-react"
import {
  getCachedProducts,
  getCachedProductsStats,
} from "@/db/queries/products/list"
import { getCachedProductCategories } from "@/db/queries/categories/list"
import { ProductCard } from "@/components/shared/product-card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  breadcrumbSchema,
  collectionPageSchema,
  buildEntityGraph,
  safeJsonLd,
} from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const revalidate = 3600

export const metadata: Metadata = {
  title: `SaaS Directory — Discover & Submit Verified Software Products (${new Date().getFullYear()})`,
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
    title: `SaaS Directory — Discover & Submit Verified Software Products (${new Date().getFullYear()}) | ${SITE_CONFIG.name}`,
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
              <span
                className="font-semibold text-slate-900"
                aria-current="page"
              >
                SaaS Directory
              </span>
            </li>
          </ol>
        </nav>

        {/* Hero Section */}
        <header className="border-b border-dashed border-border bg-white px-6 py-10 md:px-8 md:py-16">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-blue-700 uppercase">
              <Package className="size-4 text-blue-600" />
              <span>Verified Software Catalog ({currentYear})</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Curated SaaS Directory for Modern Software & Indie Tools
            </h1>

            <p className="max-w-3xl text-sm leading-relaxed font-normal text-slate-600 sm:text-base">
              Discover verified software-as-a-service (SaaS) products, indie
              developer utilities, and AI applications. Every product in the{" "}
              <strong className="font-semibold text-slate-800">
                {SITE_CONFIG.name} SaaS Directory
              </strong>{" "}
              is hand-moderated for quality, transparently ranked by community
              feedback, and mapped to its underlying developer tech stack.
            </p>

            {/* Live Metrics Row */}
            <div className="mt-2 flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-700">
              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Package className="mr-1.5 size-3.5 text-blue-600" />
                {stats.totalCount} Verified SaaS Products
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Layers className="mr-1.5 size-3.5 text-indigo-600" />
                {categories.length} Specialized Categories
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <Clock className="mr-1.5 size-3.5 text-emerald-600" />
                12–24h Review Turnaround
              </Badge>

              <Badge
                variant="outline"
                className="border-slate-300 bg-slate-50 px-3 py-1.5 text-slate-800"
              >
                <ShieldCheck className="mr-1.5 size-3.5 text-amber-600" />
                Permanent Do-Follow Link Equity
              </Badge>
            </div>

            {/* CTA Group */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link href={ROUTES.SUBMIT_PRODUCT} className={cn(buttonVariants({ variant: "default" }), "rounded-none bg-slate-900 text-white")}>
                  Submit Your SaaS Product
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              <Link href={ROUTES.PRODUCTS} className={cn(buttonVariants({ variant: "outline" }), "rounded-none")}>Explore All Products</Link>
            </div>
          </div>
        </header>

        {/* Category Navigation Hub */}
        <section className="border-b border-dashed border-border bg-slate-50/40 px-6 py-8 md:px-8">
          <div className="mb-4 flex flex-col gap-1">
            <h2 className="text-base font-bold text-slate-900 sm:text-xl">
              Browse SaaS Products by Category
            </h2>
            <p className="text-xs text-slate-600 sm:text-sm">
              Explore specialized software collections across development,
              marketing, productivity, and artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={ROUTES.PRODUCT_CATEGORY(cat.slug)}
                className="flex flex-col justify-between rounded-lg border border-dashed border-border bg-white p-3.5 shadow-2xs transition-all hover:border-slate-400 hover:bg-slate-50"
              >
                <span className="text-xs font-semibold text-slate-900">
                  {cat.name}
                </span>
                <span className="mt-2 text-[11px] font-mono text-slate-500">
                  {cat.count} {cat.count === 1 ? "product" : "products"}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Top SaaS Tools Feed */}
        <section className="border-b border-dashed border-border bg-white">
          <div className="flex items-center justify-between border-b border-dashed border-border px-6 py-4 md:px-8">
            <div>
              <h2 className="text-sm font-bold text-slate-900 sm:text-base">
                Top Rated SaaS Products in the Directory
              </h2>
              <p className="text-xs text-slate-500">
                Ranked by community upvotes and verified developer architectures.
              </p>
            </div>
            <Link
              href={ROUTES.PRODUCTS}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View Full Directory ({stats.totalCount}) →
            </Link>
          </div>

          <div className="flex flex-col">
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

        {/* Educational Content & Comparison Matrix */}
        <main className="flex-1 px-6 py-12 md:px-8">
          <div className="flex flex-col gap-12">
            {/* Why List on LaunchNests */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-500 uppercase">
                <TrendingUp className="size-4 text-blue-600" />
                <span>Founder ROI & Directory Comparison</span>
              </div>
              <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Why Submit Your SaaS to LaunchNests vs Traditional Directories?
              </h2>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-600 sm:text-sm">
                Traditional directories often suffer from two extremes: legacy
                review platforms (like G2 or Capterra) demand thousands of
                dollars for vendor profiles, while flash-in-the-pan launch boards
                archive your product after 24 hours. LaunchNests was designed to
                fill this gap.
              </p>

              <div className="mt-6 overflow-x-auto rounded-lg border border-dashed border-border bg-white shadow-2xs">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-border bg-slate-50 font-semibold text-slate-700">
                    <tr>
                      <th className="px-4 py-3">Platform Type</th>
                      <th className="px-4 py-3">Submission Cost</th>
                      <th className="px-4 py-3">Discovery Lifespan</th>
                      <th className="px-4 py-3">Backlink Type</th>
                      <th className="px-4 py-3">Tech Stack Mapping</th>
                      <th className="px-4 py-3">AI Engine Readiness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-slate-600">
                    <tr className="bg-blue-50/40 font-medium">
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        LaunchNests SaaS Directory
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-emerald-700">
                        Free or $15 one-time
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-blue-700">
                        Perpetual static catalog
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-emerald-700">
                        Permanent Do-Follow
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-blue-700">
                        Two-way 'Built With' graph
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-blue-700">
                        /llms.txt + MCP server
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        Legacy Review Directories (G2/Capterra)
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        Free tier limited; $1,000s/mo for features
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        Perpetual review listing
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        Redirects / No-Follow
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">None</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        Restricted / Paywalled
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        24-Hour Launch Boards (Product Hunt)
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        Free core; high ad pricing
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        24 hours then archived
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        Tracking redirect (/r/)
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">None</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        Standard HTML only
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        Consumer AI Directories (CodeHype)
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        Free (long queue) or $39–$299
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        Category listings
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">
                        Profile backlink
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500">None</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        Standard HTML only
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Submission Guidelines & Quality Standard */}
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-800 uppercase">
                  <ShieldCheck className="size-4 text-emerald-600" />
                  <span>Quality Guidelines & Editorial Standards</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  What Gets Approved in the LaunchNests SaaS Directory?
                </h3>

                <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                  To protect our directory authority and maintain high trust
                  with search engine crawlers and users, every listing undergoes
                  human verification. Here is our review checklist:
                </p>

                <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                  <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-emerald-700">
                      ✅ What Gets Approved:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>
                        • Live, functional SaaS products with active landing
                        pages or sign-up flows.
                      </li>
                      <li>
                        • Developer tools, APIs, libraries, and open-source
                        infrastructure.
                      </li>
                      <li>
                        • Transparent pricing information (Free, Freemium, or
                        Paid tiers).
                      </li>
                      <li>
                        • Verified tech stacks connecting your product to
                        underlying developer tools.
                      </li>
                    </ul>
                  </div>

                  <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border bg-white p-4">
                    <span className="text-xs font-bold text-amber-700">
                      ❌ What Gets Rejected:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      <li>
                        • Empty landing pages with nothing more than an email
                        capture form and no product.
                      </li>
                      <li>
                        • Low-quality link farms, spun affiliate pages, or spam
                        aggregators.
                      </li>
                      <li>
                        • Websites with broken SSL certificates or malicious
                        redirects.
                      </li>
                      <li>
                        • Duplicated submissions of identical products under
                        different names.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="border-t border-dashed border-border pt-8">
              <div className="mb-6 flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
                  Frequently Asked Questions About the SaaS Directory
                </h3>
                <p className="text-xs text-slate-600">
                  Everything you need to know about listing your software, SEO
                  backlinks, and moderation.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    How long does it take for a SaaS submission to be reviewed?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Our team reviews submissions within 12 to 24 hours. Once
                    approved, your product is immediately published, indexed in
                    the sitemap, and added to the /llms.txt AI feed.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    Do I get a permanent Do-Follow SEO backlink?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Yes. All approved products on the Featured Builder and
                    Ecosystem Partner tiers receive permanent, direct Do-Follow
                    backlinks to their homepage, passing search engine link
                    equity directly to your domain.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    What is the 'Built With' tech-stack graph?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    When you submit your SaaS, you can tag the developer tools,
                    databases, and APIs you built with (e.g. Next.js, Supabase,
                    Stripe). Your product is then cross-promoted on those tools'
                    ecosystem showcase pages.
                  </p>
                </div>

                <div className="rounded-xl border border-dashed border-border p-5">
                  <h4 className="text-xs font-bold text-slate-900 sm:text-sm">
                    How does LaunchNests help with AI search visibility (GEO)?
                  </h4>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Every page is mirrored with a raw Markdown twin endpoint
                    (/api/md/*) and indexed into our /llms.txt and /llms-full.txt
                    files. AI assistants like Cursor, ChatGPT, and Claude read
                    these endpoints when answering user queries.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom Call to Action */}
            <section className="rounded-2xl bg-slate-900 p-8 text-center text-white md:p-12">
              <h3 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
                Ready to Get Your SaaS Discovered by Developers & Buyers?
              </h3>
              <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300 sm:text-sm">
                Join hundreds of verified software products cataloged on{" "}
                {SITE_CONFIG.name}. Start with a free submission today.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={ROUTES.SUBMIT_PRODUCT}
                  className={cn(buttonVariants({ variant: "default" }), "rounded-none bg-blue-600 text-white hover:bg-blue-500")}
                >
                  Launch Your SaaS Today
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
                <Link
                  href={ROUTES.PRICING}
                  className={cn(buttonVariants({ variant: "outline" }), "rounded-none border-slate-700 bg-transparent text-white hover:bg-slate-800")}
                >
                  View Listing Plans
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  )
}

export default SaasDirectoryPage
