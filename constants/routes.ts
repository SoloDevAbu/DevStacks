export const ROUTES = {
  HOME: "/",
  DISCOVER: "/discover",
  DISCOVER_NEW_RISING: "/discover/new-rising",
  DISCOVER_RISING_PRODUCTS: "/discover/rising-products",
  DISCOVER_RECENTLY_ADDED: "/discover/recently-added",
  DISCOVER_POPULAR_BUILDING_BLOCKS: "/discover/popular-building-blocks",
  TRENDING: "/trending",
  PRICING: "/pricing",
  SUBMIT: "/submit",
  CATEGORIES: "/categories",
  BUILT_WITH: "/built-with",
  SHOWCASE: "/showcase",
  PRODUCTS: "/products",
  PRODUCT: (slug: string) => `/products/${slug}`,
} as const

