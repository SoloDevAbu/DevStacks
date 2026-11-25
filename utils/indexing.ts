import { INDEX_THRESHOLDS } from "@/constants/indexing"
import { getCuratedAlternatives } from "@/constants/alternatives"

export const isCategoryIndexable = (itemCount: number): boolean =>
  itemCount >= INDEX_THRESHOLDS.CATEGORY_MIN_ITEMS

// A maker page earns indexing with several launches, or one launch plus a real bio. A lone listing
// with no bio repeats what the listing page already says.
export const isMakerIndexable = ({
  listingsCount,
  bio,
}: {
  listingsCount: number
  bio?: string | null
}): boolean => {
  const hasBio =
    (bio?.trim().length ?? 0) > INDEX_THRESHOLDS.MAKER_MIN_BIO_LENGTH
  return (
    listingsCount >= INDEX_THRESHOLDS.MAKER_MIN_LISTINGS ||
    (listingsCount >= 1 && hasBio)
  )
}

export const isBuiltWithIndexable = (productCount: number): boolean =>
  productCount >= INDEX_THRESHOLDS.BUILT_WITH_MIN_PRODUCTS

// Catalog siblings share one broad category, so only a hand-checked list makes the page useful.
export const isAlternativesIndexable = (toolSlug: string): boolean =>
  Boolean(getCuratedAlternatives(toolSlug))

export const indexingRobots = (isIndexable: boolean) => ({
  index: isIndexable,
  follow: true,
})

// Search, category, pricing and sort views duplicate a hub page; only plain pagination stays indexable.
export const isListViewIndexable = ({
  q,
  category,
  pricing,
  sortBy,
}: {
  q?: string
  category?: string
  pricing?: string
  sortBy?: string
}): boolean =>
  !q?.trim() &&
  !category?.trim() &&
  (!pricing || pricing.toLowerCase() === "all") &&
  !sortBy
