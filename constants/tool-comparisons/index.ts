import { PRICING, type Pricing } from "@/constants/plans"
import type { ToolPairNotes } from "@/types/alternatives"
import {
  CLOUDFLARE_PAIRS,
  DOCKER_PAIRS,
  GITHUB_PAIRS,
  REDIS_PAIRS,
  VERCEL_PAIRS,
} from "@/constants/tool-comparisons/infra"
import {
  NEXTJS_PAIRS,
  PLAYWRIGHT_PAIRS,
  POSTMAN_PAIRS,
  PRISMA_PAIRS,
} from "@/constants/tool-comparisons/dev"
import {
  ALGOLIA_PAIRS,
  OPENAI_API_PAIRS,
  POSTGRESQL_PAIRS,
  STRIPE_PAIRS,
  SUPABASE_PAIRS,
} from "@/constants/tool-comparisons/data"

// Head-to-head notes keyed by the curated tool's slug, then by the alternative's comparison slug.
// Only pairs written here get a comparison page.
export const TOOL_PAIR_NOTES: Readonly<Record<string, ToolPairNotes>> = {
  docker: DOCKER_PAIRS,
  redis: REDIS_PAIRS,
  cloudflare: CLOUDFLARE_PAIRS,
  vercel: VERCEL_PAIRS,
  github: GITHUB_PAIRS,
  playwright: PLAYWRIGHT_PAIRS,
  nextjs: NEXTJS_PAIRS,
  prisma: PRISMA_PAIRS,
  postman: POSTMAN_PAIRS,
  postgresql: POSTGRESQL_PAIRS,
  supabase: SUPABASE_PAIRS,
  algolia: ALGOLIA_PAIRS,
  "openai-api": OPENAI_API_PAIRS,
  stripe: STRIPE_PAIRS,
}

export const TOOL_COMPARISON_SEPARATOR = "-vs-"

export const PRICING_SENTENCE: Record<Pricing, string> = {
  [PRICING.FREE]: "free to use",
  [PRICING.FREEMIUM]: "free to start, with paid plans as you grow",
  [PRICING.PAID]: "a paid product, billed by plan or usage",
  [PRICING.OPEN_SOURCE]: "free and open source",
}

export const TOOL_COMPARISONS_HUB = {
  title: "Developer Tool Comparisons",
  heading: "Developer Tool Comparisons",
  description:
    "Head-to-head comparisons of popular developer tools: license, pricing, platforms and when to pick each, written from hand-checked facts.",
} as const
