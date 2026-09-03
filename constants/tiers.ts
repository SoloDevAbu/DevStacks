export const TIER = {
  FREE: "free",
  PREMIUM: "premium",
  PREMIUM_PLUS: "premium+",
} as const

export type Tier = (typeof TIER)[keyof typeof TIER]

export const PRICING = {
  FREE: "Free",
  FREEMIUM: "Freemium",
  PAID: "Paid",
  OPEN_SOURCE: "Open Source",
} as const

export type Pricing = (typeof PRICING)[keyof typeof PRICING]

export const PRICING_COLORS: Record<Pricing, string> = {
  [PRICING.FREE]: "bg-emerald-100/50 text-emerald-700",
  [PRICING.FREEMIUM]: "bg-green-100/50 text-green-700",
  [PRICING.PAID]: "bg-indigo-100/50 text-indigo-700",
  [PRICING.OPEN_SOURCE]: "bg-blue-100/50 text-blue-700",
}
