"use client"

import { Bell, Info } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { LaunchWeekPicker } from "@/components/shared/launch-week-picker"
import { PLANS, TIER, isPaidTier, type Tier } from "@/constants/plans"
import { scheduleModalContainer, scheduleIconBox } from "@/utils/styles"
import { TierOptions } from "./tier-options"

export type LaunchChoice = "free" | "pay" | "credit"

interface ScheduleLaunchDialogProps {
  isOpen: boolean
  onClose: () => void
  type: "product" | "tool"
  name: string
  launchYear?: number
  launchWeek?: number
  onSelectWeek: (year: number, week: number) => void
  tier: Tier
  onSelectTier: (tier: Tier) => void
  creditTier?: Tier
  hasPremiumOnlyFields: boolean
  pendingChoice: LaunchChoice | null
  onLaunch: (choice: LaunchChoice) => void
}

export const ScheduleLaunchDialog = ({
  isOpen,
  onClose,
  type,
  name,
  launchYear,
  launchWeek,
  onSelectWeek,
  tier,
  onSelectTier,
  creditTier,
  hasPremiumOnlyFields,
  pendingChoice,
  onLaunch,
}: ScheduleLaunchDialogProps) => {
  const isBusy = pendingChoice !== null
  const isPaid = isPaidTier(tier)
  const primaryChoice: LaunchChoice = creditTier
    ? "credit"
    : isPaid
      ? "pay"
      : "free"
  const primaryLabel =
    primaryChoice === "credit"
      ? `Launch with your ${PLANS[creditTier ?? tier].name} credit`
      : primaryChoice === "pay"
        ? `Pay ${PLANS[tier].price} & launch`
        : "Launch for free"

  // A paid-in-flow listing is saved as Free first, so it needs a week with an open free slot.
  const weekPickerTier = creditTier ?? TIER.FREE

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isBusy && onClose()}
    >
      <DialogContent className={scheduleModalContainer}>
        <DialogHeader className="p-0 text-left">
          <div className="flex items-start gap-3.5 pr-8">
            <div className={scheduleIconBox}>
              <Bell className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Schedule {name || `your ${type}`}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Pick your launch week and how you want to launch. Free is always
                an option.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-slate-700">
              Launch week
            </Label>
            <LaunchWeekPicker
              selectedYear={launchYear}
              selectedWeek={launchWeek}
              onSelectWeek={onSelectWeek}
              currentTier={weekPickerTier}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-700">
              Launch tier
            </span>
            <TierOptions
              value={tier}
              onChange={onSelectTier}
              creditTier={creditTier}
              variant="dialog"
              idPrefix="dialog"
            />
          </div>

          {!isPaid && !creditTier && hasPremiumOnlyFields && (
            <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-600">
              <Info className="mt-0.5 size-3.5 shrink-0 text-slate-400" />
              FAQs, extra screenshots and SEO fields are kept only with Premium.
              A free launch saves the rest of your listing.
            </p>
          )}
        </div>

        <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          {primaryChoice !== "free" && (
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => onLaunch("free")}
              className="gap-2 text-xs font-medium"
            >
              {pendingChoice === "free" && <Spinner className="size-3.5" />}
              Launch for free
            </Button>
          )}
          <Button
            type="button"
            disabled={isBusy}
            onClick={() => onLaunch(primaryChoice)}
            className="gap-2 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {pendingChoice === primaryChoice && (
              <Spinner className="size-3.5" />
            )}
            {primaryLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
