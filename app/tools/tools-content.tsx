"use client"

import { useState, useMemo, useCallback } from "react"
import { ToolList } from "@/components/shared/tool-list"
import type { DbTool } from "@/types/entities"
import { useInfiniteTools } from "@/hooks/tools/use-tools"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { ToolsFilterBar, type SortOption } from "@/components/tools/tools-filter-bar"
import { PRICING } from "@/constants/plans"

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
  const [selectedPricing, setSelectedPricing] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("upvotes")

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

  const rawTools = data?.pages.flatMap((page) => page) ?? initialTools

  const displayedTools = useMemo(() => {
    let result = rawTools

    if (selectedPricing !== "all") {
      result = result.filter(
        (tool) => tool.pricing.toLowerCase() === selectedPricing.toLowerCase()
      )
    }

    if (sortBy === "builds") {
      result = [...result].sort((a, b) => (b.buildsCount ?? 0) - (a.buildsCount ?? 0))
    } else if (sortBy === "upvotes") {
      result = [...result].sort((a, b) => (b.upvotesCount ?? 0) - (a.upvotesCount ?? 0))
    }

    return result
  }, [rawTools, selectedPricing, sortBy])

  return (
    <div className="flex w-full flex-1 flex-col">
      <ToolsFilterBar
        selectedCategory={initialCategory}
        selectedPricing={selectedPricing}
        onSelectPricing={setSelectedPricing}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <div className="flex w-full flex-1 flex-col pb-8">
        <ToolList
          tools={displayedTools}
          showMedals
          showTrendingBadge
        />
        <InfiniteScrollSentinel
          sentinelRef={sentinelRef}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
          hasItems={displayedTools.length > 0}
        />
      </div>
    </div>
  )
}
