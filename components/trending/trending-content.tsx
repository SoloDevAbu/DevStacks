"use client"

import { ProductList } from "@/components/home/product-list"
import { PageHeader } from "@/components/shared/page-header"
import { FilterBar } from "@/components/trending/filter-bar"
import { AI_PROMPTS } from "@/lib/prompts"
import { useTrending } from "@/hooks/products/use-trending"
import { TRENDING_PRODUCTS } from "@/constants/products"

export const TrendingContent = () => {
  const { data } = useTrending(14)

  const products = data ?? TRENDING_PRODUCTS.map((p, i) => ({
    id: p.id,
    slug: p.name.toLowerCase().replace(/\s+/g, "-"),
    name: p.name,
    tagline: p.tagline,
    tags: p.tags,
    upvotesCount: p.upvotes,
    buildsCount: p.builds,
    commentsCount: p.comments,
    viewsCount: Math.round(p.upvotes * 11.6),
    pricing: "Free" as const,
    tier: (i % 3 === 0 ? "free" : i % 3 === 1 ? "premium" : "premium+") as "free" | "premium" | "premium+",
    logoUrl: null,
  }))

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Trending Products"
        description="Discover the most popular products and developer tools gaining traction right now"
        aiPrompt={AI_PROMPTS.trending}
      />
      <FilterBar />

      <div className="flex w-full flex-1 flex-col pt-4">
        <ProductList products={products} showMedals={true} showTrendingBadge={false} />
      </div>
    </div>
  )
}
