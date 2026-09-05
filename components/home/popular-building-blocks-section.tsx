"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductLogo } from "@/components/shared/product-logo"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { usePopularBuildingBlocks } from "@/hooks/products/use-popular-building-blocks"
import { sectionGridWrapper, discoveryCard } from "@/utils/styles"
import { cn } from "@/lib/utils"
import type { DbProduct } from "@/components/home/product-list"
import type { Tier } from "@/constants/tiers"

export const PopularBuildingBlocksSection = () => {
  const { data, isLoading } = usePopularBuildingBlocks({
    limit: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS,
  })
  const products = (data ?? []) as DbProduct[]

  return (
    <section className="flex w-full flex-col">
      <SectionHeader
        title="Popular Building Blocks"
        subtitle="The tools developers are building with"
        viewAllText="View all tools"
        viewAllHref={ROUTES.DISCOVER_POPULAR_BUILDING_BLOCKS}
      />
      <div
        className={cn(
          sectionGridWrapper,
          "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3"
        )}
      >
        {isLoading ? (
          Array.from({ length: HOMEPAGE_LIMITS.POPULAR_BUILDING_BLOCKS }).map(
            (_, i) => (
              <Card
                key={i}
                className="h-28 animate-pulse rounded-none border border-slate-200 bg-slate-50/50"
              />
            )
          )
        ) : products.length === 0 ? (
          <div className="col-span-full py-8 text-center text-sm text-slate-400">
            No building blocks available yet.
          </div>
        ) : (
          products.map((product) => {
            const category =
              product.category ?? product.tags?.[0] ?? "Developer Tool"
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="block"
              >
                <Card className={discoveryCard}>
                  <CardContent className="flex flex-col gap-3 p-4">
                    <div className="flex items-center gap-3">
                      <ProductLogo
                        text={product.name.slice(0, 2).toUpperCase()}
                        bgColor="bg-slate-900"
                        textColor="text-white"
                        className="size-10 shrink-0 overflow-hidden rounded-lg font-bold"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <h3 className="truncate text-sm font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                            {product.name}
                          </h3>
                          <VerifiedBadge
                            tier={(product.tier ?? "free") as Tier}
                          />
                        </div>
                        <p className="text-xs font-semibold text-blue-600">
                          {product.buildsCount} builds
                        </p>
                      </div>
                    </div>
                    <p className="mt-auto text-xs font-medium text-slate-500">
                      {category}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })
        )}
      </div>
    </section>
  )
}
