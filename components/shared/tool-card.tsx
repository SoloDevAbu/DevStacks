"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowBigUp, Bookmark, Eye, ExternalLink, ArrowUp, Sparkles } from "lucide-react"
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
  upvoteButtonActive,
  upvoteButtonInactive,
  bookmarkButtonActive,
  bookmarkButtonInactive,
  directoryCard,
  directoryCardContent,
  medalBadge,
} from "@/utils/styles"
import { getOutboundUrl, getLinkRel } from "@/utils/urls"
import { useUpvoteTool } from "@/hooks/tools/use-upvote-tool"
import { useBookmarkTool } from "@/hooks/tools/use-bookmark-tool"
import { useUserInteractions } from "@/hooks/users/use-user-interactions"
import { useSession } from "@/lib/auth/client"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import type { DbTool } from "@/types/entities"

export type { DbTool }

interface ToolCardProps {
  tool: DbTool
  index?: number
  showMedals?: boolean
  showTrendingBadge?: boolean
  showFreshnessBadge?: boolean
}

export const ToolCard = ({
  tool,
  index = 0,
  showMedals = false,
  showTrendingBadge = false,
  showFreshnessBadge = false,
}: ToolCardProps) => {
  const router = useRouter()
  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const upvoteMutation = useUpvoteTool()
  const bookmarkMutation = useBookmarkTool()
  const { isToolUpvoted, isToolBookmarked } = useUserInteractions()

  const [localUpvotes, setLocalUpvotes] = useState<number | null>(null)

  const tier: Tier = (tool.tier ?? "free") as Tier
  const pricing: Pricing = (tool.pricing ?? "Free") as Pricing
  const isTrending = index < 2
  const views = ((tool.viewsCount ?? 0) / 1000).toFixed(1) + "K"
  const upvoteCount = localUpvotes ?? tool.upvotesCount ?? 0

  const isUpvoted = isToolUpvoted(tool.id, tool.slug)
  const isBookmarked = isToolBookmarked(tool.id, tool.slug)

  const isUpvoting =
    upvoteMutation.isPending && upvoteMutation.variables?.slug === tool.slug
  const isBookmarking =
    bookmarkMutation.isPending && bookmarkMutation.variables?.slug === tool.slug

  const outboundUrl = getOutboundUrl(tool.websiteUrl ?? "", "devstack")
  const linkRel = getLinkRel(tool.tier)

  const handleCardClick = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(
        "button, a, input, [data-stop-card-click]"
      )
    ) {
      return
    }
    if (e.metaKey || e.ctrlKey) {
      window.open(ROUTES.TOOL(tool.slug), "_blank")
    } else {
      router.push(ROUTES.TOOL(tool.slug))
    }
  }

  const handleUpvote = (e: React.MouseEvent) => {
    e.stopPropagation()
    requireAuth(
      () => {
        if (!session?.user?.id) return
        upvoteMutation.mutate(
          { slug: tool.slug, userId: session.user.id },
          {
            onSuccess: (data) => {
              setLocalUpvotes(data.upvotesCount)
            },
          }
        )
      },
      {
        title: "Sign in to upvote",
        description:
          "Sign in with your Google account to upvote and support developer tools.",
      }
    )
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    requireAuth(
      () => {
        if (!session?.user?.id) return
        bookmarkMutation.mutate({ slug: tool.slug, userId: session.user.id })
      },
      {
        title: "Sign in to bookmark",
        description:
          "Sign in with your Google account to bookmark tools to your library.",
      }
    )
  }

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        directoryCard,
        tierCardBg(tier),
        index > 0 && "-mt-px"
      )}
    >
      <CardContent
        className={cn(
          directoryCardContent,
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

        {/* Index or Medal indicator */}
        <div className="hidden w-6 shrink-0 sm:flex sm:items-center sm:justify-center">
          {showMedals ? (
            <div className={medalBadge(index + 1)}>
              {index + 1}
            </div>
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
          title={`Visit ${tool.name}`}
        >
          <ProductLogo
            text={tool.name.slice(0, 2).toUpperCase()}
            bgColor="bg-slate-900"
            textColor="text-white"
            className="size-14 overflow-hidden rounded-xl border border-slate-200 text-xl"
          />
        </a>

        {/* Tool Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-slate-900">
              <a
                href={outboundUrl}
                target="_blank"
                rel={linkRel}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 transition-colors hover:text-indigo-600"
                title={`Visit ${tool.name}`}
              >
                {tool.name}
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
            {showFreshnessBadge && typeof tool.freshnessDaysLeft === "number" && (
              <Badge
                variant="outline"
                className="flex items-center gap-1 rounded-none border-amber-300 bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:bg-amber-50"
              >
                <Sparkles className="size-3 text-amber-500" />
                {tool.freshnessDaysLeft}d boost
              </Badge>
            )}
          </div>

          <p className="line-clamp-1 text-sm font-medium text-slate-500">
            {tool.tagline}
          </p>

          {/* Tags + stats row */}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {(tool.tags ?? []).slice(0, 3).map((tag) => (
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
            <div className="flex items-center text-sm font-semibold text-blue-600">
              {tool.buildsCount} builds
            </div>
          </div>
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
            {/* Upvote Button */}
            <div
              className="group/btn relative inline-flex"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={cn(
                  isUpvoted ? upvoteButtonActive : upvoteButtonInactive
                )}
              >
                <ArrowBigUp
                  className={cn(
                    "size-4",
                    isUpvoted
                      ? "fill-amber-500 text-amber-500"
                      : "text-slate-400"
                  )}
                  fill={isUpvoted ? "currentColor" : "none"}
                />
                {upvoteCount?.toLocaleString() ?? "0"}
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
