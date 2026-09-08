"use client"

import { useCallback } from "react"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { useInfiniteNewAndRising } from "@/hooks/discover/use-new-and-rising"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"

interface NewAndRisingContentProps {
  initialItems?: FeedItem[]
}

export const NewAndRisingContent = ({
  initialItems = [],
}: NewAndRisingContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteNewAndRising({
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
        showMedals={true}
        showTrendingBadge={false}
        showFreshnessBadge={true}
        emptyTitle="No new submissions in the discovery window"
        emptyDescription="No developer tools or products are currently in their 7-day discovery window. Be the first to launch yours!"
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
