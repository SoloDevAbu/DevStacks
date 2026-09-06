"use client"

import { useRecentlyAdded } from "@/hooks/home/use-recently-added"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"

export const RecentlyAddedContent = () => {
  const { data, isLoading } = useRecentlyAdded({ limit: 30 })
  const items = (data ?? []) as FeedItem[]

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <FeedList
        items={items}
        isLoading={isLoading}
        loadingCount={8}
        emptyTitle="No recently added items"
        emptyDescription="No developer tools or products have been recently added yet."
      />
    </div>
  )
}
