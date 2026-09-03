import { ArrowUp, Bookmark, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductLogo } from "@/components/shared/product-logo"
import { TIER, PRICING, type Tier, type Pricing } from "@/constants/tiers"
import {
  tierCardBg,
  tierContentBg,
  tierShimmerGradient,
  pricingBadgeColor,
} from "@/utils/styles"
import type { Product } from "@/constants/types"

export type { Product }

export const ProductList = ({
  products,
  showMedals = false,
  showTrendingBadge = true,
}: {
  products: Product[]
  showMedals?: boolean
  showTrendingBadge?: boolean
}) => {
  return (
    <div className="flex flex-col">
      {products.map((product, index) => {
        const tier: Tier =
          index % 3 === 0
            ? TIER.FREE
            : index % 3 === 1
              ? TIER.PREMIUM
              : TIER.PREMIUM_PLUS
        const isTrending = index < 2
        const pricing: Pricing =
          index % 4 === 0
            ? PRICING.FREE
            : index % 4 === 1
              ? PRICING.FREEMIUM
              : index % 4 === 2
                ? PRICING.PAID
                : PRICING.OPEN_SOURCE

        const views = ((product.upvotes * 11.6) / 1000).toFixed(1) + "K"

        return (
          <Card
            key={product.id}
            className={cn(
              "group relative z-0 rounded-none p-0 transition-colors",
              tierCardBg(tier),
              index > 0 && "-mt-px"
            )}
          >
            <CardContent
              className={cn(
                "relative flex items-center gap-4 overflow-hidden px-6 py-5 backdrop-blur-sm md:gap-6",
                tierContentBg(tier)
              )}
            >
              {tier !== TIER.FREE && (
                <div className="pointer-events-none absolute inset-0 z-[-1] overflow-hidden">
                  <div
                    className={cn(
                      "absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]",
                      tierShimmerGradient(tier)
                    )}
                  />
                </div>
              )}

              <div className="hidden w-6 shrink-0 sm:flex sm:items-center sm:justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center text-sm font-bold",
                    showMedals && product.rank === 1
                      ? "size-6 rounded-full bg-amber-400 text-white"
                      : showMedals && product.rank === 2
                        ? "size-6 rounded-full bg-slate-300 text-white"
                        : showMedals && product.rank === 3
                          ? "size-6 rounded-full bg-orange-400 text-white"
                          : "w-4 text-slate-400"
                  )}
                >
                  {product.rank}
                </div>
              </div>

              <ProductLogo
                {...product.logo}
                className="size-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 text-xl"
              />

              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-base font-bold text-slate-900">
                    {product.name}
                  </h3>
                  <VerifiedBadge tier={tier} />
                  {showTrendingBadge && isTrending && (
                    <Badge
                      variant="outline"
                      className="flex items-center gap-0.5 rounded-none border-transparent bg-green-100/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700 hover:bg-green-100/50"
                    >
                      <ArrowUp className="size-3" /> TRENDING
                    </Badge>
                  )}
                </div>

                <p className="line-clamp-1 text-sm font-medium text-slate-500">
                  {product.tagline}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="rounded-none bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                    >
                      {tag}
                    </Badge>
                  ))}
                  <div className="ml-2 flex items-center gap-1.5 text-sm font-semibold text-slate-400">
                    <Eye className="size-4" />
                    {views}
                  </div>
                </div>
              </div>

              <div className="ml-4 flex shrink-0 flex-col items-end gap-2.5">
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-none border-transparent px-2.5 py-1 text-[11px]",
                    pricingBadgeColor(pricing)
                  )}
                >
                  {pricing}
                </Badge>

                <div className="flex items-center gap-2">
                  <div className="group/btn relative inline-flex">
                    <Button
                      variant="outline"
                      className="relative z-10 h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      <ArrowUp className="size-4 text-slate-400" />
                      {product.upvotes.toLocaleString()}
                    </Button>
                    <HoverOutline />
                  </div>

                  <div className="group/btn relative inline-flex">
                    <Button
                      variant="outline"
                      className="relative z-10 size-8 rounded-lg border-slate-200 bg-white p-0 text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                    >
                      <Bookmark className="size-4" />
                    </Button>
                    <HoverOutline />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
