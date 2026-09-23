import { Sparkles } from "lucide-react"
import { LAUNCH_PROMO } from "@/constants/promo"
import { launchPromoBadge, addedByLaunchNestsBadge } from "@/utils/styles"
import { Badge } from "@/components/ui/badge"

interface LaunchBadgeProps {
  submitterId?: string | null
  isSeeded?: boolean
}

export const LaunchBadge = ({ submitterId, isSeeded }: LaunchBadgeProps) => {
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

  if (!LAUNCH_PROMO.IS_ACTIVE) return null

  return (
    <Badge
      variant="outline"
      className={launchPromoBadge}
      title={`${LAUNCH_PROMO.BADGE_LABEL} — ${LAUNCH_PROMO.BADGE_TAGLINE}`}
    >
      <Sparkles className="size-3 text-amber-600" />
      <span>{LAUNCH_PROMO.BADGE_LABEL}</span>
    </Badge>
  )
}
