"use client"

import Link from "next/link"
import { ChevronUp } from "lucide-react"
import { useWeeklyPremiumLaunches } from "@/hooks/launches/use-weekly-premium-launches"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ROUTES } from "@/constants/routes"
import { TIER, type Tier } from "@/constants/plans"
import { getFaviconUrl } from "@/utils/urls"
import { cn } from "@/lib/utils"
import {
  sidebarHeading,
  sidebarLaunchRow,
  sidebarLaunchRowBorder,
  sidebarLaunchVotes,
  tierCardBg,
  tierShimmerGradient,
} from "@/utils/styles"

export const SidebarFeaturedLaunches = () => {
  const { data: launches = [], isLoading } = useWeeklyPremiumLaunches()

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className={sidebarHeading}>Featured This Week</h3>
        <span className="font-mono text-[10px] font-medium text-slate-400">
          PRO
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-2"
            >
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="h-3.5 flex-1 rounded-sm" />
              <Skeleton className="h-5 w-9 rounded-md" />
            </div>
          ))}
        </div>
      ) : launches.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200/80 p-3.5 text-center">
          <p className="text-xs font-medium text-slate-400">
            No featured launches this week yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {launches.map((item) => {
            const isTool = item.itemKind === "tool"
            const votesCount =
              "upvotesCount" in item ? item.upvotesCount : item.likesCount
            const detailHref = isTool
              ? ROUTES.TOOL(item.slug)
              : ROUTES.PRODUCT(item.slug)
            const tier: Tier = (item.tier ?? TIER.FREE) as Tier
            const logoUrl =
              item.logoUrl?.trim() || getFaviconUrl(item.websiteUrl)

            return (
              <Link
                key={item.id}
                href={detailHref}
                className={cn(
                  sidebarLaunchRow,
                  tierCardBg(tier),
                  sidebarLaunchRowBorder(tier)
                )}
              >
                {tier !== TIER.FREE && (
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-lg">
                    <div
                      className={cn(
                        "absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]",
                        tierShimmerGradient(tier)
                      )}
                    />
                  </div>
                )}

                <div className="relative z-10 flex min-w-0 items-center gap-2.5">
                  <ProductLogo
                    text={item.name.slice(0, 2).toUpperCase()}
                    imageUrl={logoUrl}
                    websiteUrl={item.websiteUrl}
                    alt={item.name}
                    className="size-7 shrink-0 rounded-md border border-slate-200/80 text-[10px]"
                    imageClassName="p-0.5"
                  />
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="truncate text-xs font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
                      {item.name}
                    </span>
                    <VerifiedBadge tier={tier} />
                  </div>
                </div>

                <div className={cn("relative z-10", sidebarLaunchVotes)}>
                  <ChevronUp className="size-3 text-slate-400 transition-colors group-hover:text-amber-500" />
                  <span>{votesCount}</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
