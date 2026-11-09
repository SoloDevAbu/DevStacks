import { INDEX_THRESHOLDS } from "@/constants/indexing"
import { ALTERNATIVES_MIN_SIBLINGS } from "@/constants/rankings"

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

export const isAlternativesIndexable = (siblingCount: number): boolean =>
  siblingCount >= ALTERNATIVES_MIN_SIBLINGS

export const indexingRobots = (isIndexable: boolean) => ({
  index: isIndexable,
  follow: true,
})
