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
    tagline: "Standard listing for independent builders and creators.",
    badgeLabel: "Community",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    popular: false,
    isDoFollow: false,
    ctaText: "Submit Free Listing",
    ctaHref: ROUTES.SUBMIT,
    features: [
      "Permanent directory listing",
      "Community upvotes & comments",
      "Standard chronological feed inclusion",
      "Basic developer traffic analytics",
      "No-follow outbound link",
    ],
  },
  [TIER.PREMIUM]: {
    id: TIER.PREMIUM,
    name: "Featured Builder",
    price: "$15",
    priceInCents: 1500,
    period: "one-time",
    tagline: "Maximum visibility, high-authority backlink, and verified trust.",
    badgeLabel: "Verified",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    popular: true,
    isDoFollow: true,
    ctaText: "Get Verified & Featured",
    ctaHref: ROUTES.SUBMIT,
    dodoProductId: process.env.DODO_PRODUCT_PREMIUM_LISTING,
    features: [
      "Everything in Community",
      "Permanent Do-Follow SEO backlink",
      "Verified Blue Check badge",
      "Dedicated AI technical launch spotlight & architecture review",
      "AI search citations across ChatGPT, Perplexity, Claude, Gemini & Grok",
      "Featured priority placement in category searches & feeds",
      "Markdown twin indexation (/llms.txt)",
      "Direct GitHub repository link integration",
    ],
  },
  [TIER.PREMIUM_PLUS]: {
    id: TIER.PREMIUM_PLUS,
    name: "Ecosystem Partner",
    price: "$19",
    priceInCents: 1900,
    period: "one-time",
    tagline:
      "Dominant category branding, LLM agent indexing, and top banner spots.",
    badgeLabel: "Partner",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    popular: false,
    isDoFollow: true,
    ctaText: "Become a Partner",
    ctaHref: ROUTES.SUBMIT,
    dodoProductId: process.env.DODO_PRODUCT_PREMIUM_PLUS_LISTING,
    features: [
      "Everything in Featured Builder",
      "Top sticky placement across all directory pages (shown first)",
      "Exclusive Gold Shimmer badge and spotlight partner banner",
      "Dedicated technical case study & prioritized architecture review",
      "Deep LLM & agent knowledge indexing (/llms-full.txt)",
      "Direct maker profile spotlight and cross-linking",
      "Access to developer traffic analytics & community lead signals",
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
