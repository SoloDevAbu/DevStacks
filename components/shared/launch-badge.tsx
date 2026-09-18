import { Sparkles } from "lucide-react"
import { LAUNCH_PROMO } from "@/constants/promo"
import { launchPromoBadge } from "@/utils/styles"
import { Badge } from "@/components/ui/badge"

export const LaunchBadge = () => {
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
