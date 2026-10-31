"use client"

import Link from "next/link"
import { Check, Sparkles, Crown, BadgeCheck, ArrowUpRight, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"
import {
  submitSectionHeaderTier,
  submitTierFullWidthGrid,
  submitTierFullWidthColumn,
} from "@/utils/styles"
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
    <div className="flex flex-col">
      {/* Full-width Section Header separated by dashed line */}
      <div className={submitSectionHeaderTier}>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-slate-900">
              Launch Tier
            </h2>
            {selectedTier === TIER.FREE ? (
              <Badge
                variant="outline"
                className="rounded-md border-slate-200 bg-slate-50 font-mono text-[10px] font-semibold tracking-wider text-slate-700 uppercase"
              >
                Community ({PLANS[TIER.FREE].price})
              </Badge>
            ) : selectedTier === TIER.PREMIUM ? (
              <Badge className="rounded-md bg-blue-600 font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
                {PLANS[TIER.PREMIUM].name}
              </Badge>
            ) : (
              <Badge className="rounded-md bg-amber-600 font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
                {PLANS[TIER.PREMIUM_PLUS].name}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {isPromoActive
              ? `Launch Celebration: First 50 launches receive free Lifetime Premium (${promoRemaining} spots left).`
              : "Choose your launch tier to boost visibility, backlink authority, and reach."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={
            <Link
              href={ROUTES.PRICING}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          className="self-start sm:self-auto h-8 gap-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
        >
          <ArrowUpRight className="size-3.5 text-slate-500" />
          <span>View Full Pricing</span>
        </Button>
      </div>

      {/* Free Tier Active Notice */}
      {selectedTier === TIER.FREE && (
        <div className="flex items-center gap-2 border-b border-dashed border-border bg-slate-50/70 px-6 py-3.5 text-xs text-slate-600 md:px-8">
          <Info className="size-4 shrink-0 text-slate-400" />
          <span>
            You currently have the standard Free listing selected (no card required). Upgrade to{" "}
            <strong className="text-slate-900">{PLANS[TIER.PREMIUM].name}</strong> or{" "}
            <strong className="text-slate-900">{PLANS[TIER.PREMIUM_PLUS].name}</strong> below for verified backlinks and priority placement.
          </span>
        </div>
      )}

      {/* Full-width 2-column Grid separated by dashed lines */}
      <div className={submitTierFullWidthGrid}>
        {/* PREMIUM */}
        <div
          onClick={() => onSelectTier(TIER.PREMIUM)}
          className={submitTierFullWidthColumn(
            selectedTier === TIER.PREMIUM,
            TIER.PREMIUM
          )}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-950 sm:text-base">
                  {PLANS[TIER.PREMIUM].name}
                </span>
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-[10px] font-semibold text-blue-700"
                >
                  {PLANS[TIER.PREMIUM].badgeLabel}
                </Badge>
              </div>

              {isPromoActive ? (
                <Badge className="bg-emerald-600 text-[10px] text-white">
                  <Sparkles className="mr-1 size-2.5" /> FREE Promo
                </Badge>
              ) : hasPaidCredit && paidCreditTier === TIER.PREMIUM ? (
                <Badge className="bg-blue-600 text-[10px] text-white">
                  <Check className="mr-1 size-2.5" /> Credit Active
                </Badge>
              ) : (
                <Badge className="bg-blue-600 text-[10px] text-white">
                  Popular
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              {isPromoActive ? (
                <>
                  <span className="text-xs font-bold text-slate-400 line-through">
                    {PLANS[TIER.PREMIUM].price}
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    FREE
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600">
                    (Launch Gift)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-2xl font-extrabold text-blue-950">
                    {PLANS[TIER.PREMIUM].price}
                  </span>
                  <span className="text-[11px] font-medium text-blue-700">
                    / {PLANS[TIER.PREMIUM].period}
                  </span>
                </>
              )}
            </div>

            <ul className="mt-2 flex flex-col gap-2 text-xs text-slate-600">
              <li className="flex items-center gap-2 font-semibold text-blue-950">
                <BadgeCheck className="size-3.5 shrink-0 text-blue-600" />
                <span>Permanent Do-Follow SEO backlink</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-blue-600" />
                <span>Verified Blue Check badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-blue-600" />
                <span>Dedicated ~1,000-word AI-written blog</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-blue-600" />
                <span>Priority placement across launch pages</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-dashed border-border pt-4">
            {!isPromoActive &&
            !hasPaidCredit &&
            selectedTier === TIER.PREMIUM ? (
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
                {isUnlocking
                  ? "Opening..."
                  : `Pay & Unlock (${PLANS[TIER.PREMIUM].price})`}
              </Button>
            ) : (
              <span className="text-xs font-semibold text-blue-700">
                {isPromoActive
                  ? "Included 100% Free"
                  : hasPaidCredit
                    ? "Paid Credit Ready"
                    : selectedTier === TIER.PREMIUM
                      ? "Selected"
                      : "Click to Select"}
              </span>
            )}
            <div
              className={cn(
                "size-5 rounded-full border flex items-center justify-center transition-colors",
                selectedTier === TIER.PREMIUM
                  ? "border-blue-600 bg-blue-600 text-white shadow-2xs"
                  : "border-slate-300 bg-white"
              )}
            >
              {selectedTier === TIER.PREMIUM && <Check className="size-3" />}
            </div>
          </div>
        </div>

        {/* PREMIUM+ */}
        <div
          onClick={() => onSelectTier(TIER.PREMIUM_PLUS)}
          className={submitTierFullWidthColumn(
            selectedTier === TIER.PREMIUM_PLUS,
            TIER.PREMIUM_PLUS
          )}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-amber-950 sm:text-base">
                  {PLANS[TIER.PREMIUM_PLUS].name}
                </span>
                <Badge
                  variant="outline"
                  className="border-amber-200 bg-amber-50 text-[10px] font-semibold text-amber-700"
                >
                  {PLANS[TIER.PREMIUM_PLUS].badgeLabel}
                </Badge>
              </div>

              {hasPaidCredit && paidCreditTier === TIER.PREMIUM_PLUS ? (
                <Badge className="bg-amber-600 text-[10px] text-white">
                  <Check className="mr-1 size-2.5" /> Credit Active
                </Badge>
              ) : (
                <Badge className="bg-amber-600 text-[10px] text-white">
                  Partner
                </Badge>
              )}
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-amber-950">
                {PLANS[TIER.PREMIUM_PLUS].price}
              </span>
              <span className="text-[11px] font-medium text-amber-700">
                / {PLANS[TIER.PREMIUM_PLUS].period}
              </span>
            </div>

            <ul className="mt-2 flex flex-col gap-2 text-xs text-slate-600">
              <li className="flex items-center gap-2 font-semibold text-amber-950">
                <Crown className="size-3.5 shrink-0 text-amber-600" />
                <span>Top sticky placement (shown first)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-amber-600" />
                <span>Exclusive Gold Shimmer badge</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-amber-600" />
                <span>Dedicated ~1,800-word AI-written blog</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 shrink-0 text-amber-600" />
                <span>Custom CTA on blog post &amp; priority support</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-dashed border-border pt-4">
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
                {isUnlocking
                  ? "Opening..."
                  : `Pay & Unlock (${PLANS[TIER.PREMIUM_PLUS].price})`}
              </Button>
            ) : (
              <span className="text-xs font-semibold text-amber-700">
                {hasPaidCredit
                  ? "Paid Credit Ready"
                  : selectedTier === TIER.PREMIUM_PLUS
                    ? "Selected"
                    : "Click to Select"}
              </span>
            )}
            <div
              className={cn(
                "size-5 rounded-full border flex items-center justify-center transition-colors",
                selectedTier === TIER.PREMIUM_PLUS
                  ? "border-amber-600 bg-amber-600 text-white shadow-2xs"
                  : "border-slate-300 bg-white"
              )}
            >
              {selectedTier === TIER.PREMIUM_PLUS && (
                <Check className="size-3" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
