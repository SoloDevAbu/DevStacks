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
export const SERP_TITLE_MAX_CHARS = 60

const TITLE_MAX_CHARS = SERP_TITLE_MAX_CHARS - ` | ${SITE_CONFIG.name}`.length

// Appends the longest suffix that still fits a search result title, or returns the base alone.
export const fitTitleSuffix = (
  base: string,
  suffixes: readonly string[],
  maxChars = SERP_TITLE_MAX_CHARS
) => {
  const suffix = suffixes.find((candidate) => `${base}${candidate}`.length <= maxChars)
  return suffix ? `${base}${suffix}` : base
}

// Cuts at the last whole word, so a result never shows a half word or an ellipsis.
const truncateTitle = (text: string, maxChars: number): string => {
  if (text.length <= maxChars) return text
  const cut = text.slice(0, maxChars + 1)
  const lastSpace = cut.lastIndexOf(" ")
  const words = lastSpace > 0 ? cut.slice(0, lastSpace) : text.slice(0, maxChars)
  return words.replace(/[\s,:;&|–—-]+$/, "")
}

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
  return `${sanitizedName}: ${truncateTitle(cleanTagline, availableTaglineLength)}`
}

const TOOL_TITLE_SUFFIX = "Pricing, License & Alternatives"

// Answers the questions people search a tool for ("is X free", "X alternatives"), falling back to
// the tagline when the name is too long for it.
export const formatToolTitle = (name: string, tagline?: string | null) => {
  const sanitizedName = cleanTitle(name)
  const title = `${sanitizedName} ${TOOL_TITLE_SUFFIX}`
  return title.length <= TITLE_MAX_CHARS ? title : formatTitle(name, tagline)
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

const DIRECTORY_REVIEW_TITLE_SUFFIXES = [
  ": Pricing, Dofollow Link & Approval Time",
  ": Pricing, Dofollow Link & Review Time",
  ": Pricing & Dofollow Link",
  ": Pricing & Link Check",
]

// Targets "<directory> review" searches, the query launchers type before paying a directory.
export const buildDirectoryReviewTitle = (name: string) =>
  fitTitleSuffix(
    `${name} Review (${new Date().getFullYear()})`,
    DIRECTORY_REVIEW_TITLE_SUFFIXES
  )

// Canonical plus the `.md` twin, so agents reading the HTML head find the markdown version.
export const canonicalWithMarkdown = (url: string): Metadata["alternates"] => ({
  canonical: url,
  types: { "text/markdown": `${url}.md` },
})

const isFreeTitleSuffixes = (year: number) => [
  ` Pricing, License & Alternatives (${year})`,
  " Pricing, License & Alternatives",
  ` Pricing & Alternatives (${year})`,
  " Pricing & Alternatives",
]

// Absolute title: the question matches the query word for word, so it gets the full 60 characters.
export const formatIsFreeToolTitle = (name: string) =>
  fitTitleSuffix(
    `Is ${cleanTitle(name)} Free?`,
    isFreeTitleSuffixes(new Date().getFullYear())
  )
