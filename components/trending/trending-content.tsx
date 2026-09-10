"use client"

import { useState } from "react"
import { Flame } from "lucide-react"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"
import { heroStatPill } from "@/utils/styles"
import { useTrending } from "@/hooks/trending/use-trending"
import type { TimeframeOption } from "@/lib/rankings/types"

export const TrendingContent = ({
  initialCategory,
}: {
  initialCategory?: string
} = {}) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("today")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory ?? null
  )

  const { data, isLoading } = useTrending(
    14,
    timeframe,
    selectedCategory ?? undefined
  )

  const items = (data ?? []) as FeedItem[]

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
        onTimeframeChange={(val) => setTimeframe(val)}
        selectedCategory={selectedCategory}
        onCategoryChange={(cat) => setSelectedCategory(cat)}
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
