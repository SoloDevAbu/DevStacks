"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ToolList } from "@/components/shared/tool-list"
import type { DbTool } from "@/types/entities"
import { useInfiniteTools } from "@/hooks/tools/use-tools"
import {
  LoadMoreButton,
  buildPageHref,
} from "@/components/shared/load-more-button"
import {
  ToolsFilterBar,
  type SortOption,
} from "@/components/tools/tools-filter-bar"
import { ROUTES } from "@/constants/routes"

interface ToolsDirectoryContentProps {
  initialCategory?: string
  initialQuery?: string
  initialPricing?: string
  initialSortBy?: SortOption
  initialPage?: number
  totalPages?: number
  initialTools?: DbTool[]
}

export const ToolsDirectoryContent = ({
  initialCategory,
  initialQuery,
  initialPricing = "all",
  initialSortBy = "upvotes",
  initialPage = 1,
  totalPages,
  initialTools = [],
}: ToolsDirectoryContentProps) => {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialCategory
  )
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
      router.push(qs ? `${ROUTES.TOOLS}?${qs}` : ROUTES.TOOLS, {
        scroll: false,
      })
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
      initialPage,
      totalPages,
      initialData: isInitialParams ? initialTools : undefined,
    })

  const displayedTools =
    data?.pages.flatMap((page) => page) ?? (isInitialParams ? initialTools : [])

  const currentPageParam =
    data?.pageParams && data.pageParams.length > 0
      ? (data.pageParams[data.pageParams.length - 1] as number)
      : initialPage

  const nextPage = currentPageParam + 1

  const nextPageHref = buildPageHref(ROUTES.TOOLS, nextPage, {
    category: selectedCategory,
    pricing: selectedPricing,
    sortBy: sortBy !== "upvotes" ? sortBy : undefined,
    q: initialQuery,
  })

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
        <ToolList tools={displayedTools} showMedals />
        <LoadMoreButton
          href={nextPageHref}
          onLoadMore={fetchNextPage}
          isLoading={isFetchingNextPage}
          hasNextPage={Boolean(hasNextPage)}
        />
      </div>
    </div>
  )
}
