"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Heart, Bookmark, Loader2, PackageSearch, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductLogo } from "@/components/shared/product-logo"
import { TIER, type Tier, type Pricing } from "@/constants/tiers"
import { ROUTES } from "@/constants/routes"
import {
  tierCardBg,
  tierContentBg,
  tierShimmerGradient,
  pricingBadgeColor,
} from "@/utils/styles"
import { useProducts } from "@/hooks/products/use-products"
import { useUpvote } from "@/hooks/products/use-upvote"
import { useBookmark } from "@/hooks/products/use-bookmark"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import type { DbProduct } from "@/components/home/product-list"

export const BuiltWithList = ({
  showMedals = false,
}: {
  showMedals?: boolean
}) => {
  const { data, isLoading } = useProducts({ sortBy: "builds", limit: 14 })
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center">
        <Loader2 className="size-8 animate-spin text-slate-400 mb-2" />
        <p className="text-xs text-slate-500 font-medium">Loading building blocks...</p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="rounded-full bg-slate-100 p-4 text-slate-400 mb-3">
          <PackageSearch className="size-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">No tools found</h3>
        <p className="mt-1 text-sm text-slate-500 max-w-sm">
          No developer tools have been registered yet. Add your building block to DevStacks!
        </p>
        <div className="mt-4">
          <Button nativeButton={false} render={<Link href={ROUTES.SUBMIT} />}>
            <PlusCircle className="size-4 mr-1.5" />
            List a Tool
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col pb-8">
      {products.map((product, index) => {
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
                "relative flex items-center gap-4 overflow-hidden p-4 md:p-6 backdrop-blur-sm",
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
                {showMedals ? (
                  <div
                    className={cn(
                      "flex items-center justify-center text-sm font-bold",
                      index + 1 === 1
                        ? "size-6 rounded-full bg-amber-400 text-white"
                        : index + 1 === 2
                          ? "size-6 rounded-full bg-slate-300 text-white"
                          : index + 1 === 3
                            ? "size-6 rounded-full bg-orange-400 text-white"
                            : "w-4 text-slate-400"
                    )}
                  >
                    {index + 1}
                  </div>
                ) : (
                  <div className="text-center text-sm font-bold text-slate-500">
                    {index + 1}
                  </div>
                )}
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
                <p className="line-clamp-1 text-xs font-medium text-slate-500">{product.tagline}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Built with
                    </span>
                    <div className="flex items-center gap-1">
                      {(product.tags ?? []).slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="secondary" className="rounded-none px-1.5 py-0 text-[9px]">
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
                  className={cn("rounded-none border-transparent px-2.5 py-1 text-[11px] font-bold uppercase", pricingBadgeColor(pricing))}
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
      })}
    </div>
  )
}
