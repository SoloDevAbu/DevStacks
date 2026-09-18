import { TIER, type Tier } from "@/constants/plans"

export const getOutboundUrl = (
  rawUrl?: string | null,
  source = "launchnests"
): string => {
  if (!rawUrl) return "#"
  try {
    const url = new URL(
      rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`
    )
    url.searchParams.set("ref", source)
    url.searchParams.set("utm_source", source)
    return url.toString()
  } catch {
    return rawUrl
  }
}

export const isDoFollow = (tier?: string | Tier | null): boolean => {
  return tier === TIER.PREMIUM || tier === TIER.PREMIUM_PLUS
}

export const getLinkRel = (tier?: string | Tier | null): string => {
  if (isDoFollow(tier)) {
    return "noopener noreferrer"
  }
  return "noopener noreferrer nofollow"
}

export const getCleanDomain = (websiteUrl?: string | null): string | null => {
  if (!websiteUrl) return null
  try {
    const trimmed = websiteUrl.trim()
    if (!trimmed) return null
    const raw =
      trimmed.startsWith("http://") || trimmed.startsWith("https://")
        ? trimmed
        : `https://${trimmed}`
    const parsed = new URL(raw)
    const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase()
    if (!hostname || !hostname.includes(".")) return null
    return hostname
  } catch {
    return null
  }
}

export const getFaviconUrl = (websiteUrl?: string | null): string | null => {
  const domain = getCleanDomain(websiteUrl)
  if (!domain) return null
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
}

export const getDuckDuckGoFaviconUrl = (
  websiteUrl?: string | null
): string | null => {
  const domain = getCleanDomain(websiteUrl)
  if (!domain) return null
  return `https://icons.duckduckgo.com/ip3/${domain}.ico`
}

