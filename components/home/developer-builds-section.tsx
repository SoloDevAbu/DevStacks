"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductCard, type DbProduct } from "@/components/shared/product-card"
import { useRisingProducts } from "@/hooks/home/use-rising-products"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"

export const DeveloperBuildsSection = () => {
  const { data, isLoading } = useRisingProducts({
    limit: HOMEPAGE_LIMITS.DEVELOPER_BUILDS,
  })
  const products = (data ?? []) as DbProduct[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="See what developers are building"
        subtitle="Real products built with the tools developers love"
        viewAllText="View all products"
        viewAllHref={ROUTES.DISCOVER_RISING_PRODUCTS}
      />
      <div className="-mt-px flex flex-col">
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.DEVELOPER_BUILDS }).map((_, i) => (
            <Card
              key={i}
              className={cn(
                "h-24 animate-pulse rounded-none border border-slate-200 bg-slate-50/50",
                i > 0 && "-mt-px"
              )}
            />
          ))
        ) : products.length === 0 ? (
          <div className="border-b border-dashed border-border bg-white py-8 text-center text-sm text-slate-400">
            No developer products yet. Be the first to submit yours!
          </div>
        ) : (
          products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        )}
      </div>
    </section>
  )
}
