"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ShieldCheck, ArrowRight, Loader2 } from "lucide-react"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import { upgradeTierCard, upgradeBadge } from "@/utils/dashboard/styles"
import { apiClient } from "@/lib/api/axios-instance"

interface UpgradeTierDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: {
    id: string
    name: string
    slug: string
    tier: "free" | "premium" | "premium+"
    itemType: "product" | "tool"
  }
}

export const UpgradeTierDialog = ({
  isOpen,
  onOpenChange,
  item,
}: UpgradeTierDialogProps) => {
  // Determine available upgrade tiers based on current tier:
  // free -> [premium, premium+]
  // premium -> [premium+]
  // premium+ -> []
  const availableTiers: Tier[] =
    item.tier === TIER.FREE
      ? [TIER.PREMIUM, TIER.PREMIUM_PLUS]
      : item.tier === TIER.PREMIUM
        ? [TIER.PREMIUM_PLUS]
        : []

  const [selectedTier, setSelectedTier] = useState<Tier>(
    availableTiers[0] ?? TIER.PREMIUM
  )
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleUpgrade = async () => {
    try {
      setIsLoading(true)
      setErrorMessage(null)

      const response = await apiClient.post("/checkout", {
        paymentType: "listing",
        itemType: item.itemType,
        itemId: item.id,
        tier: selectedTier,
      })

      if (response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl
      } else {
        throw new Error("Unable to create checkout session. Please try again.")
      }
    } catch (err: unknown) {
      const errorMsg =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ||
        (err instanceof Error ? err.message : "Failed to initiate upgrade.")
      setErrorMessage(errorMsg)
      setIsLoading(false)
    }
  }

  if (availableTiers.length === 0) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#a06138] uppercase">
              Listing Tier Upgrade
            </span>
            <Badge variant="outline" className={upgradeBadge(item.tier)}>
              Current: {item.tier}
            </Badge>
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Upgrade {item.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Unlock high-authority SEO backlinks, verified badge trust, priority
            placement, and dominant directory exposure. Upgrades are irreversible.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Tier selection cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
          {availableTiers.map((tier) => {
            const plan = PLANS[tier]
            const isSelected = selectedTier === tier

            return (
              <div
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={upgradeTierCard(isSelected, false)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {plan.name}
                    </span>
                    {tier === TIER.PREMIUM_PLUS ? (
                      <Sparkles className="size-4 text-amber-500" />
                    ) : (
                      <ShieldCheck className="size-4 text-blue-600" />
                    )}
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-slate-900">
                      {plan.price}
                    </span>
                    <span className="font-mono text-[11px] text-slate-500">
                      {plan.period}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {plan.tagline}
                  </p>

                  <div className="mt-2 space-y-1.5 border-t border-dashed border-slate-200/80 pt-2.5">
                    {plan.features.slice(0, 4).map((feat) => (
                      <div
                        key={feat}
                        className="flex items-start gap-1.5 text-[11px] text-slate-700"
                      >
                        <Check className="mt-0.5 size-3 shrink-0 text-emerald-600" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3.5 pt-2 border-t border-dashed border-slate-200">
                  <span
                    className={`font-mono text-[11px] font-bold ${
                      isSelected ? "text-indigo-600" : "text-slate-400"
                    }`}
                  >
                    {isSelected ? "● Selected Option" : "○ Click to select"}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleUpgrade}
            disabled={isLoading}
            className="gap-2 bg-slate-900 text-xs font-semibold text-white hover:bg-slate-800"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Redirecting to Checkout...</span>
              </>
            ) : (
              <>
                <span>Upgrade to {PLANS[selectedTier].name}</span>
                <ArrowRight className="size-3.5" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
