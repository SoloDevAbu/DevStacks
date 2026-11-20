// Anonymous HTML is identical for every visitor (auth state is resolved client-side), so the Worker
// can answer repeat requests from the colo's Cache API before OpenNext runs. That skips the R2 read,
// the Durable Object tag checks and the ETag hash of a 300-600 KB page on every hit. Edits show up
// once the entry is older than FRESH_SECONDS: the next visitor still gets the stored copy instantly
// while the Worker refreshes it in the background. Entries are kept for STALE_SECONDS so a
// low-traffic colo keeps answering from cache instead of running the full OpenNext path on the
// Free plan's 10 ms CPU budget.
export const EDGE_HTML_CACHE = {
  FRESH_SECONDS: 600,
  STALE_SECONDS: 7 * 24 * 60 * 60,
  STATUS_HEADER: "x-edge-cache",
  STORED_AT_HEADER: "x-edge-stored-at",
  ORIGIN_CACHE_CONTROL_HEADER: "x-edge-origin-cache-control",
} as const

// Campaign and click-tracking parameters never change the rendered page, so they are dropped from
// the cache key. Any other query parameter (search, filters, pagination) still bypasses the cache.
export const EDGE_HTML_CACHE_IGNORED_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "fbclid",
  "msclkid",
  "twclid",
  "li_fat_id",
  "igshid",
  "ref",
  "ref_src",
  "ref_url",
  "source",
  "_ga",
  "_gl",
] as const

export const EDGE_HTML_CACHE_IGNORED_PARAM_PREFIXES = ["utm_", "mc_"] as const

// Public JSON endpoints the layout fetches on every page view (sidebar ad and featured launches).
// Their answer depends only on the query string, so each query variant is cached for FRESH_SECONDS
// (matching their own s-maxage) and served stale while it refreshes.
export const EDGE_API_CACHE = {
  PATHS: ["/api/ads", "/api/launches/premium"],
  FRESH_SECONDS: 60,
} as const

// Pages that read cookies, sessions or request headers on the server, plus everything that is not
// a public page. Each entry matches itself and everything below it ("/launch" does not match
// "/launches").
export const EDGE_HTML_CACHE_EXCLUDED_PREFIXES = [
  "/api",
  "/admin",
  "/dashboard",
  "/submit",
  "/login",
  "/sign-in",
  "/sign-up",
  "/register",
  "/launch",
  "/add-product",
  "/checkout",
  "/browse",
  "/_next",
  "/v1",
  "/.well-known",
] as const

// Client navigations, server actions and previews must reach Next.js.
export const EDGE_HTML_CACHE_BYPASS_HEADERS = [
  "rsc",
  "next-router-prefetch",
  "next-router-state-tree",
  "next-action",
  "authorization",
] as const

export const EDGE_HTML_CACHE_BYPASS_COOKIES = [
  "__prerender_bypass",
  "__next_preview_data",
] as const

// Middleware echoes the visitor's geolocation onto responses; a shared copy must not carry them.
export const EDGE_HTML_CACHE_STRIPPED_HEADERS = [
  "set-cookie",
  "x-user-country",
  "x-user-region",
] as const
