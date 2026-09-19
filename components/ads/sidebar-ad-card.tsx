"use client"

import { useEffect, useState } from "react"
import { ArrowUpRight, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useActiveAds } from "@/hooks/ads/use-active-ads"
import { recordAdImpression } from "@/lib/api/ads"
import { sponsorCard, activeSponsorCard } from "@/utils/styles"
import { CreateAdDialog } from "@/components/ads/create-ad-dialog"
import { AD_PLACEMENT } from "@/constants/ads"

export const SidebarAdCard = () => {
  const { data: ads = [], isLoading } = useActiveAds(AD_PLACEMENT.SIDEBAR)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Pick first active ad if available
  const activeAd = ads.length > 0 ? ads[0] : null

  // Record impression once when ad is mounted
  useEffect(() => {
    if (activeAd?.id) {
      recordAdImpression(activeAd.id)
    }
  }, [activeAd?.id])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5">
        <div className="h-36 w-full animate-pulse rounded-xl border border-dashed border-slate-200 bg-slate-50/50" />
      </div>
    )
  }

  // Active Sponsored Ad
  if (activeAd) {
    return (
      <>
        <div className="flex flex-col gap-2.5">
          <div className={activeSponsorCard}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
                {activeAd.badgeText || "PROMOTED"}
              </span>
              <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-800">
                Sponsored
              </span>
            </div>

            <div className="mt-2.5 flex items-start gap-2.5">
              {activeAd.imageUrl ? (
                <img
                  src={activeAd.imageUrl}
                  alt={activeAd.title}
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
                  {activeAd.title}
                </h4>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-600 line-clamp-2">
                  {activeAd.description}
                </p>
              </div>
            </div>

            <Button
              className="mt-3.5 h-8 w-full justify-between rounded-lg border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-50"
              nativeButton={false}
              render={
                <a
                  href={`/api/ads/${activeAd.id}/click`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <span>{activeAd.ctaText || "Learn More"}</span>
              <ArrowUpRight className="size-3.5" />
            </Button>

            <div className="mt-2.5 flex justify-end">
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="text-[10px] font-medium text-slate-400 hover:text-indigo-600 transition-colors"
              >
                Promote your tool here →
              </button>
            </div>
          </div>
        </div>

        <CreateAdDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          defaultPlacement={AD_PLACEMENT.SIDEBAR}
        />
      </>
    )
  }

  // Fallback: Default Sponsor / Reserve Placement Card
  return (
    <>
      <div className="flex flex-col gap-2.5">
        <div className={sponsorCard}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-700 uppercase">
              PROMOTED
            </span>
            <span className="rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-indigo-800">
              50k+ Devs
            </span>
          </div>

          <h4 className="mt-2 text-xs font-bold text-slate-900">
            Reach 50,000+ Builders
          </h4>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            Feature your developer tool, API, or infrastructure directly in our
            ecosystem.
          </p>

          <Button
            onClick={() => setDialogOpen(true)}
            variant="outline"
            className="mt-3.5 h-8 w-full justify-between rounded-lg border-indigo-200 bg-white px-3 text-xs font-semibold text-indigo-700 shadow-2xs hover:bg-indigo-50 cursor-pointer"
          >
            <span>Reserve Placement</span>
            <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <CreateAdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultPlacement={AD_PLACEMENT.SIDEBAR}
      />
    </>
  )
}
