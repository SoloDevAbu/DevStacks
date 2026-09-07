"use client"

import { useCallback } from "react"
import { useInfinitePopularBuildingBlocks } from "@/hooks/home/use-popular-building-blocks"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"

interface PopularBuildingBlocksContentProps {
  initialItems?: FeedItem[]
}

export const PopularBuildingBlocksContent = ({
  initialItems = [],
}: PopularBuildingBlocksContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfinitePopularBuildingBlocks({
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
        emptyTitle="No building blocks found yet"
        emptyDescription="No developer tools have been registered as building blocks yet."
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

