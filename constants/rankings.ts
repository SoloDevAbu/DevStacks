export const DISCOVERY_WINDOW_DAYS = 7

export const NEW_AND_RISING_WEIGHTS = {
  freshnessMaxScore: 100,
  upvotesWeight: 3.0,
  viewsWeight: 0.05,
  buildsWeight: 8.0,
  commentsWeight: 2.0,
  decayExponent: 1.0,
} as const

export const RISING_PRODUCTS_WEIGHTS = {
  upvotesWeight: 3.0,
  viewsWeight: 0.05,
  buildsWeight: 6.0,
  commentsWeight: 2.0,
} as const

export const POPULAR_BUILDING_BLOCKS_WEIGHTS = {
  buildsWeight: 10.0,
  upvotesWeight: 1.5,
  viewsWeight: 0.02,
} as const

export const HOMEPAGE_LIMITS = {
  NEW_AND_RISING: 4,
  RISING_PRODUCTS: 4,
  DEVELOPER_BUILDS: 4,
  RECENTLY_ADDED: 6,
  POPULAR_BUILDING_BLOCKS: 6,
} as const

export const DISCOVER_PAGE_LIMIT = 20
