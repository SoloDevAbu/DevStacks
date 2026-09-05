"use client"

import { useState } from "react"
import { ProductList, type DbProduct } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"
import { useTrending } from "@/hooks/products/use-trending"
import type { TimeframeOption } from "@/lib/rankings/types"
import { Loader2 } from "lucide-react"

export const TrendingContent = () => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>("today")
  const { data, isLoading } = useTrending(14, timeframe)

  const products = (data ?? []) as DbProduct[]

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Trending Products"
        description="Discover the most popular products and developer tools gaining traction right now"
        aiPrompt={AI_PROMPTS.trending}
      />
      <FilterBar
        timeframe={timeframe}
        onTimeframeChange={(val) => setTimeframe(val)}
      />

      <div className="flex w-full flex-1 flex-col pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
            <p className="text-xs font-medium text-slate-500">
              Loading trending products...
            </p>
          </div>
        ) : (
          <ProductList
            products={products}
            showMedals={true}
            showTrendingBadge={false}
          />
        )}
      </div>
    </div>
  )
}
