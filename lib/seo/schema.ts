import { SITE_CONFIG } from "@/constants/site"
import { countryCodeToName } from "@/utils/country"
import { LAUNCH_PROMO } from "@/constants/promo"
import { TIER } from "@/constants/plans"

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
  linkedinUrl?: string | null
  discordUrl?: string | null
  appStoreUrl?: string | null
  playStoreUrl?: string | null
  chromeExtensionUrl?: string | null
  websiteUrl?: string | null
  author?: {
    name: string
    url?: string
    country?: string | null
  }
  countryOfOrigin?: string | null
  spatialCoverage?: string | null
  screenshots?: string[]
  videoUrl?: string | null
  isRelatedTo?: ReadonlyArray<{ readonly name: string; readonly url: string }>
}

export type PersonSchemaInput = {
  name: string
  username?: string | null
  url: string
  image?: string | null
  description?: string | null
  country?: string | null
  sameAs?: string[]
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
      urlTemplate: `${SITE_CONFIG.url}/products?q={search_term_string}`,
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
  logo: `${SITE_CONFIG.url}/favicon.png`,
  description: SITE_CONFIG.description,
  disambiguatingDescription:
    "The premier developer tools discovery directory, APIs database, and tech-stack ecosystem platform.",
  foundingDate: "2026",
  email: "support@launchnests.com",
  sameAs: [SITE_CONFIG.socials.x, SITE_CONFIG.socials.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    email: "support@launchnests.com",
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

export const safeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c")

export const productSchema = (product: ProductSchemaInput) => {
  const count = product.likesCount ?? product.upvotesCount ?? 0

  const featureList: string[] = []
  if (product.problemStatement)
    featureList.push(`Problem: ${product.problemStatement}`)
  if (product.solution) featureList.push(`Solution: ${product.solution}`)
  if (product.uniqueValue)
    featureList.push(`Unique Value: ${product.uniqueValue}`)

  const sameAs: string[] = []
  if (product.githubUrl) sameAs.push(product.githubUrl)
  if (product.twitterUrl) sameAs.push(product.twitterUrl)
  if (product.linkedinUrl) sameAs.push(product.linkedinUrl)
  if (product.discordUrl) sameAs.push(product.discordUrl)
  if (product.appStoreUrl) sameAs.push(product.appStoreUrl)
  if (product.playStoreUrl) sameAs.push(product.playStoreUrl)
  if (product.chromeExtensionUrl) sameAs.push(product.chromeExtensionUrl)
  if (product.websiteUrl && product.websiteUrl !== product.url)
    sameAs.push(product.websiteUrl)

  const downloadUrls: string[] = []
  if (product.appStoreUrl) downloadUrls.push(product.appStoreUrl)
  if (product.playStoreUrl) downloadUrls.push(product.playStoreUrl)
  if (product.chromeExtensionUrl) downloadUrls.push(product.chromeExtensionUrl)

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
    downloadUrl:
      downloadUrls.length > 0
        ? downloadUrls.length === 1
          ? downloadUrls[0]
          : downloadUrls
        : undefined,
    installUrl:
      downloadUrls.length > 0
        ? downloadUrls.length === 1
          ? downloadUrls[0]
          : downloadUrls
        : undefined,
    interactionStatistic:
      count > 0
        ? [
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/LikeAction",
              userInteractionCount: count,
            },
          ]
        : undefined,
    offers: {
      "@type": "Offer",
      price:
        product.pricing === "Free" || product.pricing === "Open Source"
          ? "0"
          : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: product.pricing ?? "Free",
      description:
        product.tier === TIER.PREMIUM || product.tier === TIER.PREMIUM_PLUS
          ? LAUNCH_PROMO.SEO_OFFER_DESCRIPTION
          : undefined,
    },
    award:
      product.tier === TIER.PREMIUM || product.tier === TIER.PREMIUM_PLUS
        ? LAUNCH_PROMO.SEO_AWARD
        : undefined,
    additionalProperty:
      product.tier === TIER.PREMIUM || product.tier === TIER.PREMIUM_PLUS
        ? [
            {
              "@type": "PropertyValue",
              name: "ListingTier",
              value:
                product.tier === TIER.PREMIUM_PLUS
                  ? "Premium+ Partner"
                  : "Premium Verified",
            },
            {
              "@type": "PropertyValue",
              name: "LaunchBatch",
              value: "First 50 Launches",
            },
            {
              "@type": "PropertyValue",
              name: "BacklinkType",
              value: "Permanent Do-Follow",
            },
          ]
        : undefined,
    datePublished: product.createdAt?.toISOString(),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    author: product.author
      ? {
          "@type": "Person",
          name: product.author.name,
          url: product.author.url,
          nationality: product.author.country
            ? {
                "@type": "Country",
                name:
                  countryCodeToName(product.author.country) ||
                  product.author.country,
              }
            : undefined,
        }
      : undefined,
    countryOfOrigin: product.countryOfOrigin
      ? {
          "@type": "Country",
          name:
            countryCodeToName(product.countryOfOrigin) ||
            product.countryOfOrigin,
        }
      : undefined,
    spatialCoverage: product.spatialCoverage ?? undefined,
    screenshot:
      product.screenshots && product.screenshots.length > 0
        ? product.screenshots
        : undefined,
    video: product.videoUrl
      ? {
          "@type": "VideoObject",
          name: `${product.name} Demo Video`,
          description: product.description ?? `Demo video for ${product.name}`,
          contentUrl: product.videoUrl,
          embedUrl:
            product.videoUrl.includes("youtube.com") ||
            product.videoUrl.includes("youtu.be")
              ? product.videoUrl
                  .replace("watch?v=", "embed/")
                  .replace("youtu.be/", "youtube.com/embed/")
              : product.videoUrl.includes("loom.com")
                ? product.videoUrl.replace("share/", "embed/")
                : undefined,
          thumbnailUrl: product.logoUrl ?? `${SITE_CONFIG.url}/favicon.png`,
          uploadDate:
            product.createdAt?.toISOString() ?? new Date().toISOString(),
        }
      : undefined,
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

export const personSchema = (person: PersonSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  alternateName: person.username ? `@${person.username}` : undefined,
  url: person.url,
  image: person.image ?? undefined,
  description: person.description ?? undefined,
  nationality: person.country
    ? {
        "@type": "Country",
        name: countryCodeToName(person.country) || person.country,
      }
    : undefined,
  sameAs: person.sameAs && person.sameAs.length > 0 ? person.sameAs : undefined,
})

export const profilePageSchema = ({
  name,
  url,
  person,
}: {
  name: string
  url: string
  person: PersonSchemaInput
}) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name,
  url,
  mainEntity: personSchema(person),
})

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

export type ToolSchemaInput = Omit<
  ProductSchemaInput,
  "likesCount" | "appStoreUrl" | "playStoreUrl" | "chromeExtensionUrl"
> & {
  upvotesCount?: number
  buildsCount?: number
  websiteUrl?: string | null
}

export const toolSchema = (tool: ToolSchemaInput) => {
  const count = tool.upvotesCount ?? 0

  const featureList: string[] = []
  if (tool.problemStatement)
    featureList.push(`Problem: ${tool.problemStatement}`)
  if (tool.solution) featureList.push(`Solution: ${tool.solution}`)
  if (tool.uniqueValue) featureList.push(`Unique Value: ${tool.uniqueValue}`)

  const sameAs: string[] = []
  if (tool.githubUrl) sameAs.push(tool.githubUrl)
  if (tool.twitterUrl) sameAs.push(tool.twitterUrl)
  if (tool.linkedinUrl) sameAs.push(tool.linkedinUrl)
  if (tool.discordUrl) sameAs.push(tool.discordUrl)
  if (tool.websiteUrl && tool.websiteUrl !== tool.url)
    sameAs.push(tool.websiteUrl)

  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebAPI"],
    name: tool.name,
    description: tool.description,
    url: tool.url,
    image: tool.logoUrl ?? `${SITE_CONFIG.url}/favicon.png`,
    applicationCategory:
      tool.asoCategory ?? tool.category ?? "DeveloperApplication",
    applicationSubCategory: tool.category ?? undefined,
    operatingSystem:
      tool.platforms && tool.platforms.length > 0
        ? tool.platforms.join(", ")
        : "Web, Cloud, Cross-Platform",
    keywords: tool.keywords ?? undefined,
    featureList: featureList.length > 0 ? featureList : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    interactionStatistic:
      count > 0
        ? [
            {
              "@type": "InteractionCounter",
              interactionType: "https://schema.org/LikeAction",
              userInteractionCount: count,
            },
          ]
        : undefined,
    offers: {
      "@type": "Offer",
      price:
        tool.pricing === "Free" || tool.pricing === "Open Source"
          ? "0"
          : undefined,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      category: tool.pricing ?? "Free",
      description:
        tool.tier === TIER.PREMIUM || tool.tier === TIER.PREMIUM_PLUS
          ? LAUNCH_PROMO.SEO_OFFER_DESCRIPTION
          : undefined,
    },
    award:
      tool.tier === TIER.PREMIUM || tool.tier === TIER.PREMIUM_PLUS
        ? LAUNCH_PROMO.SEO_AWARD
        : undefined,
    additionalProperty:
      tool.tier === TIER.PREMIUM || tool.tier === TIER.PREMIUM_PLUS
        ? [
            {
              "@type": "PropertyValue",
              name: "ListingTier",
              value:
                tool.tier === TIER.PREMIUM_PLUS
                  ? "Premium+ Partner"
                  : "Premium Verified",
            },
            {
              "@type": "PropertyValue",
              name: "LaunchBatch",
              value: "First 50 Launches",
            },
            {
              "@type": "PropertyValue",
              name: "BacklinkType",
              value: "Permanent Do-Follow",
            },
          ]
        : undefined,
    datePublished: tool.createdAt?.toISOString(),
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    author: tool.author
      ? {
          "@type": "Person",
          name: tool.author.name,
          url: tool.author.url,
          nationality: tool.author.country
            ? {
                "@type": "Country",
                name:
                  countryCodeToName(tool.author.country) || tool.author.country,
              }
            : undefined,
        }
      : undefined,
    countryOfOrigin: tool.countryOfOrigin
      ? {
          "@type": "Country",
          name: countryCodeToName(tool.countryOfOrigin) || tool.countryOfOrigin,
        }
      : undefined,
    screenshot:
      tool.screenshots && tool.screenshots.length > 0
        ? tool.screenshots
        : undefined,
  }
}
