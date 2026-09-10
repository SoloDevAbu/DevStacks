"use client"

import { ArrowBigUp, Layers } from "lucide-react"
import { CategoryCommandFilter } from "@/components/shared/category-command-filter"
import { PricingDropdown } from "@/components/shared/pricing-dropdown"
import { cn } from "@/lib/utils"

export type SortOption = "upvotes" | "builds"

interface ToolsFilterBarProps {
  selectedCategory?: string
  onSelectCategory: (category: string | null) => void
  selectedPricing: string
  onSelectPricing: (pricing: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export const ToolsFilterBar = ({
  selectedCategory,
  onSelectCategory,
  selectedPricing,
  onSelectPricing,
  sortBy,
  onSortChange,
}: ToolsFilterBarProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border bg-white px-6 py-2.5 md:px-8">
      {/* Left: Category Picker & Pricing Dropdown in one single section */}
      <div className="flex flex-wrap items-center gap-2.5">
        <CategoryCommandFilter
          selectedCategory={selectedCategory ?? null}
          onSelectCategory={onSelectCategory}
          type="tools"
        />

        <PricingDropdown
          selectedPricing={selectedPricing}
          onSelectPricing={onSelectPricing}
        />
      </div>

      {/* Right: Sort Controls */}
      <div className="flex items-center rounded-md border border-slate-200 bg-white p-0.5 shadow-2xs">
        <button
          type="button"
          onClick={() => onSortChange("upvotes")}
          className={cn(
            "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors",
            sortBy === "upvotes"
              ? "bg-amber-50 text-amber-700 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          )}
          title="Sort by community upvotes"
        >
          <ArrowBigUp className="size-3.5" />
          <span>Upvoted</span>
        </button>

        <button
          type="button"
          onClick={() => onSortChange("builds")}
          className={cn(
            "flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold transition-colors",
            sortBy === "builds"
              ? "bg-blue-50 text-blue-700 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          )}
          title="Sort by connected builds count"
        >
          <Layers className="size-3.5" />
          <span>Most Builds</span>
        </button>
      </div>
    </div>
  )
}
