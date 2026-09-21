"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { useActiveAds } from "@/hooks/ads/use-active-ads"
import { recordAdImpression, type ActiveAdDto } from "@/lib/api/ads"
import { sponsorCard, activeSponsorCard } from "@/utils/styles"
import { CreateAdDialog } from "@/components/ads/create-ad-dialog"
import { AD_PLACEMENT } from "@/constants/ads"

const ActiveAdItem = ({ ad }: { ad: ActiveAdDto }) => (
  <div className={activeSponsorCard}>
    <CornerBrackets />

    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-10 -right-10 size-24 rounded-full bg-indigo-200/25 blur-xl" />
    </div>

    <div className="relative z-10 flex items-center justify-between">
      <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
        PROMOTED
      </span>
      <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-800">
        Sponsored
      </span>
    </div>

    <div className="relative z-10 mt-2.5 flex items-start gap-2.5">
      {ad.logoUrl ? (
        <img
          src={ad.logoUrl}
          alt={ad.name}
          className="size-8 shrink-0 rounded-md border border-slate-200 object-contain bg-white p-0.5 shadow-2xs"
          onError={(e) => {
            ;(e.target as HTMLElement).style.display = "none"
          }}
        />
      ) : (
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-indigo-200 bg-indigo-50 text-indigo-600">
          <Globe className="size-4" />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
          {ad.name}
        </h4>
        <p className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
          {ad.tagline}
        </p>
      </div>
    </div>

    <Button
      className="relative z-10 mt-3.5 h-8 w-full justify-between rounded-lg border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-50 cursor-pointer"
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
