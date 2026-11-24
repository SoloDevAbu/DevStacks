import type { CuratedAlternatives } from "@/types/alternatives"
import { ALGOLIA_ALTERNATIVES } from "@/constants/alternatives/algolia"
import { CLOUDFLARE_ALTERNATIVES } from "@/constants/alternatives/cloudflare"
import { DOCKER_ALTERNATIVES } from "@/constants/alternatives/docker"
import { GITHUB_ALTERNATIVES } from "@/constants/alternatives/github"
import { NEXTJS_ALTERNATIVES } from "@/constants/alternatives/nextjs"
import { OPENAI_API_ALTERNATIVES } from "@/constants/alternatives/openai-api"
import { PLAYWRIGHT_ALTERNATIVES } from "@/constants/alternatives/playwright"
import { POSTGRESQL_ALTERNATIVES } from "@/constants/alternatives/postgresql"
import { POSTMAN_ALTERNATIVES } from "@/constants/alternatives/postman"
import { PRISMA_ALTERNATIVES } from "@/constants/alternatives/prisma"
import { REDIS_ALTERNATIVES } from "@/constants/alternatives/redis"
import { STRIPE_ALTERNATIVES } from "@/constants/alternatives/stripe"
import { SUPABASE_ALTERNATIVES } from "@/constants/alternatives/supabase"
import { VERCEL_ALTERNATIVES } from "@/constants/alternatives/vercel"

// Hand-checked alternatives keyed by the catalog tool slug. Only these alternatives pages are
// indexed: catalog siblings alone share one broad category, so they are not real alternatives.
export const CURATED_ALTERNATIVES: Readonly<
  Record<string, CuratedAlternatives>
> = Object.fromEntries(
  [
    DOCKER_ALTERNATIVES,
    PLAYWRIGHT_ALTERNATIVES,
    NEXTJS_ALTERNATIVES,
    REDIS_ALTERNATIVES,
    CLOUDFLARE_ALTERNATIVES,
    POSTGRESQL_ALTERNATIVES,
    PRISMA_ALTERNATIVES,
    GITHUB_ALTERNATIVES,
    VERCEL_ALTERNATIVES,
    SUPABASE_ALTERNATIVES,
    POSTMAN_ALTERNATIVES,
    ALGOLIA_ALTERNATIVES,
    OPENAI_API_ALTERNATIVES,
    STRIPE_ALTERNATIVES,
  ].map((entry) => [entry.toolSlug, entry])
)

export const getCuratedAlternatives = (toolSlug: string) =>
  CURATED_ALTERNATIVES[toolSlug] ?? null

export const CURATED_ALTERNATIVES_SLUGS = Object.keys(CURATED_ALTERNATIVES)

export const ALTERNATIVES_HUB = {
  title: "Developer Tool Alternatives",
  heading: "Developer Tool Alternatives",
  description:
    "Hand-checked alternatives to popular developer tools, compared on license, pricing, platforms and when to switch.",
} as const

// Shown on alternatives pages that have no curated list yet.
export const DEFAULT_STICK_WITH = [
  "Your tech stack is already integrated with its APIs and SDKs.",
  "Its feature roadmap aligns with your core delivery velocity.",
  "You value its established community and verified production track record.",
] as const

export const DEFAULT_SWITCH_WHEN = [
  "You require an open-source or self-hosted architecture.",
  "Alternative pricing tiers provide a cheaper runway for early-stage validation.",
  "A competitor provides specialized edge or regional infrastructure you need.",
] as const
