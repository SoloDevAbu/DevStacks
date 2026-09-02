import { ChevronDown } from "lucide-react"

export function FilterBar() {
  return (
    <div className="flex flex-col gap-4 border-b border-dashed border-border bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
      {/* Time Filters */}
      <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
        <button className="rounded-md bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600">
          Today
        </button>
        <button className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
          This Week
        </button>
        <button className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
          This Month
        </button>
        <button className="rounded-md px-4 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900">
          All Time
        </button>
      </div>

      {/* Category Filter */}
      <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50">
        All categories
        <ChevronDown className="size-4 text-slate-400" />
      </button>
    </div>
  )
}
