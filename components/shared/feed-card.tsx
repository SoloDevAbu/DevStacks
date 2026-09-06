"use client"

import { ToolCard, type DbTool } from "@/components/shared/tool-card"
import { ProductCard, type DbProduct } from "@/components/shared/product-card"

export type FeedItem =
  | (DbTool & { itemKind: "tool" })
  | (DbProduct & { itemKind: "product" })

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
