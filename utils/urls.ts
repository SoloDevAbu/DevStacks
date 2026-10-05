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

const SITEMAP_PRODUCTION_ORIGIN = "https://www.launchnests.com"

export const normalizeSitemapUrl = (rawUrlOrPath: string): string => {
  if (!rawUrlOrPath) return SITEMAP_PRODUCTION_ORIGIN

  let str = rawUrlOrPath.trim()

  // Handle concatenated duplicate protocols/origins (e.g. https://www.launchnests.comhttps://www.launchnests.com/path)
  const lastHttpIndex = str.lastIndexOf("http://")
  const lastHttpsIndex = str.lastIndexOf("https://")
  const lastIndex = Math.max(lastHttpIndex, lastHttpsIndex)
  if (lastIndex > 0) {
    str = str.slice(lastIndex)
  }

  // Remove the protocol and host if present to extract purely the path
  str = str.replace(/^https?:\/\/[^/\s?#]+/i, "")

  // Normalize duplicate slashes in the path portion while preserving query parameters
  const [pathPart, ...queryParts] = str.split("?")
  const cleanPath = pathPart.replace(/\/+/g, "/")
  const queryString = queryParts.length > 0 ? `?${queryParts.join("?")}` : ""
  str = `${cleanPath}${queryString}`

  if (!str.startsWith("/")) {
    str = `/${str}`
  }

  if (str === "/" || str === "") {
    return SITEMAP_PRODUCTION_ORIGIN
  }

  return `${SITEMAP_PRODUCTION_ORIGIN}${str}`
}

