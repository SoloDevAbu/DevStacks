import { Sparkles } from "lucide-react"
import { LAUNCH_PROMO } from "@/constants/promo"
import { TIER } from "@/constants/plans"
import { launchPromoBadge, addedByLaunchNestsBadge } from "@/utils/styles"
import { Badge } from "@/components/ui/badge"

interface LaunchBadgeProps {
  submitterId?: string | null
  tier?: string | null
  createdAt?: Date | string | null
  isSeeded?: boolean
}

const isPromoGifted = (tier?: string | null, createdAt?: Date | string | null) =>
  tier === TIER.PREMIUM &&
  !!createdAt &&
  new Date(createdAt) < LAUNCH_PROMO.ENDED_AT

export const LaunchBadge = ({
  submitterId,
  tier,
  createdAt,
  isSeeded,
}: LaunchBadgeProps) => {
  const isAddedByPlatform = isSeeded || !submitterId

  if (isAddedByPlatform) {
    return (
      <Badge
        variant="outline"
        className={addedByLaunchNestsBadge}
        title="Curated and added to the directory by LaunchNests"
      >
        <Sparkles className="size-3 text-slate-500" />
        <span>Added by LaunchNests</span>
      </Badge>
    )
  }

  if (!isPromoGifted(tier, createdAt)) return null

  return (
    <Badge
      variant="outline"
      className={launchPromoBadge}
      title={`${LAUNCH_PROMO.BADGE_LABEL} — one of the first launches on LaunchNests`}
    >
      <Sparkles className="size-3 text-amber-600" />
      <span>{LAUNCH_PROMO.BADGE_LABEL}</span>
    </Badge>
  )
}
