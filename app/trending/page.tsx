import type { Metadata } from "next"
import { TrendingContent } from "@/components/trending/trending-content"
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema"
import { getTrending } from "@/lib/rankings/trending"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

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

export default async function TrendingPage(props: {
  searchParams?: Promise<{ category?: string }>
}) {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const category = searchParams?.category

  const siteUrl = SITE_CONFIG.url
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Trending", url: `${siteUrl}/trending` },
  ])

  let products: Awaited<ReturnType<typeof getTrending>> = []
  try {
    products = await getTrending(15, "today", category)
  } catch {
    products = []
  }

  const jsonLd = itemListSchema(
    (products ?? []).map((p) => ({
      name: p.name,
      url: `${siteUrl}${p.itemKind === "tool" ? ROUTES.TOOL(p.slug) : ROUTES.PRODUCT(p.slug)}`,
      description: p.tagline,
    }))
  )

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
      <TrendingContent initialCategory={category} />
    </>
  )
}
