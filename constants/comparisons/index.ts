import type { PlatformComparison } from "@/types/comparison"
import { PRODUCT_HUNT_COMPARISON } from "@/constants/comparisons/product-hunt"
import { UNEED_COMPARISON } from "@/constants/comparisons/uneed"
import { MICROLAUNCH_COMPARISON } from "@/constants/comparisons/microlaunch"
import { BETALIST_COMPARISON } from "@/constants/comparisons/betalist"

export const COMPARISONS_REGISTRY: Record<string, PlatformComparison> = {
  producthunt: PRODUCT_HUNT_COMPARISON,
  "product-hunt": PRODUCT_HUNT_COMPARISON,
  "producthunt-alternative": PRODUCT_HUNT_COMPARISON,
  uneed: UNEED_COMPARISON,
  "uneed-alternative": UNEED_COMPARISON,
  microlaunch: MICROLAUNCH_COMPARISON,
  "micro-launch": MICROLAUNCH_COMPARISON,
  "microlaunch-alternative": MICROLAUNCH_COMPARISON,
  betalist: BETALIST_COMPARISON,
  "beta-list": BETALIST_COMPARISON,
  "betalist-alternative": BETALIST_COMPARISON,
}

export const getAllComparisons = (): PlatformComparison[] => [
  PRODUCT_HUNT_COMPARISON,
  UNEED_COMPARISON,
  MICROLAUNCH_COMPARISON,
  BETALIST_COMPARISON,
]

export const getComparisonBySlug = (
  slug: string
): PlatformComparison | undefined => {
  const normalized = slug.toLowerCase().trim()
  return COMPARISONS_REGISTRY[normalized]
}

export * from "@/constants/comparisons/product-hunt"
export * from "@/constants/comparisons/uneed"
export * from "@/constants/comparisons/microlaunch"
export * from "@/constants/comparisons/betalist"



