export const CACHE_TAGS = {
  PRODUCTS_LIST: "products-list",
  PRODUCTS_STATS: "products-stats",
  TOOLS_LIST: "tools-list",
  TOOLS_STATS: "tools-stats",
  PRODUCT_CATEGORIES: "product-categories",
  TOOL_CATEGORIES: "tool-categories",
  WEEKLY_LAUNCHES: "weekly-launches",
  POPULAR_BUILDING_BLOCKS: "popular-building-blocks",
} as const

// Machine-readable surfaces (llms.txt, /api/ai, feeds) are what AI answer engines quote, so
// downstream caches may only hold them briefly.
export const AI_SURFACE_CACHE_CONTROL = "public, max-age=600, s-maxage=3600"

export const AI_SURFACE_FRESHNESS_NOTE =
  "Refreshed hourly, whenever a listing changes, and at every weekly launch rollover (Monday 00:00 UTC)"

// The incremental cache lives in Workers KV, whose free plan allows 1,000 writes a day. Every
// regeneration of a page or an unstable_cache entry is one write, so data caches refresh hourly
// and freshness comes from tag revalidation on mutations and the weekly rollover cron instead.
export const CACHE_REVALIDATE_SECONDS = {
  LISTS: 3600,
  CATEGORIES: 21600,
} as const
