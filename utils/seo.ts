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

export const formatTitle = (
  name: string,
  tagline?: string | null,
  maxChars = 58
): string => {
  const sanitizedName = cleanTitle(name)
  if (!tagline) return sanitizedName
  const cleanTagline = cleanTitle(tagline)
  const full = `${sanitizedName}: ${cleanTagline}`
  if (full.length <= maxChars) return full
  const availableTaglineLength = maxChars - sanitizedName.length - 2
  if (availableTaglineLength <= 10) return sanitizedName
  return `${sanitizedName}: ${cleanTagline.slice(0, availableTaglineLength).trim()}…`
}

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
