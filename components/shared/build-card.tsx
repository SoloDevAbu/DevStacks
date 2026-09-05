"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Heart, Bookmark, ExternalLink } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { TIER, type Tier, type Pricing } from "@/constants/tiers"
import { ROUTES } from "@/constants/routes"
import {
  tierCardBg,
  tierContentBg,
  tierShimmerGradient,
  pricingBadgeColor,
  bookmarkButtonActive,
  bookmarkButtonInactive,
} from "@/utils/styles"
import { useLikeBuild } from "@/hooks/builds/use-like-build"
import { useAuthModal } from "@/hooks/auth/use-auth-modal"
import { useSession } from "@/lib/auth/client"

export type DbBuildItem = {
  id: string
  name: string
  description: string
  logoText: string
  logoBg: string
  tier: "free" | "premium" | "premium+"
  pricing?: "Free" | "Freemium" | "Paid" | "Open Source"
  viewsCount: number
  likesCount: number
  createdAt: Date | string
  author?: {
    id: string
    name: string
    avatarUrl?: string | null
  } | null
  builtWith?: {
    name: string
    slug?: string
  }[]
}

interface BuildCardProps {
  build: DbBuildItem
  index?: number
  showMedals?: boolean
}

export const BuildCard = ({
  build,
  index = 0,
  showMedals = false,
}: BuildCardProps) => {
  const tier: Tier = (build.tier ?? "free") as Tier
  const pricing: Pricing = (build.pricing ??
    (tier === TIER.FREE
      ? "Free"
      : tier === TIER.PREMIUM
        ? "Freemium"
        : "Paid")) as Pricing

  const { data: session } = useSession()
  const { requireAuth } = useAuthModal()
  const likeMutation = useLikeBuild()

  const [localLikes, setLocalLikes] = useState<number>(build.likesCount ?? 0)
  const [hasLiked, setHasLiked] = useState<boolean>(false)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)

  const views =
    build.viewsCount >= 1000
      ? (build.viewsCount / 1000).toFixed(1) + "K"
      : String(build.viewsCount ?? 0)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    requireAuth(
      () => {
        if (hasLiked) return
        setHasLiked(true)
        setLocalLikes((prev) => prev + 1)

        likeMutation.mutate(build.id, {
          onError: () => {
            setHasLiked(false)
            setLocalLikes((prev) => Math.max(0, prev - 1))
          },
        })
      },
      {
        title: "Sign in to like",
        description:
          "Sign in with your Google account to like and support developer builds.",
      }
    )
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation()
    requireAuth(
      () => {
        setIsBookmarked((prev) => !prev)
      },
      {
        title: "Sign in to bookmark",
        description:
          "Sign in with your Google account to bookmark builds to your library.",
      }
    )
  }

  return (
    <Card
      className={cn(
        "group relative z-0 cursor-default rounded-none p-0 transition-colors",
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

        {/* Index or Medal indicator */}
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
            <div className="w-4 text-center text-sm font-bold text-slate-400">
              {index + 1}
            </div>
          )}
        </div>

        {/* Logo */}
        <div
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-xl font-bold shadow-xs",
            build.logoBg || "bg-slate-900 text-white"
          )}
        >
          {build.logoText}
        </div>

        {/* Build Details */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
              {build.name}
            </h3>
            <VerifiedBadge tier={tier} />
            {build.author?.name && (
              <span className="hidden text-xs text-slate-400 sm:inline">
                by {build.author.name}
              </span>
            )}
          </div>

          <p className="line-clamp-1 text-sm font-medium text-slate-500">
            {build.description}
          </p>

          {/* Built With tools pills (NO build count!) */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Built with
            </span>
            {(build.builtWith ?? []).map((tool) => {
              const toolSlug =
                tool.slug || tool.name.toLowerCase().replace(/\s+/g, "-")
              return (
                <Link
                  key={tool.name}
                  href={`/products/${toolSlug}`}
                  className="rounded-none bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                >
                  {tool.name}
                </Link>
              )
            })}

            <div className="ml-2 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Eye className="size-3.5" />
              {views}
            </div>
          </div>
        </div>

        {/* Action Buttons & Pricing */}
        <div className="ml-4 flex shrink-0 flex-col items-end gap-2.5">
          {/* Pricing Badge (Free, Freemium, Paid, etc.) */}
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
            {/* Heart / Like Button (instead of upvote!) */}
            <div
              className="group/btn relative inline-flex"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                onClick={handleLike}
                className={cn(
                  "relative z-10 h-8 gap-1.5 rounded-lg border-slate-200 bg-white px-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 hover:text-rose-500",
                  hasLiked &&
                    "border-rose-300 bg-rose-50 text-rose-600 hover:bg-rose-100/80"
                )}
                title="Like this build"
              >
                <Heart
                  className={cn(
                    "size-4 transition-transform active:scale-125",
                    hasLiked
                      ? "fill-rose-500 text-rose-500"
                      : "text-slate-400 group-hover:text-rose-500"
                  )}
                  fill={hasLiked ? "currentColor" : "none"}
                />
                <span>{localLikes}</span>
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
                className={cn(
                  isBookmarked ? bookmarkButtonActive : bookmarkButtonInactive
                )}
                title="Bookmark this build"
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
