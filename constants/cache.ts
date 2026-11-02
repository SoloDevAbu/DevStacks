export const CACHE_TAGS = {
  PRODUCTS_LIST: "products-list",
  PRODUCTS_STATS: "products-stats",
  TOOLS_LIST: "tools-list",
  TOOLS_STATS: "tools-stats",
  PRODUCT_CATEGORIES: "product-categories",
  TOOL_CATEGORIES: "tool-categories",
  WEEKLY_LAUNCHES: "weekly-launches",
  POPULAR_BUILDING_BLOCKS: "popular-building-blocks",
  AI_SURFACES: "ai-surfaces",
} as const

// The incremental cache lives in Workers KV, whose free plan allows 1,000 writes a day. Every
// regeneration of a page or an unstable_cache entry is one write, so data caches refresh hourly
// and freshness comes from tag revalidation on mutations and the weekly rollover cron instead.
export const CACHE_REVALIDATE_SECONDS = {
  LISTS: 3600,
  CATEGORIES: 21600,
} as const
