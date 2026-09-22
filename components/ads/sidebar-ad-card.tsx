"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { ProductLogo } from "@/components/shared/product-logo"
import { VerifiedBadge } from "@/components/shared/verified-badge"
import { useActiveAds } from "@/hooks/ads/use-active-ads"
import { recordAdImpression, type ActiveAdDto } from "@/lib/api/ads"
import {
  sponsorCard,
  activeSponsorCardBg,
  tierShimmerGradient,
} from "@/utils/styles"
import { CreateAdDialog } from "@/components/ads/create-ad-dialog"
import { AD_PLACEMENT } from "@/constants/ads"
import { TIER, type Tier } from "@/constants/plans"
import { getFaviconUrl } from "@/utils/urls"
import { cn } from "@/lib/utils"

const ActiveAdItem = ({ ad }: { ad: ActiveAdDto }) => {
  const tier: Tier = (ad.tier ?? TIER.FREE) as Tier
  const logoUrl = ad.logoUrl?.trim() || getFaviconUrl(ad.websiteUrl)

  return (
    <div className={activeSponsorCardBg(tier)}>
      <CornerBrackets />

      {tier !== TIER.FREE && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]",
              tierShimmerGradient(tier)
            )}
          />
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            "absolute -top-10 -right-10 size-24 rounded-full blur-xl",
            tier === TIER.PREMIUM_PLUS
              ? "bg-amber-200/25"
              : tier === TIER.PREMIUM
                ? "bg-blue-200/25"
                : "bg-indigo-200/25"
          )}
        />
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <span
          className={cn(
            "font-mono text-[10px] font-bold tracking-wider uppercase",
            tier === TIER.PREMIUM_PLUS
              ? "text-amber-700"
              : tier === TIER.PREMIUM
                ? "text-blue-700"
                : "text-indigo-700"
          )}
        >
          PROMOTED
        </span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold",
            tier === TIER.PREMIUM_PLUS
              ? "bg-amber-100/80 text-amber-800"
              : tier === TIER.PREMIUM
                ? "bg-blue-100/80 text-blue-800"
                : "bg-indigo-100/80 text-indigo-800"
          )}
        >
          Sponsored
        </span>
      </div>

      <div className="relative z-10 mt-2.5 flex items-start gap-2.5">
        <ProductLogo
          text={ad.name.slice(0, 2).toUpperCase()}
          imageUrl={logoUrl}
          websiteUrl={ad.websiteUrl}
          alt={ad.name}
          className="size-8 shrink-0 rounded-md border border-slate-200 text-[10px]"
          imageClassName="p-0.5"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="truncate text-xs font-bold text-slate-900">
              {ad.name}
            </h4>
            <VerifiedBadge tier={tier} />
          </div>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
            {ad.tagline}
          </p>
        </div>
      </div>

      <Button
        className={cn(
          "relative z-10 mt-3.5 h-8 w-full justify-between rounded-lg bg-white px-3 text-xs font-semibold shadow-2xs cursor-pointer transition-colors",
          tier === TIER.PREMIUM_PLUS
            ? "border border-amber-200 text-amber-700 hover:bg-amber-50"
            : tier === TIER.PREMIUM
              ? "border border-blue-200 text-blue-700 hover:bg-blue-50"
              : "border border-indigo-200 text-indigo-700 hover:bg-indigo-50"
        )}
        nativeButton={false}
        render={
          <a
            href={`/api/ads/${ad.id}/click`}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
      >
        <span>{ad.ctaText || "Learn More"}</span>
        <ArrowUpRight className="size-3.5" />
      </Button>
    </div>
  )
}

export const SidebarAdCard = () => {
  const { data: ads = [], isLoading } = useActiveAds(AD_PLACEMENT.SIDEBAR)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isAdLimitReached = ads.length >= 3

  useEffect(() => {
    ads.forEach((ad) => {
      if (ad?.id) {
        recordAdImpression(ad.id)
      }
    })
  }, [ads])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="h-36 w-full animate-pulse rounded-none border border-dashed border-slate-200 bg-slate-50/50" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {!isAdLimitReached && (
          <div className={sponsorCard}>
            <CornerBrackets />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute -top-10 -right-10 size-24 rounded-full bg-indigo-200/25 blur-xl" />
            </div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
                PROMOTED
              </span>
              <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-800">
                Sponsor Slot
              </span>
            </div>

            <div className="relative z-10">
              <h4 className="mt-2 text-xs font-bold text-slate-900">
                Reach Active Builders
              </h4>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
                Feature your developer tool, API, or infrastructure directly in our
                ecosystem.
              </p>
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              variant="outline"
              className="relative z-10 mt-3.5 h-8 w-full justify-between rounded-lg border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-50 cursor-pointer"
            >
              <span>Reserve Placement</span>
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        )}

        {ads.map((ad) => (
          <ActiveAdItem key={ad.id} ad={ad} />
        ))}
      </div>

      <CreateAdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultPlacement={AD_PLACEMENT.SIDEBAR}
      />
    </>
  )
}
