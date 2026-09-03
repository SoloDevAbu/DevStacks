import { Eye, Heart, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductLogo } from "@/components/shared/product-logo"
import { TRENDING_PRODUCTS } from "@/constants/products"
import { TIER, PRICING, type Tier, type Pricing } from "@/constants/tiers"
import {
  tierCardBg,
  tierContentBg,
  tierShimmerGradient,
  pricingBadgeColor,
} from "@/utils/styles"

export const TrendingNow = () => {
  return (
    <section>
      <SectionHeader
        title="Trending right now"
        subtitle="Top trending products across the ecosystem"
        viewAllText="View all trending"
      />
      <div className="flex flex-col">
        {TRENDING_PRODUCTS.slice(0, 3).map((product, index) => {
          const tier: Tier =
            index === 0
              ? TIER.PREMIUM_PLUS
              : index === 1
                ? TIER.PREMIUM
                : TIER.FREE
          const views = ((product.upvotes * 11.6) / 1000).toFixed(1) + "K"
          const builtWith =
            index === 0
              ? ["Next.js", "Supabase"]
              : index === 1
                ? ["React", "Stripe"]
                : ["Vue", "Firebase"]
          const pricing: Pricing =
            index === 0
              ? PRICING.FREEMIUM
              : index === 1
                ? PRICING.PAID
                : PRICING.OPEN_SOURCE

          return (
            <Card
              key={product.id}
              className={cn(
                "group relative z-0 rounded-none p-0 transition-colors border",
                tierCardBg(tier),
                index > 0 && "-mt-px"
              )}
            >
              <CardContent
                className={cn(
                  "relative flex items-center gap-4 overflow-hidden p-4 backdrop-blur-sm",
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

                <div className="w-5 shrink-0 text-center text-sm font-bold text-slate-500">
                  {index + 1}
                </div>
                <ProductLogo
                  {...product.logo}
                  className="size-10 shrink-0 overflow-hidden rounded-lg"
                />

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold text-slate-900">
                      {product.name}
                    </h3>
                    <VerifiedBadge tier={tier} />
                  </div>

                  <p className="line-clamp-1 text-xs font-medium text-slate-500">
                    {product.tagline}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Built with
                      </span>
                      <div className="flex items-center gap-1">
                        {builtWith.map((tool) => (
                          <Badge
                            key={tool}
                            variant="secondary"
                            className="rounded-none px-1.5 py-0 text-[9px]"
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-slate-400">
                      <Eye className="size-3" /> {views}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex shrink-0 flex-col items-end gap-2.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-none border-transparent px-2.5 py-1 text-[11px] font-bold uppercase",
                      pricingBadgeColor(pricing)
                    )}
                  >
                    {pricing}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <div className="group/btn relative inline-flex">
                      <Button
                        variant="outline"
                        className="relative z-10 h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-500"
                      >
                        <Heart className="size-4" />
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
    </section>
  )
}
