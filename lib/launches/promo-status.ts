import { revalidateTag, unstable_cache } from "next/cache"
import { CACHE_REVALIDATE_SECONDS, CACHE_TAGS } from "@/constants/cache"
import { getLaunchPromoStatus } from "@/db/queries/launches/availability"

export const getCachedLaunchPromoStatus = unstable_cache(
  getLaunchPromoStatus,
  [CACHE_TAGS.LAUNCH_PROMO],
  {
    revalidate: CACHE_REVALIDATE_SECONDS.LISTS,
    tags: [CACHE_TAGS.LAUNCH_PROMO],
  }
)

// The root layout only needs to know whether the banner shows. Its tag sits on every page, so it is
// expired only when that answer changes (see refreshPromoBanner).
export const getCachedPromoBannerActive = unstable_cache(
  async () => (await getLaunchPromoStatus()).isPromoActive,
  [CACHE_TAGS.PROMO_BANNER],
  {
    revalidate: CACHE_REVALIDATE_SECONDS.LISTS,
    tags: [CACHE_TAGS.PROMO_BANNER],
  }
)

export const refreshPromoBanner = async () => {
  try {
    const [shown, fresh] = await Promise.all([
      getCachedPromoBannerActive(),
      getLaunchPromoStatus(),
    ])
    if (shown !== fresh.isPromoActive) {
      revalidateTag(CACHE_TAGS.PROMO_BANNER, "max")
    }
  } catch (error) {
    console.error("[Cache] Promo banner refresh failed:", error)
  }
}
