import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HoverOutline } from "@/components/shared/hover-outline"
import { filterPillActive, filterPillInactive } from "@/utils/styles"
import type { TimeframeOption } from "@/lib/rankings/types"

const TIMEFRAME_TABS: { label: string; value: TimeframeOption }[] = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "All Time", value: "all-time" },
]

export const FilterBar = ({
  timeframe = "today",
  onTimeframeChange,
}: {
  timeframe?: TimeframeOption
  onTimeframeChange?: (value: TimeframeOption) => void
}) => {
  return (
    <div className="flex items-center border-b border-dashed border-border bg-white px-6 py-4 md:px-8">
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        {TIMEFRAME_TABS.map((tab) => {
          const isActive = timeframe === tab.value
          return (
            <div key={tab.value} className="group/btn relative inline-flex">
              <Button
                variant="ghost"
                onClick={() => onTimeframeChange?.(tab.value)}
                className={cn(
                  "relative z-10 h-auto rounded-md px-4 py-1.5 text-sm transition-colors hover:bg-transparent",
                  isActive ? filterPillActive : filterPillInactive
                )}
              >
                {tab.label}
              </Button>
              <HoverOutline />
            </div>
          )
        })}
      </div>
    </div>
  )
}
