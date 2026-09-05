"use client"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductCard } from "@/components/shared/product-card"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { useRisingProducts } from "@/hooks/products/use-rising-products"
import type { DbProduct } from "@/components/home/product-list"

export const RisingProductsSection = () => {
  const { data, isLoading } = useRisingProducts({
    limit: HOMEPAGE_LIMITS.RISING_PRODUCTS,
  })
  const products = (data ?? []) as DbProduct[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Rising Products"
        subtitle="Products gaining momentum right now"
        viewAllText="View all"
        viewAllHref={ROUTES.DISCOVER_RISING_PRODUCTS}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.RISING_PRODUCTS }).map(
            (_, i) => (
              <Card
                key={i}
                className={cn(
                  "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
                  i > 0 && "-mt-px"
                )}
              />
            )
          )
        ) : products.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
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
