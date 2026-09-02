import { ProductList } from "@/components/home/product-list"
import { TRENDING_PRODUCTS } from "@/components/home/main-content"
import { FilterBar } from "@/components/trending/filter-bar"
import { StatsBanner } from "@/components/trending/stats-banner"

export function TrendingContent() {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <FilterBar />
      <StatsBanner />

      {/* Product List Section (Full Width, No Gaps) */}
      <div className="flex w-full flex-1 flex-col pt-4">
        <ProductList products={TRENDING_PRODUCTS} showMedals={true} />
      </div>
    </div>
  )
}
