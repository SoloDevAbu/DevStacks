"use client"

import { ProductCard } from "@/components/shared/product-card"
import { BuildCard, type DbBuildItem } from "@/components/shared/build-card"
import type { DbProduct } from "@/components/home/product-list"

export type FeedItem =
  | (DbProduct & { itemType?: "product"; builtWith?: never })
  | (DbBuildItem & { itemType?: "build"; upvotesCount?: never })
  | Record<string, any>

export const isBuildItem = (item: FeedItem): item is DbBuildItem => {
  return (
    item.itemType === "build" ||
    ("builtWith" in item && !("slug" in item)) ||
    ("likesCount" in item && !("upvotesCount" in item))
  )
}

interface FeedCardProps {
  item: FeedItem
  index?: number
  showMedals?: boolean
  showTrendingBadge?: boolean
  tagPrefix?: string
}

export const FeedCard = ({
  item,
  index = 0,
  showMedals = false,
  showTrendingBadge = false,
  tagPrefix,
}: FeedCardProps) => {
  if (isBuildItem(item)) {
    return (
      <BuildCard
        build={item as DbBuildItem}
        index={index}
        showMedals={showMedals}
      />
    )
  }

  return (
    <ProductCard
      product={item as DbProduct}
      index={index}
      showMedals={showMedals}
      showTrendingBadge={showTrendingBadge}
      tagPrefix={tagPrefix}
    />
  )
}
