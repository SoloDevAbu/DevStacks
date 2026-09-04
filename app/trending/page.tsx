import type { Metadata } from "next"
import { TrendingContent } from "@/components/trending/trending-content"
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { SITE_CONFIG } from "@/constants/site"
import { TRENDING_PRODUCTS } from "@/constants/products"

export const metadata: Metadata = {
  title: "Trending Developer Products & Tools",
  description:
    `Discover the most popular developer tools and products gaining traction right now on ${SITE_CONFIG.name}. Ranked by community upvotes, views, and active developer builds.`,
  keywords: [
    "trending developer tools",
    "popular APIs",
    "top software products",
    "most upvoted tools",
    "hot developer tools",
    "trending developer software",
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/trending`,
  },
  openGraph: {
    title: `Trending Developer Products | ${SITE_CONFIG.name}`,
    description:
      "The most popular developer tools and products gaining traction right now.",
    type: "website",
    url: `${SITE_CONFIG.url}/trending`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Trending Developer Products | ${SITE_CONFIG.name}`,
    description: "The most popular developer tools and products gaining traction right now.",
  },
}

export default async function TrendingPage() {
  const siteUrl = SITE_CONFIG.url
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Trending", url: `${siteUrl}/trending` },
  ])

  let jsonLd = null
  try {
    const products = await getTrendingProducts(15)
    if (products && products.length > 0) {
      jsonLd = itemListSchema(
        products.map((p) => ({
          name: p.name,
          url: `${siteUrl}/products/${p.slug}`,
          description: p.tagline,
        }))
      )
    }
  } catch {
    // Fall back to static constants if DB unavailable
  }

  if (!jsonLd) {
    jsonLd = itemListSchema(
      TRENDING_PRODUCTS.map((p) => ({
        name: p.name,
        url: `${siteUrl}/products/${p.name.toLowerCase().replace(/\s+/g, "-")}`,
        description: p.tagline,
      }))
    )
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrendingContent />
    </>
  )
}
