export const AD_PLACEMENT = {
  SIDEBAR: "sidebar",
  FEED: "feed",
} as const

export type AdPlacement = (typeof AD_PLACEMENT)[keyof typeof AD_PLACEMENT]

export const AD_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  ACTIVE: "active",
  PAUSED: "paused",
  EXPIRED: "expired",
  REJECTED: "rejected",
} as const

export type AdStatus = (typeof AD_STATUS)[keyof typeof AD_STATUS]

export const AD_PRICING = {
  [AD_PLACEMENT.SIDEBAR]: {
    pricePerWeek: 15,
    pricePerWeekInCents: 1500,
    label: "Right Sidebar",
  },
  [AD_PLACEMENT.FEED]: {
    pricePerWeek: 9,
    pricePerWeekInCents: 900,
    label: "Discovery Feed",
  },
} as const

export const AD_SLOTS_PER_WEEK = 3

export const AD_MAX_WEEKS_PER_PRODUCT = 6

export const AD_TIER_BONUS = {
  PREMIUM_THRESHOLD: 4,
  PREMIUM_PLUS_THRESHOLD: 6,
} as const

export const AD_EXISTING_TIER_DISCOUNT = {
  PREMIUM: 1500,
  PREMIUM_PLUS: 1900,
} as const

export const AD_HOLD_DURATION_MINUTES = 30

export const AD_TRACKING_RATE_LIMIT = {
  IMPRESSION_WINDOW_MS: 30 * 60 * 1000,
  CLICK_WINDOW_MS: 60 * 1000,
  CHECKOUT_WINDOW_MS: 60 * 1000,
  CHECKOUT_MAX_ATTEMPTS: 10,
} as const

export const getAdDodoProductId = (
  placement: AdPlacement
): string | undefined => {
  if (placement === AD_PLACEMENT.SIDEBAR) {
    return process.env.DODO_PRODUCT_SIDEBAR_AD_WEEKLY
  }
  if (placement === AD_PLACEMENT.FEED) {
    return process.env.DODO_PRODUCT_FEED_AD_WEEKLY
  }
  return undefined
}

