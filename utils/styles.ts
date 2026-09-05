import { cn } from "@/lib/utils"
import { TIER, PRICING_COLORS, type Tier, type Pricing } from "@/constants/tiers"

export const tierCardBg = (tier: Tier) =>
  cn(
    tier === TIER.FREE
      ? "hover:bg-slate-50/50"
      : tier === TIER.PREMIUM
        ? "bg-blue-50/50 hover:bg-blue-100/50"
        : "bg-amber-50/50 hover:bg-amber-100/50"
  )

export const tierContentBg = (tier: Tier) =>
  tier === TIER.FREE ? "bg-white/50" : "bg-transparent"

export const tierShimmerGradient = (tier: Tier) =>
  tier === TIER.PREMIUM
    ? "bg-[linear-gradient(110deg,transparent_35%,rgba(219,234,254,0.6)_50%,transparent_65%)]"
    : "bg-[linear-gradient(110deg,transparent_35%,rgba(254,243,199,0.6)_50%,transparent_65%)]"

export const pricingBadgeColor = (pricing: Pricing) => PRICING_COLORS[pricing]

export const sectionWrapper = "border-b border-dashed border-border px-6 py-8 md:px-8"

export const upvoteButtonActive =
  "relative z-10 h-8 gap-1.5 rounded-lg border-amber-300 bg-amber-50 px-3 text-sm font-bold text-amber-600 hover:bg-amber-100/80 transition-colors"

export const upvoteButtonInactive =
  "relative z-10 h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"

export const bookmarkButtonActive =
  "relative z-10 size-8 rounded-lg border-indigo-300 bg-indigo-50 p-0 text-indigo-600 hover:bg-indigo-100/80 transition-colors"

export const bookmarkButtonInactive =
  "relative z-10 size-8 rounded-lg border-slate-200 bg-white p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"

