import type { PlatformProfile } from "@/types/comparison"
import { SITE_CONFIG } from "@/constants/site"
import { PLANS, TIER } from "@/constants/plans"
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { BADGE_CHECK } from "@/constants/badges"

export const COMPARISON_FACTS_CHECKED_ON = "2026-11-09"

const PREMIUM_PRICE = PLANS[TIER.PREMIUM].price
const PREMIUM_PLUS_PRICE = PLANS[TIER.PREMIUM_PLUS].price

// The LaunchNests side of every comparison. Kept in one place so each page states the same,
// current terms; change them here when plans or rules change.
export const LAUNCHNESTS_FACTS = {
  cost: `Free, or ${PREMIUM_PRICE} / ${PREMIUM_PLUS_PRICE} one-time`,
  freeQueue: `Next open launch week (${MAX_FREE_LAUNCHES_PER_WEEK} free slots a week)`,
  paidScheduling: `Any upcoming week with Premium (${PREMIUM_PRICE})`,
  retention: "Listing stays live after approval; no upvote minimum",
  freeLink:
    "Nofollow, or dofollow while the LaunchNests badge is live on your site",
  paidLink: `Permanent dofollow on Premium (${PREMIUM_PRICE}) and Premium+`,
  linkPolicy: `Free: dofollow while the badge is live, else nofollow. Paid: permanent dofollow`,
  launchFormat:
    "Weekly launch on the homepage, then permanent category and stack pages",
  techStack: "Products link to the tools they are built with, and back",
  aiAccess: "/llms.txt, Markdown copy of every page, MCP server and CLI",
  subscription: "None: paid plans are one-time",
  audience: "Small and new (launched 2026); no traffic figures published yet",
  focus: "Software: developer tools, APIs, SaaS and AI products",
} as const

export const LAUNCHNESTS_PROFILE: PlatformProfile = {
  name: SITE_CONFIG.name,
  tagline: SITE_CONFIG.tagline,
  websiteUrl: SITE_CONFIG.url,
  primaryAudience:
    "Developers, technical founders and people building or buying dev tools, APIs and SaaS.",
  discoveryLifespan:
    "A product launches for one week on the homepage, then stays listed on its category, tech-stack and maker pages.",
  pricingModel: `Free launch in the next open week (${MAX_FREE_LAUNCHES_PER_WEEK} free slots a week). Premium ${PREMIUM_PRICE} or Premium+ ${PREMIUM_PLUS_PRICE}, both one-time, to pick any upcoming week and get a permanent dofollow link.`,
  keyStrengths: [
    "Products link to the developer tools they are built with, and each tool page lists the products using it",
    "No upvote minimum: an approved listing stays live",
    `Free listings get a dofollow link while the LaunchNests badge stays on the maker's site (re-checked every ${BADGE_CHECK.INTERVAL_DAYS} days)`,
    "One-time pricing, no subscription",
    "Every listing is readable by AI tools through /llms.txt, Markdown copies of each page, an MCP server and a CLI",
  ],
  keyLimitations: [
    "Launched in 2026, so the audience is much smaller than established launch sites, and we don't publish traffic figures yet",
    "No newsletter",
    "Free listings are nofollow unless the badge stays live",
    "Software products only; services, agencies and non-tech products are out of scope",
  ],
}

export const LAUNCHNESTS_ANGLES = {
  techStack:
    "When you submit a product to LaunchNests you list the tools it is built with (for example Next.js, Supabase or Stripe). Your product page links to each tool, and each tool page lists the products built with it, so people researching a tool can find your product.",
  aiAccess:
    "Every LaunchNests listing is also published as plain Markdown, indexed in /llms.txt, and available through an MCP server and a CLI. AI assistants and coding agents can read a listing without parsing the HTML page. Whether a given assistant actually uses these is up to that assistant.",
  retention:
    "On LaunchNests there is no vote threshold. Once a listing is approved it stays live, whatever happens during its launch week. Votes only decide where it ranks that week.",
} as const
