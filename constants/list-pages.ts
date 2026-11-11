import { ROUTES } from "@/constants/routes"

// List pages served from the ISR cache when the URL has none of LIST_QUERY_KEYS. A URL that has one
// is rewritten to the same path under LIST_BROWSE_PREFIX, which renders per request. Other query
// strings, such as utm tags, keep the cached page.
export const CACHED_LIST_PATHS: readonly string[] = [
  ROUTES.PRODUCTS,
  ROUTES.TOOLS,
  ROUTES.BLOG,
  ROUTES.TRENDING,
  ROUTES.MAKERS,
]

export const LIST_QUERY_KEYS = [
  "category",
  "q",
  "pricing",
  "sortBy",
  "page",
  "timeframe",
] as const

export const LIST_BROWSE_PREFIX = "/browse"
