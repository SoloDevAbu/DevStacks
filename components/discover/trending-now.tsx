"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Heart, Bookmark } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { SectionHeader } from "@/components/shared/section-header"
import { ProductLogo } from "@/components/shared/product-logo"
import { TIER, type Tier, type Pricing } from "@/constants/tiers"
import { ROUTES } from "@/constants/routes"
import {
  tierCardBg,
  tierContentBg,
  tierShimmerGradient,
  pricingBadgeColor,
} from "@/utils/styles"
import { useTrending } from "@/hooks/products/use-trending"
import { useUpvote } from "@/hooks/products/use-upvote"
import { useBookmark } from "@/hooks/products/use-bookmark"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import type { DbProduct } from "@/components/home/product-list"

export const TrendingNow = () => {
  const { data, isLoading } = useTrending(3)
  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const upvoteMutation = useUpvote()
  const bookmarkMutation = useBookmark()
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})
  const [localUpvotes, setLocalUpvotes] = useState<Record<string, number>>({})

  const products: DbProduct[] = (data ?? []) as DbProduct[]

  const handleUpvote = (product: DbProduct) => {
    requireAuth(
      () => {
        if (!session?.user?.id) return
        upvoteMutation.mutate(
          { slug: product.slug, userId: session.user.id },
          {
            onSuccess: (d) =>
              setLocalUpvotes((prev) => ({ ...prev, [product.id]: d.upvotesCount })),
          }
        )
      },
      {
        title: "Sign in to upvote",
        description: "Sign in with your Google account to upvote and support developer tools.",
      }
    )
  }

  const handleBookmark = (product: DbProduct) => {
    requireAuth(
      () => {
        if (!session?.user?.id) return
        bookmarkMutation.mutate(
          { slug: product.slug, userId: session.user.id },
          {
            onSuccess: (d) =>
              setBookmarked((prev) => ({ ...prev, [product.id]: d.action === "added" })),
          }
        )
      },
      {
        title: "Sign in to bookmark",
        description: "Sign in with your Google account to bookmark tools to your library.",
      }
    )
  }

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
            <Card key={i} className="h-24 rounded-none border border-slate-200 animate-pulse bg-slate-50/50" />
          ))
        ) : products.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-400">
            No trending products available yet.
          </div>
        ) : (
          products.map((product, index) => {
            const tier: Tier = (product.tier ?? "free") as Tier
            const pricing: Pricing = (product.pricing ?? "Free") as Pricing
            const views = ((product.viewsCount ?? 0) / 1000).toFixed(1) + "K"
            const upvoteCount = localUpvotes[product.id] ?? product.upvotesCount

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
                  <Link
                    href={`/products/${product.slug}`}
                    className="shrink-0 transition-opacity hover:opacity-80"
                  >
                    <ProductLogo
                      text={product.name.slice(0, 2).toUpperCase()}
                      bgColor="bg-slate-900"
                      textColor="text-white"
                      className="size-10 overflow-hidden rounded-lg"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-sm font-bold text-slate-900">
                        <Link
                          href={`/products/${product.slug}`}
                          className="transition-colors hover:text-indigo-600"
                        >
                          {product.name}
                        </Link>
                      </h3>
                      <VerifiedBadge tier={tier} />
                    </div>

                    <p className="line-clamp-1 text-xs font-medium text-slate-500">
                      {product.tagline}
                    </p>

                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                          Tags
                        </span>
                        <div className="flex items-center gap-1">
                          {(product.tags ?? []).slice(0, 2).map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="rounded-none px-1.5 py-0 text-[9px]"
                            >
                              {tag}
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
                          onClick={() => handleUpvote(product)}
                          disabled={upvoteMutation.isPending}
                          className="relative z-10 h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-500"
                        >
                          <Heart className="size-4" />
                          {upvoteCount.toLocaleString()}
                        </Button>
                        <HoverOutline />
                      </div>

                      <div className="group/btn relative inline-flex">
                        <Button
                          variant="outline"
                          onClick={() => handleBookmark(product)}
                          disabled={bookmarkMutation.isPending}
                          className={cn(
                            "relative z-10 size-8 rounded-lg border-slate-200 bg-white p-0 hover:bg-slate-50",
                            bookmarked[product.id] ? "text-indigo-500" : "text-slate-400 hover:text-slate-600"
                          )}
                        >
                          <Bookmark className="size-4" fill={bookmarked[product.id] ? "currentColor" : "none"} />
                        </Button>
                        <HoverOutline />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </section>
  )
}
