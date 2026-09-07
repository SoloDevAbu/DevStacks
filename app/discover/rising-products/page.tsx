import type { Metadata } from "next"
import { Flame } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { breadcrumbSchema } from "@/lib/seo/schema"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"
import { getRisingProducts } from "@/lib/rankings/rising-products"
import type { DbProduct } from "@/components/shared/product-card"
import { RisingProductsContent } from "./rising-products-content"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Rising Developer Products & Tools",
  description: `Discover products and developer tools gaining momentum across the ${SITE_CONFIG.name} ecosystem.`,
  keywords: [
    "rising products",
    "developer tools momentum",
    "fastest growing tools",
    "trending developer tech",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/discover/rising-products`,
  },
  openGraph: {
    title: `Rising Developer Products | ${SITE_CONFIG.name}`,
    description: "Products and developer tools gaining momentum right now.",
    type: "website",
    url: `${SITE_CONFIG.url}/discover/rising-products`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Rising Developer Products | ${SITE_CONFIG.name}`,
    description: "Products and developer tools gaining momentum right now.",
  },
}

const RisingProductsPage = async () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Discover", url: `${SITE_CONFIG.url}/discover` },
    {
      name: "Rising Products",
      url: `${SITE_CONFIG.url}/discover/rising-products`,
    },
  ])

  const initialProducts = await getRisingProducts({
    limit: DISCOVER_PAGE_LIMIT,
    page: 1,
  }).catch(() => [])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="🚀 Rising Products"
          description="Products gaining momentum across the developer ecosystem, ranked by activity velocity, upvotes, and community engagement."
          aiPrompt={AI_PROMPTS.risingProducts}
        />

        <div className="border-b border-dashed border-border bg-emerald-50/40 px-6 py-3 md:px-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <Flame className="size-4 shrink-0 text-emerald-600" />
            <span>
              <strong>Momentum Velocity:</strong> Ranked dynamically based on
              recent engagement rate relative to product age.
            </span>
          </div>
        </div>

        <RisingProductsContent initialProducts={initialProducts as DbProduct[]} />
      </div>
    </>
  )
}

export default RisingProductsPage

