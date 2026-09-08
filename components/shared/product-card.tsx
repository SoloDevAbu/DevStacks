"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Heart,
  Bookmark,
  Eye,
  ExternalLink,
  ArrowUp,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductLogo } from "@/components/shared/product-logo"
import { TIER, type Tier, type Pricing } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"
import {
  tierCardBg,
  tierContentBg,
  tierShimmerGradient,
  pricingBadgeColor,
  bookmarkButtonActive,
  bookmarkButtonInactive,
  directoryCard,
  directoryCardContent,
  medalBadge,
} from "@/utils/styles"
import { getOutboundUrl, getLinkRel } from "@/utils/urls"
import { useLikeProduct } from "@/hooks/products/use-like-product"
import { useBookmarkProduct } from "@/hooks/products/use-bookmark-product"
import { useUserInteractions } from "@/hooks/users/use-user-interactions"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import type { DbProduct } from "@/types/entities"

export type { DbProduct }

interface ProductCardProps {
  product: DbProduct
  index?: number
  showMedals?: boolean
  showTrendingBadge?: boolean
  showFreshnessBadge?: boolean
}

export const ProductCard = ({
  product,
  index = 0,
  showMedals = false,
  showTrendingBadge = false,
  showFreshnessBadge = false,
}: ProductCardProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const likeMutation = useLikeProduct()
  const bookmarkMutation = useBookmarkProduct()
  const { isProductLiked, isProductBookmarked } = useUserInteractions()

  const [localLikes, setLocalLikes] = useState<number | null>(null)

  const tier: Tier = (product.tier ?? "free") as Tier
  const pricing: Pricing = (product.pricing ?? "Free") as Pricing
  const isTrending = index < 2
  const views = ((product.viewsCount ?? 0) / 1000).toFixed(1) + "K"
  const likeCount = localLikes ?? product.likesCount ?? 0
  const builtWithTools = product.builtWithTools ?? []

  const isLiked = isProductLiked(product.id, product.slug)
  const isBookmarked = isProductBookmarked(product.id, product.slug)

  const isLiking =
    likeMutation.isPending && likeMutation.variables?.slug === product.slug
  const isBookmarking =
    bookmarkMutation.isPending &&
    bookmarkMutation.variables?.slug === product.slug

  const outboundUrl = getOutboundUrl(product.websiteUrl ?? "", "devstack")
  const linkRel = getLinkRel(product.tier)

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(
        "button, a, input, [data-stop-card-click]"
      )
    ) {
      return
    }
    if (e.metaKey || e.ctrlKey) {
      window.open(ROUTES.PRODUCT(product.slug), "_blank")
    } else {
      router.push(ROUTES.PRODUCT(product.slug))
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    requireAuth(
      () => {
        if (!session?.user?.id) return
        likeMutation.mutate(
          { slug: product.slug, userId: session.user.id },
          {
            onSuccess: (data) => {
              setLocalLikes(data.likesCount)
            },
          }
        )
      },
      {
        title: "Sign in to like",
        description:
          "Sign in with your Google account to like and support developer products.",
      }
    )
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    requireAuth(
      () => {
        if (!session?.user?.id) return
        bookmarkMutation.mutate({ slug: product.slug, userId: session.user.id })
      },
      {
        title: "Sign in to bookmark",
        description:
          "Sign in with your Google account to save products to your library.",
      }
    )
  }

  return (
    <Card
      onClick={handleCardClick}
      className={cn(directoryCard, tierCardBg(tier), index > 0 && "-mt-px")}
    >
      <CardContent className={cn(directoryCardContent, tierContentBg(tier))}>
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

        {/* Index or Medal */}
        <div className="hidden w-6 shrink-0 sm:flex sm:items-center sm:justify-center">
          {showMedals ? (
            <div className={medalBadge(index + 1)}>{index + 1}</div>
          ) : (
            <div className="w-4 text-center text-sm font-bold text-slate-400">
              {index + 1}
            </div>
          )}
        </div>

        {/* Logo */}
        <a
          href={outboundUrl}
          target="_blank"
          rel={linkRel}
          onClick={(e) => e.stopPropagation()}
          className="shrink-0 transition-opacity hover:opacity-80"
          title={`Visit ${product.name}`}
        >
          <ProductLogo
            text={product.name.slice(0, 2).toUpperCase()}
            bgColor="bg-indigo-900"
            textColor="text-white"
            className="size-14 overflow-hidden rounded-xl border border-slate-200 text-xl"
          />
        </a>

        {/* Product Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-slate-900">
              <a
                href={outboundUrl}
                target="_blank"
                rel={linkRel}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 transition-colors hover:text-indigo-600"
                title={`Visit ${product.name}`}
              >
                {product.name}
                <ExternalLink className="size-3 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            </h3>
            <VerifiedBadge tier={tier} />
            {showTrendingBadge && isTrending && (
              <Badge
                variant="outline"
                className="flex items-center gap-0.5 rounded-none border-transparent bg-green-100/50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-green-700 uppercase hover:bg-green-100/50"
              >
                <ArrowUp className="size-3" /> TRENDING
              </Badge>
            )}
            {showFreshnessBadge &&
              typeof product.freshnessDaysLeft === "number" && (
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 rounded-none border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-700 uppercase hover:bg-amber-50"
                >
                  <Sparkles className="size-3 text-amber-500" />
                  {product.freshnessDaysLeft}d boost
                </Badge>
              )}
          </div>

          <p className="line-clamp-1 text-sm font-medium text-slate-500">
            {product.tagline}
          </p>

          {/* Row 1: Tags + views */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {(product.tags ?? []).slice(0, 3).map((tag) => (
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

          {/* Row 2: Built with (only shown when builtWithTools is non-empty) */}
          {builtWithTools.length > 0 && (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Built with
              </span>
              {builtWithTools.slice(0, 4).map((tool) =>
                tool.toolSlug ? (
                  <Link
                    key={tool.name}
                    href={ROUTES.TOOL(tool.toolSlug)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded-none bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100"
                  >
                    {tool.name}
                  </Link>
                ) : (
                  <span
                    key={tool.name}
                    className="rounded-none bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600"
                  >
                    {tool.name}
                  </span>
                )
              )}
            </div>
          )}
        </div>

        {/* Action Buttons & Pricing */}
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
            {/* Like Button */}
            <div
              className="group/btn relative inline-flex"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                onClick={handleLike}
                disabled={isLiking}
                className={cn(
                  "gap-1.5 rounded-none border-slate-200 px-3 py-2 text-sm font-semibold transition-all",
                  isLiked
                    ? "border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-50"
                    : "text-slate-500 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                )}
              >
                <Heart
                  className={cn(
                    "size-4",
                    isLiked ? "fill-pink-500 text-pink-500" : "text-slate-400"
                  )}
                  fill={isLiked ? "currentColor" : "none"}
                />
                {likeCount?.toLocaleString() ?? "0"}
              </Button>
              <HoverOutline />
            </div>

            {/* Bookmark Button */}
            <div
              className="group/btn relative inline-flex"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                onClick={handleBookmark}
                disabled={isBookmarking}
                className={cn(
                  isBookmarked ? bookmarkButtonActive : bookmarkButtonInactive
                )}
              >
                <Bookmark
                  className="size-4"
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </Button>
              <HoverOutline />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
