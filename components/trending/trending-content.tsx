"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Flame } from "lucide-react"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"
import { heroStatPill } from "@/utils/styles"
import { useTrending } from "@/hooks/trending/use-trending"
import type { TimeframeOption, RankedItem } from "@/lib/rankings/types"
import { ROUTES } from "@/constants/routes"

interface TrendingContentProps {
  initialCategory?: string
  initialTimeframe?: TimeframeOption
  initialItems?: RankedItem[]
}

export const TrendingContent = ({
  initialCategory,
  initialTimeframe = "today",
  initialItems = [],
}: TrendingContentProps) => {
  const router = useRouter()
  const [timeframe, setTimeframe] = useState<TimeframeOption>(initialTimeframe)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory ?? null
  )

  const updateUrl = useCallback(
    (newTimeframe?: TimeframeOption, newCat?: string | null) => {
      const params = new URLSearchParams()
      const tf = newTimeframe !== undefined ? newTimeframe : timeframe
      const cat = newCat !== undefined ? newCat : selectedCategory

      if (tf && tf !== "today") params.set("timeframe", tf)
      if (cat && cat.toLowerCase() !== "all") params.set("category", cat)

      const qs = params.toString()
      router.push(qs ? `${ROUTES.TRENDING}?${qs}` : ROUTES.TRENDING, { scroll: false })
    },
    [router, timeframe, selectedCategory]
  )

  const handleTimeframeChange = (val: TimeframeOption) => {
    setTimeframe(val)
    updateUrl(val, selectedCategory)
  }

  const handleCategoryChange = (cat: string | null) => {
    const val = cat && cat.toLowerCase() !== "all" ? cat : null
    setSelectedCategory(val)
    updateUrl(timeframe, val)
  }

  const isInitialParams =
    timeframe === initialTimeframe &&
    (selectedCategory ?? null) === (initialCategory ?? null)

  const { data, isLoading } = useTrending(
    14,
    timeframe,
    selectedCategory ?? undefined,
    isInitialParams ? initialItems : undefined
  )

  const items = (data ?? (isInitialParams ? initialItems : [])) as FeedItem[]

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading={
          selectedCategory
            ? `Trending ${selectedCategory} Tools & Products`
            : "Trending Tools & Products"
        }
        description={
          selectedCategory
            ? `Discover the most popular ${selectedCategory} developer tools and products gaining traction right now`
            : "Discover the most popular products and developer tools gaining traction right now"
        }
        aiPrompt={AI_PROMPTS.trending}
        variant="trending"
        metrics={
          <div className={heroStatPill}>
            <Flame className="size-3.5 text-amber-500" />
            <span className="font-bold text-slate-900">Live Rankings</span>
            <span className="text-slate-500">Ranked by Upvotes</span>
          </div>
        }
      />
      <FilterBar
        timeframe={timeframe}
        onTimeframeChange={handleTimeframeChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <div className="flex w-full flex-1 flex-col pt-4">
        <FeedList
          items={items}
          isLoading={isLoading}
          loadingCount={10}
          showMedals={true}
          showTrendingBadge={false}
          emptyTitle={
            selectedCategory
              ? `No trending ${selectedCategory} tools or products`
              : "No trending tools or products"
          }
          emptyDescription={
            selectedCategory
              ? `No items found in the "${selectedCategory}" category for this timeframe. Try another timeframe or category!`
              : "No tools or products found for this timeframe. Be the first to launch or upvote!"
          }
        />
      </div>
    </div>
  )
}
