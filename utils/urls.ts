import { TIER, type Tier } from "@/constants/tiers"

export const getOutboundUrl = (
  rawUrl?: string | null,
  source = "devstack"
): string => {
  if (!rawUrl) return "#"
  try {
    const url = new URL(rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`)
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
