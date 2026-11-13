import type { Metadata } from "next"
import { SITE_CONFIG } from "@/constants/site"

export const cleanTitle = (title: string): string => {
  const brandEscaped = SITE_CONFIG.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const brandRegex = new RegExp(
    `\\s*[|—–-]\\s*(${brandEscaped}|LaunchNests)\\s*$`,
    "i"
  )
  let cleaned = title.trim()
  while (brandRegex.test(cleaned)) {
    cleaned = cleaned.replace(brandRegex, "").trim()
  }
  return cleaned
}

// The root layout appends " | <brand>" to every title, so the page's own part gets what is left of
// the 60 characters a search result shows.
const TITLE_MAX_CHARS = 60 - ` | ${SITE_CONFIG.name}`.length

const truncateTitle = (text: string, maxChars: number): string =>
  text.length <= maxChars ? text : `${text.slice(0, maxChars - 1).trim()}…`

export const formatTitle = (
  name: string,
  tagline?: string | null,
  maxChars = TITLE_MAX_CHARS
): string => {
  const sanitizedName = cleanTitle(name)
  if (!tagline) return truncateTitle(sanitizedName, maxChars)
  const cleanTagline = cleanTitle(tagline)
  const full = `${sanitizedName}: ${cleanTagline}`
  if (full.length <= maxChars) return full
  const availableTaglineLength = maxChars - sanitizedName.length - 2
  if (availableTaglineLength <= 10)
    return truncateTitle(sanitizedName, maxChars)
  return `${sanitizedName}: ${cleanTagline.slice(0, availableTaglineLength).trim()}…`
}

export const firstText = (
  ...values: ReadonlyArray<string | null | undefined>
): string | undefined => values.find((value) => value?.trim()) ?? undefined

export const formatMetaDescription = (
  description?: string | null,
  maxChars = 155
): string => {
  if (!description) return SITE_CONFIG.description
  const clean = description.replace(/\s+/g, " ").trim()
  if (clean.length <= maxChars) return clean
  const truncated = clean.slice(0, maxChars - 1)
  const lastSpace = truncated.lastIndexOf(" ")
  return `${(lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated).trim()}…`
}

// Pages that set no Open Graph block inherit the root layout's, which describes the homepage.
export const buildSocialMetadata = ({
  title,
  description,
  url,
}: {
  title: string
  description: string
  url: string
}): Pick<Metadata, "openGraph" | "twitter"> => {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`
  return {
    openGraph: {
      title: fullTitle,
      description,
      url,
      type: "website",
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: SITE_CONFIG.ogImageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SITE_CONFIG.ogImageUrl],
    },
  }
}
