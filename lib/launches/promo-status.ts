import { unstable_cache } from "next/cache"
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
