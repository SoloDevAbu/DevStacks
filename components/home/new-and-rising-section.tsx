"use client"

import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductCard } from "@/components/shared/product-card"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { useNewAndRising } from "@/hooks/products/use-new-and-rising"
import { sectionWrapper } from "@/utils/styles"
import type { DbProduct } from "@/components/home/product-list"

export const NewAndRisingSection = () => {
  const { data, isLoading } = useNewAndRising({
    limit: HOMEPAGE_LIMITS.NEW_AND_RISING,
  })
  const products = (data ?? []) as DbProduct[]

  return (
    <section className={sectionWrapper}>
      <SectionHeader
        title="New & Rising"
        subtitle="Recently added tools and products gaining attention"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_NEW_RISING}
      />
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.NEW_AND_RISING }).map((_, i) => (
            <Card
              key={i}
              className="h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50"
            />
          ))
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No newly submitted products in the discovery window yet. Be the
            first to launch!
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              showMedals={true}
              showTrendingBadge={false}
            />
          ))
        )}
      </div>
    </section>
  )
}
