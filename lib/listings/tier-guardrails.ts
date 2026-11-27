import {
  FREE_TIER_MAX_IMAGES,
  PAID_ONLY_LISTING_FIELDS,
  isPaidTier,
} from "@/constants/plans"

type PaidOnlyField = (typeof PAID_ONLY_LISTING_FIELDS)[number]

type GuardedListingInput = { images?: string[] } & Partial<
  Record<PaidOnlyField, unknown>
>

export const applyFreeTierGuardrails = <T extends GuardedListingInput>(
  data: T,
  tier?: string | null
): T => {
  if (isPaidTier(tier)) return data

  const guarded = { ...data }
  if (guarded.images && guarded.images.length > FREE_TIER_MAX_IMAGES) {
    guarded.images = guarded.images.slice(0, FREE_TIER_MAX_IMAGES)
  }
  PAID_ONLY_LISTING_FIELDS.forEach((field) => {
    guarded[field] = undefined as T[PaidOnlyField]
  })
  return guarded
}
