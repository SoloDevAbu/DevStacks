import { ProductList } from "@/components/home/product-list"
import { TRENDING_PRODUCTS } from "@/components/home/main-content"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { StatsBanner } from "@/components/trending/stats-banner"
import { AI_PROMPTS } from "@/lib/prompts"

export function TrendingContent() {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Trending Products"
        description="Discover the most popular products and developer tools gaining traction right now"
        aiPrompt={AI_PROMPTS.trending}
      />
      <FilterBar />

      {/* Product List Section (Full Width, No Gaps) */}
      <div className="flex w-full flex-1 flex-col pt-4">
        <ProductList products={TRENDING_PRODUCTS} showMedals={true} showTrendingBadge={false} />
      </div>
    </div>
  )
}
