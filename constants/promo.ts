import { TIER, type Tier } from "@/constants/plans"

export const LAUNCH_PROMO = {
  IS_ACTIVE: true,
  MAX_LAUNCHES: 100,
  TIER_GIFTED: TIER.PREMIUM as Tier,
  VALUE_GIFTED: "$49",
  BADGE_LABEL: "First 100 Launch",
  BADGE_TAGLINE: "Free Premium Verified Tier ($49 Value)",
  PROMO_TITLE: "Launch Celebration: First 100 Launches Get Free Premium",
  BANNER_TEXT:
    "Launch Celebration: First 100 tools & products get a FREE Lifetime Premium Listing ($49 value) with permanent Do-Follow SEO backlink!",
  BANNER_CTA: "Submit Launch",
  SEO_AWARD: "First 100 Launches — Verified Premium Builder",
  SEO_OFFER_DESCRIPTION:
    "DevStacks Launch Special: Free Premium Verified Listing ($49 value) with permanent Do-Follow SEO backlink",
  PERKS: [
    "Permanent Do-Follow SEO Backlink (boosts domain authority & rank)",
    "Verified Checkmark Badge across all feeds and search listings",
    "Featured placement in search and category exploration feeds",
    "Priority inclusion in Weekly AI newsletter and LLM indexing",
  ],
} as const
