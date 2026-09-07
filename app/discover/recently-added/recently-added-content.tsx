"use client"

import { useCallback } from "react"
import { useInfiniteRecentlyAdded } from "@/hooks/home/use-recently-added"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"

interface RecentlyAddedContentProps {
  initialItems?: FeedItem[]
}

export const RecentlyAddedContent = ({
  initialItems = [],
}: RecentlyAddedContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRecentlyAdded({
      limit: DISCOVER_PAGE_LIMIT,
      initialData: initialItems,
    })

  const handleIntersect = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sentinelRef = useIntersectionObserver({
    onIntersect: handleIntersect,
    enabled: hasNextPage && !isFetchingNextPage,
  })

  const items = data?.pages.flatMap((page) => page) ?? initialItems

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <FeedList
        items={items}
        emptyTitle="No recently added items"
        emptyDescription="No developer tools or products have been recently added yet."
      />
      <InfiniteScrollSentinel
        sentinelRef={sentinelRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={Boolean(hasNextPage)}
        hasItems={items.length > 0}
      />
    </div>
  )
}

