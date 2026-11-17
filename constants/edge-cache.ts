// Anonymous HTML is identical for every visitor (auth state is resolved client-side), so the Worker
// can answer repeat requests from the colo's Cache API before OpenNext runs. That skips the R2 read,
// the Durable Object tag checks and the ETag hash of a 300-600 KB page on every hit. Edits show up
// once the entry expires, so the TTL is the longest staleness a listing edit or vote can have.
export const EDGE_HTML_CACHE = {
  TTL_SECONDS: 600,
  STATUS_HEADER: "x-edge-cache",
  ORIGIN_CACHE_CONTROL_HEADER: "x-edge-origin-cache-control",
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
