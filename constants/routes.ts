export const ROUTES = {
  HOME: "/",
  DISCOVER: "/discover",
  TRENDING: "/trending",
  PRICING: "/pricing",
  SUBMIT: "/submit",
  CATEGORIES: "/categories",
  BUILT_WITH: "/built-with",
  SHOWCASE: "/showcase",
  PRODUCTS: "/products",
  PRODUCT: (slug: string) => `/products/${slug}`,
} as const
