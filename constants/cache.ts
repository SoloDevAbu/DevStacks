export const CACHE_TAGS = {
  PRODUCTS_LIST: "products-list",
  PRODUCTS_STATS: "products-stats",
  TOOLS_LIST: "tools-list",
  TOOLS_STATS: "tools-stats",
  PRODUCT_CATEGORIES: "product-categories",
  TOOL_CATEGORIES: "tool-categories",
  WEEKLY_LAUNCHES: "weekly-launches",
  POPULAR_BUILDING_BLOCKS: "popular-building-blocks",
  LAUNCH_PROMO: "launch-promo",
  PROMO_BANNER: "promo-banner",
  ADS: "ads",
} as const

// Next.js copies the tags of every unstable_cache read onto the page that rendered it, and the root
// layout renders on every page. Only the banner tag reaches the layout, and it is expired only when
// the promo actually opens or closes, so a catalog change never marks the whole site stale.
export const CATALOG_CACHE_TAGS = Object.values(CACHE_TAGS).filter(
  (tag) => tag !== CACHE_TAGS.PROMO_BANNER
)

// At the weekly rollover only these must flip the instant the new week starts; every other catalog
// tag is marked stale so visitors keep getting the cached page while it regenerates.
export const ROLLOVER_HARD_EXPIRE_TAGS: readonly string[] = [
  CACHE_TAGS.WEEKLY_LAUNCHES,
  CACHE_TAGS.LAUNCH_PROMO,
]

// Machine-readable surfaces (llms.txt, /api/ai, feeds) are what AI answer engines quote, so
// downstream caches may only hold them briefly.
export const AI_SURFACE_CACHE_CONTROL = "public, max-age=600, s-maxage=3600"

export const AI_SURFACE_ARCHIVE_WEEKS = 8

export const AI_SURFACE_FRESHNESS_NOTE =
  "Refreshed hourly, whenever a listing changes, and at every weekly launch rollover (Monday 00:00 UTC)"

// A launch directory only changes when a listing is submitted, edited or voted on, and once a week
// at the rollover. Every regeneration of a page or an unstable_cache entry re-queries the database
// and costs one R2 write, so the timers below are only a daily safety net: freshness comes from tag
// and path revalidation on mutations (lib/cache/revalidate.ts) and from the weekly rollover cron.
// Page files repeat these numbers as literals because Next.js reads `revalidate` statically.
export const CACHE_REVALIDATE_SECONDS = {
  LISTS: 86400,
  // Vote counts only reach the ranked lists (home, /tools, /products, weekly launches, popular
  // building blocks) through this timer. Expiring them on every vote made each burst of votes
  // re-run the heaviest queries; a 15-minute lag on rankings is the accepted trade-off. The page
  // files that render these lists repeat 900 as their `revalidate` literal.
  RANKINGS: 900,
  CATEGORIES: 86400,
  // The sidebar ad and featured-launch widgets are fetched on every page view.
  SIDEBAR: 300,
} as const

// How long the signed session cookie answers get-session before better-auth re-reads the database.
// A sign-out or profile change elsewhere can take this long to show up in other tabs.
export const AUTH_SESSION_COOKIE_CACHE_SECONDS = 5 * 60

// Upper bound on the listing, maker, blog and category pages rendered during the build. Pages past
// it still render on first visit and are cached from then on.
export const STATIC_PARAMS_LIMIT = 1000
