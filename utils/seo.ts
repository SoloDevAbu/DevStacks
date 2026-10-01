import { SITE_CONFIG } from "@/constants/site"

export const formatTitle = (
  name: string,
  tagline?: string | null,
  maxChars = 58
): string => {
  if (!tagline) return name
  const full = `${name}: ${tagline}`
  if (full.length <= maxChars) return full
  const availableTaglineLength = maxChars - name.length - 2
  if (availableTaglineLength <= 10) return name
  return `${name}: ${tagline.slice(0, availableTaglineLength).trim()}…`
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
