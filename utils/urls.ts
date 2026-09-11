import { TIER, type Tier } from "@/constants/plans"

export const getOutboundUrl = (
  rawUrl?: string | null,
  source = "devstack"
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

export const getFaviconUrl = (websiteUrl?: string | null): string | null => {
  if (!websiteUrl) return null
  try {
    const raw = websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`
    const parsed = new URL(raw)
    const hostname = parsed.hostname.replace(/^www\./, "")
    if (!hostname) return null
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`
  } catch {
    return null
  }
}

