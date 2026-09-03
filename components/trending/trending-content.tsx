import { ProductList } from "@/components/home/product-list"
import { TRENDING_PRODUCTS } from "@/constants/products"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"

export const TrendingContent = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Trending Products"
        description="Discover the most popular products and developer tools gaining traction right now"
        aiPrompt={AI_PROMPTS.trending}
      />
      <FilterBar />

      <div className="flex w-full flex-1 flex-col pt-4">
        <ProductList products={TRENDING_PRODUCTS} showMedals={true} showTrendingBadge={false} />
      </div>
    </div>
  )
}
