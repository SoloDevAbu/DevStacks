import { ChevronDown } from "lucide-react"
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
    <div className="flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
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

      <div className="group/btn relative inline-flex">
        <Button
          variant="outline"
          className="relative z-10 h-auto gap-2 rounded-lg border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
        >
          All categories
          <ChevronDown className="size-4 text-slate-400" />
        </Button>
        <HoverOutline />
      </div>
    </div>
  )
}
