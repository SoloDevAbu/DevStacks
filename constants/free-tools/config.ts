export const FREE_TOOL_FETCH = {
  TIMEOUT_MS: 6000,
  MAX_REDIRECTS: 3,
  MAX_BYTES: 600_000,
  CLIENT_TIMEOUT_MS: 45_000,
} as const

export const DOMAIN_RATING_API = {
  URL: "https://api.ahrefs.com/v3/public/domain-rating-free",
  ENV_KEY: "AHREFS_API_KEY",
  CACHE_SECONDS: 86_400,
  BULK_MAX_DOMAINS: 25,
  CONCURRENCY: 5,
  ATTRIBUTION_PREFIX: "Domain Rating by",
  ATTRIBUTION_NAME: "Ahrefs",
  ATTRIBUTION_URL: "https://ahrefs.com/",
} as const

export const DOMAIN_RATING_ERRORS = {
  INVALID_DOMAIN: "Not a valid domain.",
  UNAVAILABLE:
    "Domain Rating is temporarily unavailable. Please try again later.",
  LOOKUP_FAILED: "Could not get a Domain Rating for this domain.",
} as const

// Bands follow how DR is usually read; the scale is logarithmic, so the upper bands are wide in effort.
export const DOMAIN_RATING_BANDS = [
  { min: 70, label: "Very strong" },
  { min: 50, label: "Strong" },
  { min: 30, label: "Established" },
  { min: 10, label: "Growing" },
  { min: 0, label: "New or weak" },
] as const

export const AI_CRAWLERS = [
  { name: "GPTBot", owner: "OpenAI (training)" },
  { name: "OAI-SearchBot", owner: "OpenAI (ChatGPT search)" },
  { name: "ChatGPT-User", owner: "OpenAI (user requests)" },
  { name: "ClaudeBot", owner: "Anthropic (training)" },
  { name: "Claude-SearchBot", owner: "Anthropic (search)" },
  { name: "PerplexityBot", owner: "Perplexity" },
  { name: "Google-Extended", owner: "Google (Gemini)" },
  { name: "Applebot-Extended", owner: "Apple Intelligence" },
  { name: "CCBot", owner: "Common Crawl" },
] as const

export const AI_READINESS_CHECKS = {
  HOMEPAGE: { label: "Homepage reachable", weight: 15 },
  SERVER_RENDERED: { label: "Content readable without JavaScript", weight: 15 },
  META: { label: "Title and meta description", weight: 10 },
  STRUCTURED_DATA: { label: "Structured data (JSON-LD)", weight: 15 },
  CANONICAL: { label: "Canonical URL", weight: 5 },
  ROBOTS: { label: "robots.txt", weight: 5 },
  AI_CRAWLERS: { label: "AI crawlers allowed", weight: 15 },
  SITEMAP: { label: "XML sitemap", weight: 5 },
  LLMS_TXT: { label: "llms.txt", weight: 10 },
  LLMS_FULL_TXT: { label: "llms-full.txt", weight: 5 },
} as const

export type AiReadinessCheckId = keyof typeof AI_READINESS_CHECKS

export const AI_READINESS_THRESHOLDS = {
  RENDERED_TEXT_PASS: 500,
  RENDERED_TEXT_WARN: 150,
  STATUS_SCORE: { pass: 1, warn: 0.5, fail: 0 },
} as const

export const ENTITY_SCHEMA_TYPES = [
  "Organization",
  "WebSite",
  "SoftwareApplication",
  "WebApplication",
  "Product",
  "LocalBusiness",
] as const

export const AI_READINESS_ERRORS = {
  INVALID_URL: "Enter a public https:// website address.",
  UNREACHABLE:
    "We could not reach that website. Check the address and try again.",
} as const
