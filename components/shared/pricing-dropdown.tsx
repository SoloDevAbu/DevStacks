"use client"

import { CreditCard, ChevronDown, X, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { HoverOutline } from "@/components/shared/hover-outline"
import { PRICING_OPTIONS } from "@/constants/plans"
import { cn } from "@/lib/utils"

export interface PricingDropdownProps {
  selectedPricing: string
  onSelectPricing: (pricing: string) => void
  className?: string
}

export const PricingDropdown = ({
  selectedPricing,
  onSelectPricing,
  className,
}: PricingDropdownProps) => {
  const activePricingOption =
    PRICING_OPTIONS.find(
      (opt) => opt.id.toLowerCase() === selectedPricing.toLowerCase()
    ) ?? PRICING_OPTIONS[0]

  return (
    <DropdownMenu>
      <div className="group/btn relative inline-flex">
        <DropdownMenuTrigger
          className={cn(
            "relative z-10 flex h-auto cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
            selectedPricing !== "all" &&
              "border-slate-900 bg-slate-900 font-semibold text-white hover:bg-slate-800",
            className
          )}
        >
          <CreditCard
            className={cn(
              "size-3.5",
              selectedPricing !== "all" ? "text-slate-300" : "text-slate-500"
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
  )
}
