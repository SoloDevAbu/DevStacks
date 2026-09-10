"use client"

import { useRouter } from "next/navigation"
import {
  ArrowBigUp,
  Layers,
  ChevronDown,
  X,
  CreditCard,
  Check,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { HoverOutline } from "@/components/shared/hover-outline"
import { CategoryCommandFilter } from "@/components/shared/category-command-filter"
import { ROUTES } from "@/constants/routes"
import { PRICING, type Pricing } from "@/constants/plans"
import { cn } from "@/lib/utils"

export type SortOption = "upvotes" | "builds"

interface ToolsFilterBarProps {
  selectedCategory?: string
  selectedPricing: string
  onSelectPricing: (pricing: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

interface PricingOption {
  id: string
  label: string
  pricingKey?: Pricing
  dotColor?: string
}

const PRICING_OPTIONS: PricingOption[] = [
  { id: "all", label: "All Pricing" },
  {
    id: PRICING.OPEN_SOURCE,
    label: "Open Source",
    pricingKey: PRICING.OPEN_SOURCE,
    dotColor: "bg-blue-500",
  },
  {
    id: PRICING.FREEMIUM,
    label: "Freemium",
    pricingKey: PRICING.FREEMIUM,
    dotColor: "bg-emerald-500",
  },
  {
    id: PRICING.PAID,
    label: "Paid",
    pricingKey: PRICING.PAID,
    dotColor: "bg-indigo-500",
  },
  {
    id: PRICING.FREE,
    label: "Free",
    pricingKey: PRICING.FREE,
    dotColor: "bg-teal-500",
  },
]

export const ToolsFilterBar = ({
  selectedCategory,
  selectedPricing,
  onSelectPricing,
  sortBy,
  onSortChange,
}: ToolsFilterBarProps) => {
  const router = useRouter()

  const handleCategoryChange = (catName: string | null) => {
    if (!catName || catName.toLowerCase() === "all") {
      router.push(ROUTES.TOOLS)
    } else {
      router.push(`${ROUTES.TOOLS}?category=${encodeURIComponent(catName)}`)
    }
  }

  const activePricingOption =
    PRICING_OPTIONS.find(
      (opt) => opt.id.toLowerCase() === selectedPricing.toLowerCase()
    ) ?? PRICING_OPTIONS[0]

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border bg-white px-6 py-2.5 md:px-8">
      {/* Left: Category Picker & Pricing Dropdown in one single section */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Reusable Category Command Filter */}
        <CategoryCommandFilter
          selectedCategory={selectedCategory ?? null}
          onSelectCategory={handleCategoryChange}
        />

        {/* Pricing Dropdown */}
        <DropdownMenu>
          <div className="group/btn relative inline-flex">
            <DropdownMenuTrigger
              className={cn(
                "relative z-10 flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selectedPricing !== "all" &&
                  "border-slate-900 bg-slate-900 font-semibold text-white hover:bg-slate-800"
              )}
            >
              <CreditCard
                className={cn(
                  "size-3.5",
                  selectedPricing !== "all"
                    ? "text-slate-300"
                    : "text-slate-500"
                )}
              />
              <span className="flex items-center gap-1.5">
                {activePricingOption.dotColor && (
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      activePricingOption.dotColor,
                      selectedPricing !== "all" && "ring-1 ring-white/50"
                    )}
                  />
                )}
                {activePricingOption.label}
              </span>

              {selectedPricing !== "all" ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectPricing("all")
                  }}
                  className="ml-0.5 rounded-full p-0.5 text-slate-300 hover:bg-white/20 hover:text-white"
                  title="Clear pricing filter"
                >
                  <X className="size-3" />
                </span>
              ) : (
                <ChevronDown className="size-3 text-slate-400" />
              )}
            </DropdownMenuTrigger>
            <HoverOutline />
          </div>

          <DropdownMenuContent align="start" className="w-44 p-1">
            {PRICING_OPTIONS.map((option) => {
              const isSelected =
                selectedPricing.toLowerCase() === option.id.toLowerCase()
              return (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => onSelectPricing(option.id)}
                  className={cn(
                    "flex cursor-pointer items-center justify-between px-2.5 py-1.5 text-xs font-medium",
                    isSelected && "bg-slate-100 font-semibold text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2">
                    {option.dotColor ? (
                      <span
                        className={cn("size-2 rounded-full", option.dotColor)}
                      />
                    ) : (
                      <span className="size-2" />
                    )}
                    <span>{option.label}</span>
                  </div>
                  {isSelected && <Check className="size-3.5 text-slate-900" />}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
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
