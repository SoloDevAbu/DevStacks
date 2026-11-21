"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Tier } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"
import { submitSectionHeaderTier } from "@/utils/styles"
import { TierOptions } from "./tier-options"

interface TierSelectorProps {
  selectedTier: Tier
  onSelectTier: (tier: Tier) => void
  creditTier?: Tier
}

export const TierSelector = ({
  selectedTier,
  onSelectTier,
  creditTier,
}: TierSelectorProps) => (
  <section aria-labelledby="launch-tier-heading" className="flex flex-col">
    <div className={submitSectionHeaderTier}>
      <div className="flex flex-col gap-1">
        <h2
          id="launch-tier-heading"
          className="text-base font-bold text-slate-900"
        >
          Launch Tier
        </h2>
        <p className="text-xs text-slate-500">
          Launching is free. Upgrade for a permanent Do-Follow backlink,
          verified badge and priority placement. You can change this before you
          schedule.
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={
          <Link
            href={ROUTES.PRICING}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        className="h-8 gap-1.5 self-start text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:self-auto"
      >
        <ArrowUpRight className="size-3.5 text-slate-500" />
        <span>Compare plans</span>
      </Button>
    </div>

    <TierOptions
      value={selectedTier}
      onChange={onSelectTier}
      creditTier={creditTier}
      idPrefix="form"
    />
  </section>
)
