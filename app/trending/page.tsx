import type { Metadata } from "next"
import { TrendingContent } from "@/components/trending/trending-content"
import { itemListSchema } from "@/lib/seo/schema"
import { getTrendingProducts } from "@/db/queries/products/trending"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://buymynextlaunch.com"

export const metadata: Metadata = {
  title: "Trending Products",
  description:
    "Discover the most popular developer tools and products gaining traction right now. Ranked by community upvotes and builds.",
  keywords: [
    "trending developer tools",
    "popular APIs",
    "top software products",
    "most upvoted tools",
  ],
  openGraph: {
    title: "Trending Developer Products | BuyMyNextLaunch",
    description:
      "The most popular developer tools and products gaining traction right now.",
    type: "website",
  },
}

export default async function TrendingPage() {
  let jsonLd = null
  try {
    const products = await getTrendingProducts(10)
    jsonLd = itemListSchema(
      products.map((p) => ({
        name: p.name,
        url: `${siteUrl}/products/${p.slug}`,
        description: p.tagline,
      }))
    )
  } catch {
    // Skip schema injection if DB unavailable
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <TrendingContent />
    </>
  )
}
