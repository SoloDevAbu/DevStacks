"use client"

import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductCard } from "@/components/shared/product-card"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { useRisingProducts } from "@/hooks/products/use-rising-products"
import { sectionWrapper } from "@/utils/styles"
import type { DbProduct } from "@/components/home/product-list"

export const RisingProductsSection = () => {
  const { data, isLoading } = useRisingProducts({
    limit: HOMEPAGE_LIMITS.RISING_PRODUCTS,
  })
  const products = (data ?? []) as DbProduct[]

  return (
    <section className={sectionWrapper}>
      <SectionHeader
        title="Rising Products"
        subtitle="Products gaining momentum right now"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_RISING_PRODUCTS}
      />
      <div className="flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.RISING_PRODUCTS }).map(
            (_, i) => (
              <Card
                key={i}
                className="h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50"
              />
            )
          )
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No products gaining momentum yet.
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              showMedals={false}
              showTrendingBadge={true}
              tagPrefix="Built with"
            />
          ))
        )}
      </div>
    </section>
  )
}
