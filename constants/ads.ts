export const AD_PLACEMENT = {
  SIDEBAR: "sidebar",
  FEED: "feed",
  BANNER: "banner",
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

export const AD_DURATION = {
  WEEKLY: "weekly",
  MONTHLY: "monthly",
} as const

export type AdDuration = (typeof AD_DURATION)[keyof typeof AD_DURATION]

export interface AdTierConfig {
  id: AdDuration
  label: string
  days: number
  price: number // formatted in USD e.g. 15
  priceInCents: number // e.g. 1500
  periodLabel: string
  popular?: boolean
  description: string
  dodoProductId?: string
}

export const SIDEBAR_AD_TIERS: Record<AdDuration, AdTierConfig> = {
  [AD_DURATION.WEEKLY]: {
    id: AD_DURATION.WEEKLY,
    label: "7 Days Placement",
    days: 7,
    price: 15,
    priceInCents: 1500,
    periodLabel: "per week",
    popular: false,
    description: "Featured on the right sidebar across all tool pages and product showcases for 7 days.",
    dodoProductId: process.env.DODO_PRODUCT_SIDEBAR_AD_WEEKLY,
  },
  [AD_DURATION.MONTHLY]: {
    id: AD_DURATION.MONTHLY,
    label: "30 Days Placement",
    days: 30,
    price: 49,
    priceInCents: 4900,
    periodLabel: "per month",
    popular: true,
    description: "Maximum visibility with persistent placement for 30 consecutive days. Best developer ROI.",
    dodoProductId: process.env.DODO_PRODUCT_SIDEBAR_AD_MONTHLY,
  },
}

export const FEED_AD_TIERS: Record<AdDuration, AdTierConfig> = {
  [AD_DURATION.WEEKLY]: {
    id: AD_DURATION.WEEKLY,
    label: "7 Days Native Feed Card",
    days: 7,
    price: 9,
    priceInCents: 900,
    periodLabel: "per week",
    popular: false,
    description: "Injected between organic listings in the main discovery feed for 7 days.",
    dodoProductId: process.env.DODO_PRODUCT_FEED_AD_WEEKLY,
  },
  [AD_DURATION.MONTHLY]: {
    id: AD_DURATION.MONTHLY,
    label: "30 Days Native Feed Card",
    days: 30,
    price: 29,
    priceInCents: 2900,
    periodLabel: "per month",
    popular: true,
    description: "Prominent native feed card seen by thousands of daily builders browsing tools.",
    dodoProductId: process.env.DODO_PRODUCT_FEED_AD_MONTHLY,
  },
}

export const getAdTierConfig = (
  placement: AdPlacement,
  duration: AdDuration
): AdTierConfig => {
  if (placement === AD_PLACEMENT.FEED) {
    return FEED_AD_TIERS[duration] ?? FEED_AD_TIERS[AD_DURATION.MONTHLY]
  }
  return SIDEBAR_AD_TIERS[duration] ?? SIDEBAR_AD_TIERS[AD_DURATION.MONTHLY]
}

export const AD_CONSTRAINTS = {
  MAX_TITLE_LENGTH: 60,
  MAX_DESCRIPTION_LENGTH: 160,
  MAX_CTA_TEXT_LENGTH: 30,
} as const
