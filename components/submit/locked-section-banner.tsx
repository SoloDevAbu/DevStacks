"use client"

import { Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import { lockedSectionBanner } from "@/utils/styles"

interface LockedSectionBannerProps {
  title: string
  description: string
  tierRequired?: Tier
  onUnlock: () => void
  isUnlocking?: boolean
}

export const LockedSectionBanner = ({
  title,
  description,
  tierRequired = TIER.PREMIUM,
  onUnlock,
  isUnlocking = false,
}: LockedSectionBannerProps) => {
  const plan = PLANS[tierRequired]

  return (
    <div className={lockedSectionBanner}>
      <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
        <Lock className="size-5" />
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-sm font-bold text-slate-900">{title}</span>
          <Badge variant="outline" className="border-amber-300 bg-amber-50 text-[10px] text-amber-800">
            {plan.name} Tier
          </Badge>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{description}</p>
      </div>
      <Button
        type="button"
        size="sm"
        onClick={onUnlock}
        disabled={isUnlocking}
        className="mt-1 h-8 gap-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs cursor-pointer"
      >
        <Sparkles className="size-3.5" />
        <span>Unlock with {plan.name} ({plan.price})</span>
      </Button>
    </div>
  )
}

