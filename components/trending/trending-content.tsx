"use client"

import { ProductList, type DbProduct } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"
import { useTrending } from "@/hooks/products/use-trending"
import { Loader2 } from "lucide-react"

export const TrendingContent = () => {
  const { data, isLoading } = useTrending(14)

  const products = (data ?? []) as DbProduct[]

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Trending Products"
        description="Discover the most popular products and developer tools gaining traction right now"
        aiPrompt={AI_PROMPTS.trending}
      />
      <FilterBar />

      <div className="flex w-full flex-1 flex-col pt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <Loader2 className="size-8 animate-spin text-slate-400 mb-2" />
            <p className="text-xs text-slate-500 font-medium">Loading trending products...</p>
          </div>
        ) : (
          <ProductList products={products} showMedals={true} showTrendingBadge={false} />
        )}
      </div>
    </div>
  )
}
