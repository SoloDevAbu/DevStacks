"use client"

import { useCallback } from "react"
import { ToolList } from "@/components/shared/tool-list"
import type { DbTool } from "@/types/entities"
import { useInfiniteRisingTools } from "@/hooks/discover/use-rising-tools"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { DISCOVER_PAGE_LIMIT } from "@/constants/rankings"

interface RisingToolsContentProps {
  initialTools?: DbTool[]
}

export const RisingToolsContent = ({
  initialTools = [],
}: RisingToolsContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteRisingTools({
      limit: DISCOVER_PAGE_LIMIT,
      initialData: initialTools,
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

  const tools = data?.pages.flatMap((page) => page) ?? initialTools

  return (
    <div className="flex w-full flex-1 flex-col pt-2 pb-8">
      <ToolList
        tools={tools}
        showMedals={false}
        showTrendingBadge={true}
      />
      <InfiniteScrollSentinel
        sentinelRef={sentinelRef}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={Boolean(hasNextPage)}
        hasItems={tools.length > 0}
      />
    </div>
  )
}

