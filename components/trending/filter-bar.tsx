import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function HoverOutline() {
  return (
    <div className="pointer-events-none absolute -inset-[6px] z-0 opacity-0 transition-opacity group-hover/btn:opacity-100">
      <div className="absolute top-0 left-0 h-2 w-2 border-t-2 border-l-2 border-slate-500" />
      <div className="absolute top-0 right-0 h-2 w-2 border-t-2 border-r-2 border-slate-500" />
      <div className="absolute bottom-0 left-0 h-2 w-2 border-b-2 border-l-2 border-slate-500" />
      <div className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2 border-slate-500" />
    </div>
  )
}

function FilterTab({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <div className="group/btn relative inline-flex">
      <Button
        variant="ghost"
        className={cn(
          "relative z-10 h-auto rounded-md px-4 py-1.5 text-sm transition-colors hover:bg-transparent",
          active
            ? "bg-indigo-50 font-semibold text-indigo-600 hover:text-indigo-700"
            : "font-medium text-slate-600 hover:text-slate-900"
        )}
      >
        {children}
      </Button>
      <HoverOutline />
    </div>
  )
}

export function FilterBar() {
  return (
    <div className="flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
      {/* Time Filters */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <FilterTab active>Today</FilterTab>
        <FilterTab>This Week</FilterTab>
        <FilterTab>This Month</FilterTab>
        <FilterTab>All Time</FilterTab>
      </div>

      {/* Category Filter */}
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
