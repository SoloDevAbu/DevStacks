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
  period: string
  tagline: string
  badgeLabel: string
  badgeClass: string
  popular: boolean
  isDoFollow: boolean
  ctaText: string
  ctaHref: string
  features: string[]
}

export const PLANS: Record<Tier, PlanConfig> = {
  [TIER.FREE]: {
    id: TIER.FREE,
    name: "Community",
    price: "$0",
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
    price: "$49",
    period: "one-time verification",
    tagline: "Maximum visibility, high-authority backlink, and verified trust.",
    badgeLabel: "Verified",
    badgeClass: "bg-blue-100 text-blue-700 border-blue-200",
    popular: true,
    isDoFollow: true,
    ctaText: "Get Verified & Featured",
    ctaHref: ROUTES.SUBMIT,
    features: [
      "Everything in Community",
      "Permanent Do-Follow SEO backlink",
      "Verified Blue Check badge",
      "Featured placement in category searches",
      "Priority inclusion in Weekly AI Newsletter",
      "Direct GitHub repository link integration",
    ],
  },
  [TIER.PREMIUM_PLUS]: {
    id: TIER.PREMIUM_PLUS,
    name: "Ecosystem Partner",
    price: "$149",
    period: "quarterly sponsorship",
    tagline:
      "Dominant category branding, LLM agent indexing, and top banner spots.",
    badgeLabel: "Partner",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    popular: false,
    isDoFollow: true,
    ctaText: "Become a Partner",
    ctaHref: ROUTES.SUBMIT,
    features: [
      "Everything in Featured Builder",
      "Top sticky placement across directory pages",
      "Priority indexing in llms.txt & AI search feeds",
      "Gold Shimmer badge and spotlight banner",
      "Dedicated developer case study highlight",
      "Access to community analytics & leads",
    ],
  },
}
