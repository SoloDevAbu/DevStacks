import { ROUTES } from "@/constants/routes"

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

export interface PricingOption {
  id: string
  label: string
  pricingKey?: Pricing
  dotColor?: string
}

export const PRICING_OPTIONS: PricingOption[] = [
  { id: "all", label: "All Pricing" },
  {
    id: PRICING.OPEN_SOURCE,
    label: "Open Source",
    pricingKey: PRICING.OPEN_SOURCE,
    dotColor: "bg-blue-500",
  },
  {
    id: PRICING.FREEMIUM,
    label: "Freemium",
    pricingKey: PRICING.FREEMIUM,
    dotColor: "bg-emerald-500",
  },
  {
    id: PRICING.PAID,
    label: "Paid",
    pricingKey: PRICING.PAID,
    dotColor: "bg-indigo-500",
  },
  {
    id: PRICING.FREE,
    label: "Free",
    pricingKey: PRICING.FREE,
    dotColor: "bg-teal-500",
  },
]

export const PRICING_COLORS: Record<Pricing, string> = {
  [PRICING.FREE]: "bg-emerald-100/50 text-emerald-700",
  [PRICING.FREEMIUM]: "bg-green-100/50 text-green-700",
  [PRICING.PAID]: "bg-indigo-100/50 text-indigo-700",
  [PRICING.OPEN_SOURCE]: "bg-blue-100/50 text-blue-700",
}

export type PlanConfig = {
  id: Tier
  name: string
  price: string
  priceInCents: number
  period: string
  tagline: string
  badgeLabel: string
  badgeClass: string
  popular: boolean
  isDoFollow: boolean
  ctaText: string
  ctaHref: string
  features: string[]
  dodoProductId?: string
}

export const PLANS: Record<Tier, PlanConfig> = {
  [TIER.FREE]: {
    id: TIER.FREE,
    name: "Community",
    price: "$0",
    priceInCents: 0,
    period: "free forever",
    tagline: "Standard listing- no card required.",
    badgeLabel: "Community",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    popular: false,
    isDoFollow: false,
    ctaText: "Launch for free",
    ctaHref: ROUTES.SUBMIT,
    features: [
      "Standard listing queue",
      "Permanent product listing - stays live forever",
      "Public product page - dofollow backlink while the LaunchNests badge stays on your site",
      "Upvotes, comments & maker dashboard",
      "Launch analytics & performance tracking",
      "AI-powered submission form prefill",
    ],
  },
  [TIER.PREMIUM]: {
    id: TIER.PREMIUM,
    name: "Premium",
    price: "$15",
    priceInCents: 1500,
    period: "one-time",
    tagline:
      "Launch in any upcoming week. Get verified, priority placement, and a dedicated AI-written blog.",
    badgeLabel: "Verified",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    popular: true,
    isDoFollow: true,
    ctaText: "Launch with Premium",
    ctaHref: ROUTES.SUBMIT,
    dodoProductId: process.env.DODO_PRODUCT_PREMIUM_LISTING,
    features: [
      "Everything in Community",
      "Choose any upcoming launch week",
      "Instant Publishing",
      "Verified Blue Check badge",
      "Permanent Do-Follow SEO backlink",
      "Priority placement across launch pages",
      "Dedicated ~1,000-word AI-written blog",
      "Featured placement in the blog section",
    ],
  },
  [TIER.PREMIUM_PLUS]: {
    id: TIER.PREMIUM_PLUS,
    name: "Premium+",
    price: "$19",
    priceInCents: 1900,
    period: "one-time",
    tagline: "Get top priority, a featured story, and a custom CTA to blogs",
    badgeLabel: "Partner",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    popular: false,
    isDoFollow: true,
    ctaText: "Launch with Premium+",
    ctaHref: ROUTES.SUBMIT,
    dodoProductId: process.env.DODO_PRODUCT_PREMIUM_PLUS_LISTING,
    features: [
      "Everything in Premium",
      "Top sticky placement across all directory pages (shown first)",
      "Exclusive Gold Shimmer badge",
      "Dedicated ~1,800-word AI-written blog",
      "Custom CTA on your blog post",
      "Featured at the top of the blog section",
      "Priority Support",
    ],
  },
}

export const getPlanDodoProductId = (tier: Tier): string | undefined => {
  const plan = PLANS[tier]
  return (
    plan?.dodoProductId ||
    (tier === TIER.PREMIUM
      ? process.env.DODO_PRODUCT_PREMIUM_LISTING
      : tier === TIER.PREMIUM_PLUS
        ? process.env.DODO_PRODUCT_PREMIUM_PLUS_LISTING
        : undefined)
  )
}
