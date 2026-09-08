"use client"

import { ToolCard } from "@/components/shared/tool-card"
import { ProductCard } from "@/components/shared/product-card"
import type { DbTool, DbProduct } from "@/types/entities"

export type FeedItem =
  (DbTool & { itemKind: "tool" }) | (DbProduct & { itemKind: "product" })

interface FeedCardProps {
  item: FeedItem
  index?: number
  showMedals?: boolean
  showTrendingBadge?: boolean
  showFreshnessBadge?: boolean
}

export const FeedCard = ({
  item,
  index = 0,
  showMedals = false,
  showTrendingBadge = false,
  showFreshnessBadge = false,
}: FeedCardProps) => {
  const isProduct =
    ("itemKind" in item && item.itemKind === "product") ||
    ("likesCount" in item && !("upvotesCount" in item))

  if (isProduct) {
    return (
      <ProductCard
        product={item as DbProduct}
        index={index}
        showMedals={showMedals}
        showTrendingBadge={showTrendingBadge}
        showFreshnessBadge={showFreshnessBadge}
      />
    )
  }

  return (
    <ToolCard
      tool={item as DbTool}
      index={index}
      showMedals={showMedals}
      showTrendingBadge={showTrendingBadge}
      showFreshnessBadge={showFreshnessBadge}
    />
  )
}
