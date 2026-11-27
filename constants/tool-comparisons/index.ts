import { PRICING, type Pricing } from "@/constants/plans"
import type { ToolPairNotes } from "@/types/alternatives"
import {
  CLOUDFLARE_PAIRS,
  DATADOG_PAIRS,
  DOCKER_PAIRS,
  GITHUB_PAIRS,
  REDIS_PAIRS,
  TERRAFORM_PAIRS,
  VERCEL_PAIRS,
} from "@/constants/tool-comparisons/infra"
import {
  CLAUDE_CODE_PAIRS,
  CURSOR_PAIRS,
  GITHUB_COPILOT_PAIRS,
  LOVABLE_PAIRS,
  REPLIT_PAIRS,
} from "@/constants/tool-comparisons/ai"
import {
  JIRA_PAIRS,
  N8N_PAIRS,
  ZAPIER_PAIRS,
} from "@/constants/tool-comparisons/work"
import {
  NEXTJS_PAIRS,
  PLAYWRIGHT_PAIRS,
  POSTMAN_PAIRS,
  PRISMA_PAIRS,
} from "@/constants/tool-comparisons/dev"
import {
  ALGOLIA_PAIRS,
  CLERK_PAIRS,
  FIREBASE_PAIRS,
  MONGODB_PAIRS,
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
  "claude-code": CLAUDE_CODE_PAIRS,
  cursor: CURSOR_PAIRS,
  n8n: N8N_PAIRS,
  zapier: ZAPIER_PAIRS,
  "github-copilot": GITHUB_COPILOT_PAIRS,
  lovable: LOVABLE_PAIRS,
  clerk: CLERK_PAIRS,
  mongodb: MONGODB_PAIRS,
  firebase: FIREBASE_PAIRS,
  jira: JIRA_PAIRS,
  replit: REPLIT_PAIRS,
  terraform: TERRAFORM_PAIRS,
  datadog: DATADOG_PAIRS,
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
