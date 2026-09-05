"use client"

import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/section-header"
import { ROUTES } from "@/constants/routes"
import { useTrending } from "@/hooks/products/use-trending"
import { ProductCard } from "@/components/shared/product-card"
import type { DbProduct } from "@/components/home/product-list"

export const TrendingNow = () => {
  const { data, isLoading } = useTrending(3)
  const products = (data ?? []) as DbProduct[]

  return (
    <section>
      <SectionHeader
        title="Trending right now"
        subtitle="Top trending products across the ecosystem"
        viewAllText="View all trending"
        viewAllHref={ROUTES.TRENDING}
      />
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="h-24 rounded-none border border-slate-200 bg-slate-50/50 animate-pulse"
            />
          ))
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No trending products available yet.
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              showMedals={true}
            />
          ))
        )}
      </div>
    </section>
  )
}
