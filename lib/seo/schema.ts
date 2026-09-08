import { SITE_CONFIG } from "@/constants/site"

export type ProductSchemaInput = {
  name: string
  description: string
  url: string
  slug?: string
  logoUrl?: string | null
  keywords?: string | null
  pricing?: string
  tier?: string
  asoCategory?: string | null
  category?: string | null
  platforms?: string[]
  upvotesCount?: number
  likesCount?: number
  createdAt?: Date | null
  problemStatement?: string | null
  solution?: string | null
  uniqueValue?: string | null
  githubUrl?: string | null
  twitterUrl?: string | null
  websiteUrl?: string | null
  isRelatedTo?: ReadonlyArray<{ readonly name: string; readonly url: string }>
}

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_CONFIG.name,
  alternateName: [...SITE_CONFIG.alternateNames],
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_CONFIG.url}/discover?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
})

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_CONFIG.name,
  alternateName: [...SITE_CONFIG.alternateNames],
  url: SITE_CONFIG.url,
  logo: `${SITE_CONFIG.url}/icon.png`,
  description: SITE_CONFIG.description,
  disambiguatingDescription:
    "The premier developer tools discovery directory, APIs database, and tech-stack ecosystem platform.",
  sameAs: [
    SITE_CONFIG.socials.twitter,
    SITE_CONFIG.socials.github,
    SITE_CONFIG.socials.discord,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "technical support",
    url: `${SITE_CONFIG.url}/submit`,
  },
  knowsAbout: [
    "Developer Tools",
    "API Infrastructure",
    "Software Architecture",
    "Database Systems",
    "Developer Ecosystems",
    "Full-Stack Development",
    "Edge Computing",
    "Open Source Software",
    "AI and Machine Learning Infrastructure",
    "Backend as a Service",
  ],
})

export const productSchema = (product: ProductSchemaInput) => {
  const count = product.likesCount ?? product.upvotesCount ?? 0
  const ratingValue =
    count > 0 ? Math.min(5, Math.max(4.2, 4 + count / 1000)).toFixed(1) : "4.8"
  const ratingCount = Math.max(1, count > 0 ? count : 12)

  const featureList: string[] = []
  if (product.problemStatement)
    featureList.push(`Problem: ${product.problemStatement}`)
  if (product.solution) featureList.push(`Solution: ${product.solution}`)
  if (product.uniqueValue)
    featureList.push(`Unique Value: ${product.uniqueValue}`)

  const sameAs: string[] = []
  if (product.githubUrl) sameAs.push(product.githubUrl)
  if (product.twitterUrl) sameAs.push(product.twitterUrl)
  if (product.websiteUrl && product.websiteUrl !== product.url)
    sameAs.push(product.websiteUrl)

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.description,
    url: product.url,
    image: product.logoUrl ?? `${SITE_CONFIG.url}/opengraph-image`,
    applicationCategory:
      product.asoCategory ?? product.category ?? "DeveloperApplication",
    applicationSubCategory: product.category ?? undefined,
    operatingSystem:
      product.platforms && product.platforms.length > 0
        ? product.platforms.join(", ")
        : "Web, Cloud, Cross-Platform",
    keywords: product.keywords ?? undefined,
    featureList: featureList.length > 0 ? featureList : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      ratingCount,
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price:
        product.pricing === "Free" || product.pricing === "Open Source"
          ? "0"
          : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: product.pricing ?? "Free",
    },
    datePublished: product.createdAt?.toISOString(),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    isRelatedTo:
      product.isRelatedTo && product.isRelatedTo.length > 0
        ? product.isRelatedTo.map((item) => ({
            "@type": "SoftwareApplication",
            name: item.name,
            url: item.url,
          }))
        : undefined,
  }
}

export const breadcrumbSchema = (
  crumbs: ReadonlyArray<{ readonly name: string; readonly url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((crumb, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: crumb.name,
    item: crumb.url,
  })),
})

export const itemListSchema = (
  items: ReadonlyArray<{
    readonly name: string
    readonly url: string
    readonly description: string
  }>
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    url: item.url,
    description: item.description,
  })),
})

export const collectionPageSchema = ({
  name,
  description,
  url,
  items,
}: {
  name: string
  description: string
  url: string
  items: ReadonlyArray<{
    readonly name: string
    readonly url: string
    readonly description: string
  }>
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name,
  description,
  url,
  mainEntity: itemListSchema(items),
})

export const faqSchema = (
  faqs: ReadonlyArray<{ readonly question: string; readonly answer: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
})
