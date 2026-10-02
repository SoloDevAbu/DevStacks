import type { PlatformComparison } from "@/types/comparison"
import { PRODUCT_HUNT_COMPARISON } from "@/constants/comparisons/product-hunt"

export const COMPARISONS_REGISTRY: Record<string, PlatformComparison> = {
  producthunt: PRODUCT_HUNT_COMPARISON,
  "product-hunt": PRODUCT_HUNT_COMPARISON,
  "producthunt-alternative": PRODUCT_HUNT_COMPARISON,
}

export const getAllComparisons = (): PlatformComparison[] => [
  PRODUCT_HUNT_COMPARISON,
]

export const getComparisonBySlug = (
  slug: string
): PlatformComparison | undefined => {
  const normalized = slug.toLowerCase().trim()
  return COMPARISONS_REGISTRY[normalized]
}

export * from "@/constants/comparisons/product-hunt"
