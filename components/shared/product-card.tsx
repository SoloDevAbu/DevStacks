"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Heart,
  Bookmark,
  ExternalLink,
  ArrowUp,
  Sparkles,
  Tag,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { ProductLogo } from "@/components/shared/product-logo"
import { ItemTypeBadge } from "@/components/shared/item-type-badge"
import { ITEM_KIND } from "@/constants/items"
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
  cardCommentIcon,
  cardCommentGroup,
  cardTagBadge,
  cardTagIcon,
  cardTagsGroup,
} from "@/utils/styles"
import { getOutboundUrl, getLinkRel, getFaviconUrl } from "@/utils/urls"
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
  showTypeBadge?: boolean
}

export const ProductCard = ({
  product,
  index = 0,
  showMedals = false,
  showTrendingBadge = false,
  showFreshnessBadge = false,
  showTypeBadge = false,
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
  const likeCount = localLikes ?? product.likesCount ?? 0
  const builtWithTools = product.builtWithTools ?? []

  const isLiked = isProductLiked(product.id, product.slug)
  const isBookmarked = isProductBookmarked(product.id, product.slug)

  const isLiking =
    likeMutation.isPending && likeMutation.variables?.slug === product.slug
  const isBookmarking =
    bookmarkMutation.isPending &&
    bookmarkMutation.variables?.slug === product.slug

  const outboundUrl = getOutboundUrl(product.websiteUrl ?? "", "launchnests")
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

  const logoUrl = product.logoUrl?.trim() || getFaviconUrl(product.websiteUrl)

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
            imageUrl={logoUrl}
            websiteUrl={product.websiteUrl}
            alt={product.name}
            className="size-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 text-lg sm:size-14 sm:rounded-xl sm:text-xl"
          />
        </a>

        {/* Product Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5 sm:gap-1">
          <div className="flex min-w-0 items-center gap-1.5 overflow-hidden flex-nowrap sm:gap-2">
            <h3 className="min-w-0 truncate text-sm font-bold text-slate-900 sm:text-base">
              <a
                href={outboundUrl}
                target="_blank"
                rel={linkRel}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex min-w-0 items-center gap-1.5 transition-colors hover:text-indigo-600"
                title={`Visit ${product.name}`}
              >
                <span className="truncate">{product.name}</span>
                <VerifiedBadge tier={tier} className="size-3.5 shrink-0 sm:size-4" />
                <ExternalLink className="hidden size-3 shrink-0 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 sm:inline" />
              </a>
            </h3>
            {showTypeBadge && <ItemTypeBadge kind={ITEM_KIND.PRODUCT} className="shrink-0 text-[10px]" />}
            {showTrendingBadge && isTrending && (
              <Badge
                variant="outline"
                className="hidden shrink-0 items-center gap-0.5 rounded-none border-transparent bg-green-100/50 px-1.5 py-0 text-[9px] font-bold tracking-wider text-green-700 uppercase hover:bg-green-100/50 sm:inline-flex sm:px-2 sm:py-0.5 sm:text-[10px]"
              >
                <ArrowUp className="size-2.5 sm:size-3" /> TRENDING
              </Badge>
            )}
            {showFreshnessBadge &&
              typeof product.freshnessDaysLeft === "number" && (
                <Badge
                  variant="outline"
                  className="hidden shrink-0 items-center gap-1 rounded-none border-amber-300 bg-amber-50 px-1.5 py-0 text-[9px] font-bold tracking-wider text-amber-700 uppercase hover:bg-amber-50 sm:inline-flex sm:px-2 sm:py-0.5 sm:text-[10px]"
                >
                  <Sparkles className="size-2.5 text-amber-500 sm:size-3" />
                  {product.freshnessDaysLeft}d boost
                </Badge>
              )}
          </div>

          <p className="line-clamp-1 text-xs font-normal text-slate-500 sm:text-sm">
            {product.tagline}
          </p>

          {/* Comments, tags + Built with row */}
          {((product.commentsCount ?? 0) >= 0 || (product.tags ?? []).length > 0 || builtWithTools.length > 0) && (
            <div className="mt-0.5 flex min-w-0 items-center gap-2 overflow-hidden flex-nowrap sm:mt-1.5 sm:gap-2.5">
              <Link
                href={`${ROUTES.PRODUCT(product.slug)}#comments`}
                onClick={(e) => e.stopPropagation()}
                className={cardCommentGroup}
                title={`${(product.commentsCount ?? 0).toLocaleString()} comments`}
                aria-label={`${(product.commentsCount ?? 0).toLocaleString()} comments`}
              >
                <MessageSquare className={cardCommentIcon} />
                <span>{(product.commentsCount ?? 0).toLocaleString()}</span>
              </Link>

              {(product.tags ?? []).length > 0 && (
                <div className={cardTagsGroup}>
                  <Tag className={cardTagIcon} />
                  <div className="flex min-w-0 items-center gap-1 overflow-hidden flex-nowrap sm:gap-1.5">
                    {(product.tags ?? []).map((tag, tagIdx) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className={cn(
                          cardTagBadge,
                          tagIdx > 1 && "hidden sm:inline-flex"
                        )}
                      >
                        <span className="truncate">{tag}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {builtWithTools.length > 0 && (
                <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Built with
                  </span>
                  {builtWithTools.slice(0, 3).map((tool) =>
                    tool.toolSlug ? (
                      <Link
                        key={tool.name}
                        href={ROUTES.TOOL(tool.toolSlug)}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded-none bg-indigo-50 px-1.5 py-0 text-[10px] font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 sm:px-2 sm:py-0.5 sm:text-xs"
                      >
                        {tool.name}
                      </Link>
                    ) : (
                      <span
                        key={tool.name}
                        className="rounded-none bg-slate-100 px-1.5 py-0 text-[10px] font-semibold text-slate-600 sm:px-2 sm:py-0.5 sm:text-xs"
                      >
                        {tool.name}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons & Pricing */}
        <div className="ml-2 flex shrink-0 flex-col items-end gap-1.5 sm:ml-4 sm:gap-2">
          <Badge
            variant="outline"
            className={cn(
              "rounded-none border-transparent px-2 py-0.5 text-[10px] sm:px-2.5 sm:py-1 sm:text-[11px]",
              pricingBadgeColor(pricing)
            )}
          >
            {pricing}
          </Badge>

          <div className="flex items-center gap-1.5 sm:gap-2">
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
                  "h-7.5 sm:h-8 gap-1 sm:gap-1.5 rounded-none border-slate-200 px-2 sm:px-3 text-xs sm:text-sm font-semibold transition-all",
                  isLiked
                    ? "border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-50"
                    : "text-slate-500 hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
                )}
              >
                <Heart
                  className={cn(
                    "size-3.5 sm:size-4",
                    isLiked ? "fill-pink-500 text-pink-500" : "text-slate-400"
                  )}
                  fill={isLiked ? "currentColor" : "none"}
                />
                <span>{likeCount?.toLocaleString() ?? "0"}</span>
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
                  "size-7.5 sm:size-8",
                  isBookmarked ? bookmarkButtonActive : bookmarkButtonInactive
                )}
              >
                <Bookmark
                  className="size-3.5 sm:size-4"
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
