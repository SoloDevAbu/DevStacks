"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ToolList } from "@/components/shared/tool-list"
import type { DbTool } from "@/types/entities"
import { useInfiniteTools } from "@/hooks/tools/use-tools"
import { useIntersectionObserver } from "@/hooks/shared/use-intersection-observer"
import { InfiniteScrollSentinel } from "@/components/shared/infinite-scroll-sentinel"
import { ToolsFilterBar, type SortOption } from "@/components/tools/tools-filter-bar"
import { ROUTES } from "@/constants/routes"

interface ToolsDirectoryContentProps {
  initialCategory?: string
  initialQuery?: string
  initialPricing?: string
  initialSortBy?: SortOption
  initialTools?: DbTool[]
}

export const ToolsDirectoryContent = ({
  initialCategory,
  initialQuery,
  initialPricing = "all",
  initialSortBy = "upvotes",
  initialTools = [],
}: ToolsDirectoryContentProps) => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialCategory)
  const [selectedPricing, setSelectedPricing] = useState<string>(initialPricing)
  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy)

  const updateUrl = useCallback(
    (newCat?: string, newPricing?: string, newSort?: SortOption) => {
      const params = new URLSearchParams()
      const cat = newCat !== undefined ? newCat : selectedCategory
      const prc = newPricing !== undefined ? newPricing : selectedPricing
      const srt = newSort !== undefined ? newSort : sortBy

      if (cat && cat.toLowerCase() !== "all") params.set("category", cat)
      if (prc && prc.toLowerCase() !== "all") params.set("pricing", prc)
      if (srt && srt !== "upvotes") params.set("sortBy", srt)
      if (initialQuery) params.set("q", initialQuery)

      const qs = params.toString()
      router.push(qs ? `${ROUTES.TOOLS}?${qs}` : ROUTES.TOOLS, { scroll: false })
    },
    [router, selectedCategory, selectedPricing, sortBy, initialQuery]
  )

  const handleCategoryChange = (catName: string | null) => {
    const val = catName && catName.toLowerCase() !== "all" ? catName : undefined
    setSelectedCategory(val)
    updateUrl(val, selectedPricing, sortBy)
  }

  const handlePricingChange = (pricing: string) => {
    setSelectedPricing(pricing)
    updateUrl(selectedCategory, pricing, sortBy)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    updateUrl(selectedCategory, selectedPricing, sort)
  }

  const isInitialParams =
    selectedCategory === initialCategory &&
    selectedPricing === initialPricing &&
    sortBy === initialSortBy

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteTools({
      category: selectedCategory,
      q: initialQuery,
      pricing: selectedPricing === "all" ? undefined : selectedPricing,
      sortBy,
      limit: 20,
      initialData: isInitialParams ? initialTools : undefined,
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

  const displayedTools = data?.pages.flatMap((page) => page) ?? (isInitialParams ? initialTools : [])

  return (
    <div className="flex w-full flex-1 flex-col">
      <ToolsFilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        selectedPricing={selectedPricing}
        onSelectPricing={handlePricingChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
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
