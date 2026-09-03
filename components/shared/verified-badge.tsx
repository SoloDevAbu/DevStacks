import { BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { TIER, type Tier } from "@/constants/tiers"

export const VerifiedBadge = ({ tier }: { tier: Tier }) => {
  if (tier === TIER.FREE) return null
  return (
    <BadgeCheck
      className={cn(
        "size-4 shrink-0 text-white",
        tier === TIER.PREMIUM_PLUS ? "fill-amber-500" : "fill-blue-500"
      )}
    />
  )
}
