import { SITE_CONFIG, CREATOR_SOCIALS } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { countryCodeToName } from "@/utils/country"
import { PRICING } from "@/constants/plans"
import { PLATFORMS } from "@/constants/platforms"

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
  updatedAt?: Date | null
  targetAudience?: string | null
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
  builtWith?: ReadonlyArray<{ readonly name: string; readonly url?: string }>
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
  "@id": `${SITE_CONFIG.url}/#website`,
  name: SITE_CONFIG.name,
  alternateName: [...SITE_CONFIG.alternateNames],
  url: SITE_CONFIG.url,
  description: SITE_CONFIG.description,
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_CONFIG.url}${ROUTES.PRODUCTS}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
})

const LOGO_ID = `${SITE_CONFIG.url}/#logo`

export const founderSchema = () => ({
  "@type": "Person",
  "@id": `${SITE_CONFIG.url}/#founder`,
  name: CREATOR_SOCIALS.name,
  url: `${SITE_CONFIG.url}${ROUTES.ABOUT}`,
  jobTitle: `Founder of ${SITE_CONFIG.name}`,
  worksFor: { "@id": `${SITE_CONFIG.url}/#organization` },
  sameAs: [CREATOR_SOCIALS.x, CREATOR_SOCIALS.linkedin],
})

export const organizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_CONFIG.url}/#organization`,
  name: SITE_CONFIG.name,
  legalName: SITE_CONFIG.name,
  alternateName: [...SITE_CONFIG.alternateNames],
  url: SITE_CONFIG.url,
  logo: {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: SITE_CONFIG.logoUrl,
    contentUrl: SITE_CONFIG.logoUrl,
    width: SITE_CONFIG.logoSize,
    height: SITE_CONFIG.logoSize,
    caption: SITE_CONFIG.name,
  },
  image: { "@id": LOGO_ID },
  description: SITE_CONFIG.description,
  slogan: SITE_CONFIG.tagline,
  founder: founderSchema(),
  brand: {
    "@type": "Brand",
    name: SITE_CONFIG.name,
    alternateName: [...SITE_CONFIG.alternateNames],
    url: SITE_CONFIG.url,
    logo: SITE_CONFIG.logoUrl,
  },
  disambiguatingDescription:
    "The premier developer tools discovery directory, APIs database, and tech-stack ecosystem platform.",
  foundingDate: "2026",
  email: SITE_CONFIG.supportEmail,
  sameAs: [SITE_CONFIG.socials.x, SITE_CONFIG.socials.linkedin],
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE_CONFIG.supportEmail,
    contactType: "customer support",
    availableLanguage: ["English"],
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

export const buildEntityGraph = (
  nodes: Array<Record<string, unknown> | null | undefined>
) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter(Boolean),
})

const FREE_TIER_PRICINGS: readonly string[] = [
  PRICING.FREE,
  PRICING.OPEN_SOURCE,
  PRICING.FREEMIUM,
]

// An Offer without a price is invalid, so only listings with a free entry point get one.
const buildFreeOffer = (pricing?: string | null) =>
  pricing && FREE_TIER_PRICINGS.includes(pricing)
    ? {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        category: pricing,
      }
    : undefined

const formatOperatingSystems = (platforms?: string[] | null) =>
  platforms && platforms.length > 0
    ? platforms
        .map((id) => PLATFORMS.find((platform) => platform.id === id)?.label ?? id)
        .join(", ")
    : "Web"

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

  const cleanCountryOfOrigin = product.countryOfOrigin?.trim()
  const cleanSpatialCoverage = product.spatialCoverage?.trim()
  const cleanKeywords = product.keywords?.trim()

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${product.url}#software`,
    name: product.name,
    description: product.description,
    url: product.url,
    image: product.logoUrl ?? SITE_CONFIG.ogImageUrl,
    applicationCategory:
      product.asoCategory?.trim() ||
      product.category?.trim() ||
      "DeveloperApplication",
    applicationSubCategory: product.category?.trim() || undefined,
    operatingSystem: formatOperatingSystems(product.platforms),
    keywords: cleanKeywords || undefined,
    featureList: featureList.length > 0 ? featureList : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    audience: product.targetAudience?.trim()
      ? {
          "@type": "Audience",
          audienceType: product.targetAudience.trim(),
        }
      : undefined,
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
    offers: buildFreeOffer(product.pricing),
    datePublished: product.createdAt
      ? new Date(product.createdAt).toISOString()
      : undefined,
    dateModified: product.updatedAt
      ? new Date(product.updatedAt).toISOString()
      : undefined,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    author: product.author?.name?.trim()
      ? {
          "@type": "Person",
          name: product.author.name.trim(),
          url: product.author.url?.trim() || undefined,
          nationality: product.author.country?.trim()
            ? {
                "@type": "Country",
                name:
                  countryCodeToName(product.author.country.trim()) ||
                  product.author.country.trim(),
              }
            : undefined,
        }
      : undefined,
    countryOfOrigin: cleanCountryOfOrigin
      ? {
          "@type": "Country",
          name:
            countryCodeToName(cleanCountryOfOrigin) || cleanCountryOfOrigin,
        }
      : undefined,
    spatialCoverage: cleanSpatialCoverage || undefined,
    screenshot:
      product.screenshots && product.screenshots.length > 0
        ? product.screenshots
        : undefined,
    video:
      product.videoUrl && product.createdAt
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
          uploadDate: new Date(product.createdAt).toISOString(),
        }
      : undefined,
    mentions:
      product.builtWith && product.builtWith.length > 0
        ? product.builtWith.map((item) => ({
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

export const aboutPageSchema = ({
  name,
  url,
  description,
  founderBio,
}: {
  name: string
  url: string
  description: string
  founderBio: string
}) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name,
  url,
  description,
  about: { "@id": `${SITE_CONFIG.url}/#organization` },
  mainEntity: {
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    founder: { ...founderSchema(), description: founderBio },
  },
})

export const breadcrumbSchema = (
  crumbs: ReadonlyArray<{ readonly name: string; readonly url: string }>,
  id?: string
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id":
    id ?? `${crumbs[crumbs.length - 1]?.url || SITE_CONFIG.url}#breadcrumb`,
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
  }>,
  id?: string
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  ...(id ? { "@id": id } : {}),
  numberOfItems: items.length,
  itemListElement: items.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    url: item.url,
    item: item.url,
    description: item.description,
  })),
})

export const collectionPageSchema = ({
  name,
  description,
  url,
  items,
  dateModified,
}: {
  name: string
  description: string
  url: string
  dateModified?: Date
  items: ReadonlyArray<{
    readonly name: string
    readonly url: string
    readonly description: string
  }>
}) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${url}#collection`,
  name,
  description,
  url,
  ...(dateModified ? { dateModified: dateModified.toISOString() } : {}),
  mainEntity: itemListSchema(items, `${url}#itemlist`),
})

export const faqSchema = (
  faqs: ReadonlyArray<{ readonly question: string; readonly answer: string }>,
  id?: string
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  ...(id ? { "@id": id } : {}),
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

  const cleanCountryOfOrigin = tool.countryOfOrigin?.trim()
  const cleanSpatialCoverage = tool.spatialCoverage?.trim()
  const cleanKeywords = tool.keywords?.trim()

  return {
    "@context": "https://schema.org",
    "@type": ["SoftwareApplication", "WebAPI"],
    "@id": `${tool.url}#software`,
    name: tool.name,
    description: tool.description,
    url: tool.url,
    image: tool.logoUrl ?? SITE_CONFIG.ogImageUrl,
    applicationCategory:
      tool.asoCategory?.trim() || tool.category?.trim() || "DeveloperApplication",
    applicationSubCategory: tool.category?.trim() || undefined,
    operatingSystem: formatOperatingSystems(tool.platforms),
    keywords: cleanKeywords || undefined,
    featureList: featureList.length > 0 ? featureList : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
    audience: tool.targetAudience?.trim()
      ? {
          "@type": "Audience",
          audienceType: tool.targetAudience.trim(),
        }
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
    offers: buildFreeOffer(tool.pricing),
    datePublished: tool.createdAt
      ? new Date(tool.createdAt).toISOString()
      : undefined,
    dateModified: tool.updatedAt
      ? new Date(tool.updatedAt).toISOString()
      : undefined,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    author: tool.author?.name?.trim()
      ? {
          "@type": "Person",
          name: tool.author.name.trim(),
          url: tool.author.url?.trim() || undefined,
          nationality: tool.author.country?.trim()
            ? {
                "@type": "Country",
                name:
                  countryCodeToName(tool.author.country.trim()) ||
                  tool.author.country.trim(),
              }
            : undefined,
        }
      : undefined,
    countryOfOrigin: cleanCountryOfOrigin
      ? {
          "@type": "Country",
          name:
            countryCodeToName(cleanCountryOfOrigin) || cleanCountryOfOrigin,
        }
      : undefined,
    spatialCoverage: cleanSpatialCoverage || undefined,
    screenshot:
      tool.screenshots && tool.screenshots.length > 0
        ? tool.screenshots
        : undefined,
  }
}

export type TechArticleSchemaInput = {
  title: string
  description: string
  url: string
  publishedAt?: Date | null
  updatedAt?: Date | null
  coverImageUrl?: string | null
  keywords?: string[]
  // Editorial guides are written by the founder; generated launch posts stay attributed to the site.
  byFounder?: boolean
}

const latestDate = (...dates: ReadonlyArray<Date | null | undefined>) =>
  dates
    .filter((date): date is Date => Boolean(date))
    .sort((a, b) => b.getTime() - a.getTime())[0]

export const techArticleSchema = (input: TechArticleSchemaInput) => ({
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: input.title,
  description: input.description,
  url: input.url,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": input.url,
  },
  datePublished: input.publishedAt?.toISOString(),
  dateModified: latestDate(input.publishedAt, input.updatedAt)?.toISOString(),
  inLanguage: "en-US",
  author: input.byFounder
    ? founderSchema()
    : {
        "@type": "Organization",
        "@id": `${SITE_CONFIG.url}/#organization`,
        name: SITE_CONFIG.name,
        url: SITE_CONFIG.url,
      },
  publisher: {
    "@type": "Organization",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: SITE_CONFIG.ogImageUrl,
    },
  },
  ...(input.coverImageUrl ? { image: [input.coverImageUrl] } : {}),
  ...(input.keywords && input.keywords.length > 0
    ? { keywords: input.keywords.join(", ") }
    : {}),
})

interface DefinedTermInput {
  name: string
  description: string
  url: string
}

const definedTermNode = ({ name, description, url }: DefinedTermInput) => ({
  "@type": "DefinedTerm",
  "@id": `${url}#term`,
  name,
  description,
  url,
})

export const definedTermSetSchema = ({
  name,
  description,
  url,
  terms,
}: DefinedTermInput & { terms: readonly DefinedTermInput[] }) => ({
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${url}#termset`,
  name,
  description,
  url,
  hasDefinedTerm: terms.map(definedTermNode),
})

export const definedTermSchema = ({
  alternateName,
  termSet,
  ...term
}: DefinedTermInput & {
  alternateName: readonly string[]
  termSet: { name: string; url: string }
}) => ({
  "@context": "https://schema.org",
  ...definedTermNode(term),
  ...(alternateName.length > 0 ? { alternateName } : {}),
  inDefinedTermSet: {
    "@type": "DefinedTermSet",
    "@id": `${termSet.url}#termset`,
    name: termSet.name,
    url: termSet.url,
  },
})

export const webApplicationSchema = ({
  name,
  description,
  url,
}: {
  name: string
  description: string
  url: string
}) => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": `${url}#app`,
  name,
  description,
  url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@id": `${SITE_CONFIG.url}/#organization` },
})

export const howToSchema = ({
  name,
  url,
  steps,
}: {
  name: string
  url: string
  steps: ReadonlyArray<{ readonly name: string; readonly text: string }>
}) => ({
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": `${url}#howto`,
  name,
  step: steps.map((step, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: step.name,
    text: step.text,
  })),
})
