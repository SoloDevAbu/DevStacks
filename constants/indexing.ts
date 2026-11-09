// Minimum content a templated page needs before it is indexed and listed in the sitemap. Pages
// below these lines stay reachable for visitors but carry noindex,follow, so thin variations do not
// dilute how Google rates the rest of the site.
export const INDEX_THRESHOLDS = {
  CATEGORY_MIN_ITEMS: 2,
  MAKER_MIN_LISTINGS: 2,
  MAKER_MIN_BIO_LENGTH: 50,
  BUILT_WITH_MIN_PRODUCTS: 2,
} as const
