"use client"

import { usePopularBuildingBlocks } from "@/hooks/home/use-popular-building-blocks"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"

export const PopularBuildingBlocksContent = () => {
  const { data, isLoading } = usePopularBuildingBlocks({ limit: 30 })
  const items = (data ?? []) as FeedItem[]

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <FeedList
        items={items}
        isLoading={isLoading}
        loadingCount={8}
        emptyTitle="No building blocks found yet"
        emptyDescription="No developer tools have been registered as building blocks yet."
      />
    </div>
  )
}
