"use client"

import { Bell, Sparkles, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getCurrentWeek, getWeekRange } from "@/lib/launches/week-utils"
import { LAUNCH_PROMO } from "@/constants/promo"
import {
  scheduleModalContainer,
  scheduleIconBox,
  scheduleEntitySummaryBox,
  schedulePromoBox,
} from "@/utils/styles"

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

interface ScheduleConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isSubmitting: boolean
  type: "product" | "tool"
  name: string
  launchYear?: number
  launchWeek?: number
}

export const ScheduleConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  type,
  name,
  launchYear,
  launchWeek,
}: ScheduleConfirmDialogProps) => {
  const current = getCurrentWeek()
  const year = launchYear ?? current.year
  const week = launchWeek ?? current.week
  const { start, end } = getWeekRange(year, week)

  const startFormatted = `${SHORT_MONTHS[start.getUTCMonth()]} ${start.getUTCDate()}`
  const endFormatted = `${SHORT_MONTHS[end.getUTCMonth()]} ${end.getUTCDate()}`
  const weekString = `Week ${week} — ${startFormatted} – ${endFormatted}, ${year}`

  const isProduct = type === "product"
  const itemTypeLabel = isProduct ? "product" : "tool"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSubmitting && onClose()}>
      <DialogContent className={scheduleModalContainer}>
        <DialogHeader className="p-0 text-left">
          <div className="flex items-start gap-3.5 pr-8">
            <div className={scheduleIconBox}>
              <Bell className="size-5" />
            </div>
            <div className="flex flex-col gap-1">
              <DialogTitle className="text-xl font-bold text-slate-900">
                Schedule this {itemTypeLabel}?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Double-check your listing and launch week before you continue.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-3.5">
          {/* Item & Week Summary Card */}
          <div className={scheduleEntitySummaryBox}>
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-bold text-slate-900">
                {name || `Untitled ${itemTypeLabel}`}
              </span>
              <span className="text-xs text-slate-500">
                Launch week: <strong className="font-semibold text-slate-700">{weekString}</strong>
              </span>
            </div>
          </div>

          {/* Launch Celebration Promo Card */}
          <div className={schedulePromoBox}>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
              <Sparkles className="size-3.5" />
              <span>Launch Celebration: Free Lifetime Premium</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Your listing qualifies for our First 50 Launch celebration! Get a{" "}
              <strong className="text-slate-900">
                Free Lifetime Premium Tier ({LAUNCH_PROMO.VALUE_GIFTED} value)
              </strong>{" "}
              with a permanent Do-Follow SEO backlink and verified checkmark.
            </p>
            <div className="mt-1 flex flex-col gap-1.5 border-t border-slate-100 pt-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600 shrink-0" />
                <span>Permanent Do-Follow SEO Backlink on live launch</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600 shrink-0" />
                <span>Verified Checkmark Badge across search &amp; directory feeds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600 shrink-0" />
                <span>Priority inclusion in upcoming Weekly AI digest</span>
              </div>
            </div>
          </div>

          {/* Dialog Action Buttons */}
          <div className="mt-2 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="gap-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Schedule {itemTypeLabel}</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
