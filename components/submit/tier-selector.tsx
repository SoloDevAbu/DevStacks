"use client"

import { Check, Sparkles, Crown, BadgeCheck, Lock, Unlock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import { submitTierGrid, submitTierCard } from "@/utils/styles"
import { cn } from "@/lib/utils"

interface TierSelectorProps {
  selectedTier: Tier
  onSelectTier: (tier: Tier) => void
  isPromoActive: boolean
  promoRemaining: number
  hasPaidCredit: boolean
  paidCreditTier?: Tier
  onUnlockClick: (tier: Tier) => void
  isUnlocking?: boolean
}

export const TierSelector = ({
  selectedTier,
  onSelectTier,
  isPromoActive,
  promoRemaining,
  hasPaidCredit,
  paidCreditTier,
  onUnlockClick,
  isUnlocking = false,
}: TierSelectorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Choose Launch Tier</h3>
          <p className="text-xs text-slate-500">
            {isPromoActive
              ? `Celebration Special: First 50 launches receive free Lifetime Premium (${promoRemaining} spots remaining).`
              : "Select a tier for this launch. Unlock do-follow SEO backlinks, AI blog reviews, and answer engine discovery."}
          </p>
        </div>
      </div>

      <div className={submitTierGrid}>
        {/* FREE COMMUNITY */}
        <div
          onClick={() => onSelectTier(TIER.FREE)}
          className={submitTierCard(selectedTier === TIER.FREE)}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">
                {PLANS[TIER.FREE].name}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {PLANS[TIER.FREE].badgeLabel}
              </Badge>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {PLANS[TIER.FREE].price}
              </span>
              <span className="text-[11px] text-slate-500">/ forever</span>
            </div>
            <ul className="mt-1 flex flex-col gap-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600" />
                <span>Permanent directory listing</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-600" />
                <span>Community upvotes & comments</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Lock className="size-3 text-slate-400" />
                <span>1 screenshot maximum</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400">
                <Lock className="size-3 text-slate-400" />
                <span>FAQs & Advanced SEO locked</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-medium text-slate-500">Standard feed</span>
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center",
                selectedTier === TIER.FREE
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300"
              )}
            >
              {selectedTier === TIER.FREE && <Check className="size-3" />}
            </div>
          </div>
        </div>

        {/* PREMIUM (FEATURED BUILDER) */}
        <div
          onClick={() => onSelectTier(TIER.PREMIUM)}
          className={cn(
            submitTierCard(selectedTier === TIER.PREMIUM),
            "border-blue-200 bg-linear-to-b from-blue-50/40 to-white"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-950">
                {PLANS[TIER.PREMIUM].name}
              </span>
              {isPromoActive ? (
                <Badge className="bg-emerald-600 text-white text-[10px]">
                  <Sparkles className="mr-1 size-2.5" /> FREE Promo
                </Badge>
              ) : hasPaidCredit && paidCreditTier === TIER.PREMIUM ? (
                <Badge className="bg-blue-600 text-white text-[10px]">
                  <Check className="mr-1 size-2.5" /> Credit Active
                </Badge>
              ) : (
                <Badge className="bg-blue-600 text-white text-[10px]">
                  Popular
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              {isPromoActive ? (
                <>
                  <span className="text-sm font-bold text-slate-400 line-through">
                    {PLANS[TIER.PREMIUM].price}
                  </span>
                  <span className="text-xl font-black text-emerald-700">FREE</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">
                    (Launch Promo)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-xl font-extrabold text-blue-950">
                    {PLANS[TIER.PREMIUM].price}
                  </span>
                  <span className="text-[11px] text-blue-700 font-medium">
                    / one-time
                  </span>
                </>
              )}
            </div>

            <ul className="mt-1 flex flex-col gap-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5 font-medium text-blue-950">
                <BadgeCheck className="size-3 text-blue-600" />
                <span>Permanent Do-Follow SEO Backlink</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-blue-600" />
                <span>Verified Checkmark Badge</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-blue-600" />
                <span>Dedicated AI launch blog review</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Unlock className="size-3 text-blue-600" />
                <span>Interactive FAQs + 3 Screenshots</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Unlock className="size-3 text-blue-600" />
                <span>Multi-LLM / AEO Knowledge indexing</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-blue-100 flex items-center justify-between">
            {!isPromoActive && !hasPaidCredit && selectedTier === TIER.PREMIUM ? (
              <Button
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onUnlockClick(TIER.PREMIUM)
                }}
                disabled={isUnlocking}
                className="h-7 px-2.5 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUnlocking ? "Opening..." : `Pay & Unlock (${PLANS[TIER.PREMIUM].price})`}
              </Button>
            ) : (
              <span className="text-[10px] font-semibold text-blue-700">
                {isPromoActive
                  ? "Included 100% Free"
                  : hasPaidCredit
                    ? "Paid Credit Ready"
                    : "Select to Unlock"}
              </span>
            )}
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center",
                selectedTier === TIER.PREMIUM
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300"
              )}
            >
              {selectedTier === TIER.PREMIUM && <Check className="size-3" />}
            </div>
          </div>
        </div>

        {/* PREMIUM+ (ECOSYSTEM PARTNER) */}
        <div
          onClick={() => onSelectTier(TIER.PREMIUM_PLUS)}
          className={cn(
            submitTierCard(selectedTier === TIER.PREMIUM_PLUS),
            "border-amber-200 bg-linear-to-b from-amber-50/40 to-white"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950">
                {PLANS[TIER.PREMIUM_PLUS].name}
              </span>
              {hasPaidCredit && paidCreditTier === TIER.PREMIUM_PLUS ? (
                <Badge className="bg-amber-600 text-white text-[10px]">
                  <Check className="mr-1 size-2.5" /> Credit Active
                </Badge>
              ) : (
                <Badge className="bg-amber-600 text-white text-[10px]">
                  Partner
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-amber-950">
                {PLANS[TIER.PREMIUM_PLUS].price}
              </span>
              <span className="text-[11px] text-amber-700 font-medium">
                / one-time
              </span>
            </div>

            <ul className="mt-1 flex flex-col gap-1.5 text-[11px] text-slate-600">
              <li className="flex items-center gap-1.5 font-medium text-amber-950">
                <Crown className="size-3 text-amber-600" />
                <span>Top Sticky Placement (Shown 1st)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-amber-600" />
                <span>Gold Shimmer Partner Badge & Banner</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Check className="size-3 text-amber-600" />
                <span>Everything in Featured Builder</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Unlock className="size-3 text-amber-600" />
                <span>Deep LLM Knowledge (/llms-full.txt)</span>
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-2 border-t border-amber-100 flex items-center justify-between">
            {!hasPaidCredit && selectedTier === TIER.PREMIUM_PLUS ? (
              <Button
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  onUnlockClick(TIER.PREMIUM_PLUS)
                }}
                disabled={isUnlocking}
                className="h-7 px-2.5 text-[11px] font-bold bg-amber-600 hover:bg-amber-700 text-white"
              >
                {isUnlocking ? "Opening..." : `Pay & Unlock (${PLANS[TIER.PREMIUM_PLUS].price})`}
              </Button>
            ) : (
              <span className="text-[10px] font-semibold text-amber-700">
                {hasPaidCredit ? "Paid Credit Ready" : "Select to Unlock"}
              </span>
            )}
            <div
              className={cn(
                "size-4 rounded-full border flex items-center justify-center",
                selectedTier === TIER.PREMIUM_PLUS
                  ? "border-amber-600 bg-amber-600 text-white"
                  : "border-slate-300"
              )}
            >
              {selectedTier === TIER.PREMIUM_PLUS && <Check className="size-3" />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

