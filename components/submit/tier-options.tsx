"use client"

import { Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { PLANS, TIER_ORDER, type Tier } from "@/constants/plans"
import { cn } from "@/lib/utils"
import {
  submitTierFullWidthGrid,
  submitTierFullWidthColumn,
  submitTierDialogGrid,
  submitTierDialogCard,
  tierAccentText,
  tierCheckIcon,
} from "@/utils/styles"

interface TierOptionsProps {
  value: Tier
  onChange: (tier: Tier) => void
  creditTier?: Tier
  variant?: "section" | "dialog"
  idPrefix: string
}

export const TierOptions = ({
  value,
  onChange,
  creditTier,
  variant = "section",
  idPrefix,
}: TierOptionsProps) => {
  const isDialog = variant === "dialog"

  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => onChange(next as Tier)}
      aria-label="Launch tier"
      className={isDialog ? submitTierDialogGrid : submitTierFullWidthGrid}
    >
      {TIER_ORDER.map((tier) => {
        const plan = PLANS[tier]
        const isSelected = value === tier
        const hasCredit = creditTier === tier
        const itemId = `${idPrefix}-tier-${tier}`
        const features = isDialog ? plan.features.slice(1, 4) : plan.features

        return (
          <Label
            key={tier}
            htmlFor={itemId}
            className={cn(
              "items-stretch leading-normal",
              isDialog
                ? submitTierDialogCard(isSelected, tier)
                : submitTierFullWidthColumn(isSelected, tier)
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn("text-sm font-bold", tierAccentText[tier])}
                  >
                    {plan.name}
                  </span>
                  <Badge variant="outline" className={plan.badgeClass}>
                    {hasCredit ? "Credit ready" : plan.badgeLabel}
                  </Badge>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      "font-extrabold",
                      isDialog ? "text-lg" : "text-2xl",
                      tierAccentText[tier]
                    )}
                  >
                    {hasCredit ? "Paid" : plan.price}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    / {plan.period}
                  </span>
                </div>
              </div>
              <RadioGroupItem id={itemId} value={tier} className="mt-1" />
            </div>

            {!isDialog && (
              <p className="text-[11px] text-slate-500">{plan.tagline}</p>
            )}

            <ul className="flex flex-col gap-1.5 text-xs text-slate-600">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check
                    className={cn(
                      "mt-0.5 size-3.5 shrink-0",
                      tierCheckIcon[tier]
                    )}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </Label>
        )
      })}
    </RadioGroup>
  )
}
