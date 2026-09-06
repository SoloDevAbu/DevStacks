"use client"

import { useState } from "react"
import { FeedList } from "@/components/shared/feed-list"
import type { FeedItem } from "@/components/shared/feed-card"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"
import { useTrending } from "@/hooks/products/use-trending"
import type { TimeframeOption } from "@/lib/rankings/types"

export const TrendingContent = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("today")
  const { data, isLoading } = useTrending(14, timeframe)

  const items = (data ?? []) as FeedItem[]

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Trending Tools & Products"
        description="Discover the most popular products and developer tools gaining traction right now"
        aiPrompt={AI_PROMPTS.trending}
      />
      <FilterBar
        timeframe={timeframe}
        onTimeframeChange={(val) => setTimeframe(val)}
      />

      <div className="flex w-full flex-1 flex-col pt-4">
        <FeedList
          items={items}
          isLoading={isLoading}
          loadingCount={10}
          showMedals={true}
          showTrendingBadge={false}
          emptyTitle="No trending tools or products"
          emptyDescription="No tools or products found for this timeframe. Be the first to launch or upvote!"
        />
      </div>
    </div>
  )
}
