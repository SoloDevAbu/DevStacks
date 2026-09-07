"use client"

import { useCallback } from "react"
import { ToolList, type DbTool } from "@/components/shared/product-list"
import { useInfiniteTools } from "@/hooks/tools/use-tools"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"

interface ToolsDirectoryContentProps {
  initialCategory?: string
  initialQuery?: string
  initialTools?: DbTool[]
}

export const ToolsDirectoryContent = ({
  initialCategory,
  initialQuery,
  initialTools = [],
}: ToolsDirectoryContentProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTools({
      category: initialCategory,
      q: initialQuery,
      limit: 20,
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
        showTrendingBadge={false}
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

