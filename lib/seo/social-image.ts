import { SITE_CONFIG } from "@/constants/site"

const isSvgUrl = (url?: string | null): boolean => {
  if (!url) return false
  const clean = url.trim().toLowerCase().split("?")[0]
  return clean?.endsWith(".svg") || clean?.includes("/svg") || false
}

export const getSocialCardImage = (
  logoUrl?: string | null,
  images?: string[] | null
): string => {
  if (images && images.length > 0) {
    const validImage = images.find((img) => Boolean(img) && !isSvgUrl(img))
    if (validImage) return validImage
  }

  if (logoUrl && !isSvgUrl(logoUrl)) {
    return logoUrl
  }

  return SITE_CONFIG.ogImage
}
