import type { Metadata } from "next"
import { TrendingContent } from "@/components/trending/trending-content"
import {
  breadcrumbSchema,
  itemListSchema,
  collectionPageSchema,
} from "@/lib/seo/schema"
import { getTrending } from "@/lib/rankings/trending"
import type { TimeframeOption } from "@/lib/rankings/types"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"

export const generateMetadata = async (props: {
  searchParams?: Promise<{ category?: string; timeframe?: TimeframeOption }>
}): Promise<Metadata> => {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const category = searchParams?.category
  const timeframe = searchParams?.timeframe

  const title = category
    ? `Trending ${category} Developer Tools & Products | ${SITE_CONFIG.name}`
    : timeframe && timeframe !== "today"
      ? `Trending Developer Products & Tools (${timeframe}) | ${SITE_CONFIG.name}`
      : `Trending Developer Products & Tools | ${SITE_CONFIG.name}`

  const description = category
    ? `Discover the most popular ${category} developer tools and software products gaining traction right now on ${SITE_CONFIG.name}. Ranked by community upvotes, views, and active builds.`
    : `Discover the most popular developer tools and products gaining traction right now on ${SITE_CONFIG.name}. Ranked by community upvotes, views, and active developer builds.`

  const params = new URLSearchParams()
  if (category) params.set("category", category)
  if (timeframe && timeframe !== "today") params.set("timeframe", timeframe)
  const qs = params.toString()
  const canonicalUrl = qs ? `${SITE_CONFIG.url}/trending?${qs}` : `${SITE_CONFIG.url}/trending`

  return {
    title,
    description,
    keywords: category
      ? [
          `trending ${category} tools`,
          `popular ${category} APIs`,
          "trending developer tools",
          ...SITE_CONFIG.keywords,
        ]
      : [
          "trending developer tools",
          "popular APIs",
          "top software products",
          "most upvoted tools",
          "hot developer tools",
          "trending developer software",
        ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonicalUrl,
      images: [
        {
          url: `${SITE_CONFIG.url}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_CONFIG.url}/twitter-image`],
    },
  }
}

const TrendingPage = async (props: {
  searchParams?: Promise<{ category?: string; timeframe?: TimeframeOption }>
}) => {
  const searchParams = props.searchParams ? await props.searchParams : undefined
  const category = searchParams?.category
  const timeframe = searchParams?.timeframe ?? "today"

  const siteUrl = SITE_CONFIG.url
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Trending", url: `${siteUrl}/trending` },
  ])

  let products: Awaited<ReturnType<typeof getTrending>> = []
  try {
    products = await getTrending(15, timeframe, category)
  } catch {
    products = []
  }

  const items = (products ?? []).map((p) => ({
    name: p.name,
    url: `${siteUrl}${p.itemKind === "tool" ? ROUTES.TOOL(p.slug) : ROUTES.PRODUCT(p.slug)}`,
    description: p.tagline,
  }))

  const jsonLd = itemListSchema(items)
  const collectionJsonLd = collectionPageSchema({
    name: category ? `Trending ${category} Tools` : "Trending Developer Tools",
    description: category
      ? `Top trending ${category} developer tools and products`
      : "Top trending developer tools and software products",
    url: category
      ? `${siteUrl}/trending?category=${encodeURIComponent(category)}`
      : `${siteUrl}/trending`,
    items,
  })

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <TrendingContent
        key={`${category ?? "all"}-${timeframe}`}
        initialCategory={category}
        initialTimeframe={timeframe}
        initialItems={products}
      />
    </>
  )
}

export default TrendingPage
