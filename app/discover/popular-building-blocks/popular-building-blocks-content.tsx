"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductLogo } from "@/components/shared/product-logo"
import { usePopularBuildingBlocks } from "@/hooks/products/use-popular-building-blocks"
import { Loader2 } from "lucide-react"
import { discoveryCard } from "@/utils/styles"
import type { DbProduct } from "@/components/home/product-list"
import type { Tier } from "@/constants/tiers"

export const PopularBuildingBlocksContent = () => {
  const { data, isLoading } = usePopularBuildingBlocks({ limit: 30 })
  const products = (data ?? []) as DbProduct[]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="mb-2 size-8 animate-spin text-slate-400" />
        <p className="text-xs font-medium text-slate-500">
          Loading popular building blocks...
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center text-sm text-slate-400">
        No building blocks found yet.
      </div>
    )
  }

  return (
    <div className="p-6 md:p-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
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
                        <h3 className="truncate text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {product.name}
                        </h3>
                        <VerifiedBadge tier={(product.tier ?? "free") as Tier} />
                      </div>
                      <p className="text-xs font-semibold text-blue-600">
                        {product.buildsCount} builds
                      </p>
                    </div>
                  </div>
                  <p className="line-clamp-2 text-xs font-medium text-slate-500">
                    {product.tagline}
                  </p>
                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-2 text-[10px] font-semibold text-slate-400">
                    <span>{category}</span>
                    <span>{product.upvotesCount} upvotes</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
