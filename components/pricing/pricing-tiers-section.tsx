"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { PLANS, TIER, type Tier } from "@/constants/plans"
import { AD_TIER_BONUS } from "@/constants/ads"
import { ROUTES } from "@/constants/routes"
import { SelectListingUpgradeModal } from "./select-listing-upgrade-modal"
import {
  pricingSection,
  pricingSectionHeader,
  pricingSectionTitle,
  pricingSectionSubtitle,
  pricingTiersGrid,
  pricingColumn,
  pricingPriceBox,
  pricingFeatureList,
  pricingBonusBox,
} from "@/utils/styles"

export const PricingTiersSection = () => {
  const [upgradeModalTier, setUpgradeModalTier] = useState<Tier | null>(null)

  return (
    <section className={pricingSection}>
      {/* Section Header */}
      <div className={pricingSectionHeader}>
        <div>
          <h2 className={pricingSectionTitle}>
            Directory Listings & Promotion Tiers
          </h2>
          <p className={pricingSectionSubtitle}>
            Permanent directory indexing, multi-LLM answer engine citations, and
            verified builder badges.
          </p>
        </div>
      </div>

      {/* Pricing Columns */}
      <div className={pricingTiersGrid}>
        {/* Tier 1: Community Free */}
        <div className={pricingColumn}>
          <CornerBrackets />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">
                {PLANS[TIER.FREE].name}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {PLANS[TIER.FREE].badgeLabel}
              </Badge>
            </div>

            <div
              className={`${pricingPriceBox} border border-slate-200 bg-slate-50/50`}
            >
              <span className="text-2xl font-extrabold text-slate-900">
                {PLANS[TIER.FREE].price}
              </span>
              <span className="text-xs text-slate-500">
                / {PLANS[TIER.FREE].period}
              </span>
            </div>

            <p className="mt-3 text-[11px] text-slate-500">
              {PLANS[TIER.FREE].tagline}
            </p>

            <ul className={pricingFeatureList}>
              {PLANS[TIER.FREE].features.map((feature, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-emerald-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="outline"
            className="mt-6 w-full text-xs font-semibold"
            nativeButton={false}
            render={<Link href={ROUTES.SUBMIT} />}
          >
            {PLANS[TIER.FREE].ctaText}
          </Button>
        </div>

        {/* Tier 2: Premium */}
        <div
          className={`${pricingColumn} bg-linear-to-b from-blue-50/40 via-white to-white ring-1 ring-blue-200/80 md:ring-0`}
        >
          <CornerBrackets />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">
                {PLANS[TIER.PREMIUM].name}
              </span>
              <Badge className="bg-blue-600 text-[10px] text-white shadow-2xs hover:bg-blue-700">
                {PLANS[TIER.PREMIUM].badgeLabel}
              </Badge>
            </div>

            <div
              className={`${pricingPriceBox} border border-blue-200 bg-blue-50/70`}
            >
              <span className="text-2xl font-extrabold text-blue-950">
                {PLANS[TIER.PREMIUM].price}
              </span>
              <span className="text-xs font-semibold text-blue-700">
                / {PLANS[TIER.PREMIUM].period}
              </span>
            </div>

            <p className="mt-3 text-[11px] text-slate-600">
              {PLANS[TIER.PREMIUM].tagline}
            </p>

            <ul className={pricingFeatureList}>
              {PLANS[TIER.PREMIUM].features.map((feature, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-blue-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50/50 p-2 text-[11px] text-amber-800">
              <Gift className="mt-0.5 size-3.5 shrink-0" />
              <span>
                Also unlocked <strong>free</strong> when booking{" "}
                {AD_TIER_BONUS.PREMIUM_THRESHOLD}+ weeks of ads
              </span>
            </div>
          </div>

          <Button
            className="mt-6 w-full cursor-pointer bg-blue-600 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
            onClick={() => setUpgradeModalTier(TIER.PREMIUM)}
          >
            {PLANS[TIER.PREMIUM].ctaText}
          </Button>
        </div>

        {/* Tier 3: Premium+ */}
        <div
          className={`${pricingColumn} bg-linear-to-b from-amber-50/20 via-white to-white`}
        >
          <CornerBrackets />
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">
                {PLANS[TIER.PREMIUM_PLUS].name}
              </span>
              <Badge className="bg-amber-600 text-[10px] text-white shadow-2xs hover:bg-amber-700">
                {PLANS[TIER.PREMIUM_PLUS].badgeLabel}
              </Badge>
            </div>

            <div
              className={`${pricingPriceBox} border border-amber-100 bg-amber-50/50`}
            >
              <span className="text-2xl font-extrabold text-amber-950">
                {PLANS[TIER.PREMIUM_PLUS].price}
              </span>
              <span className="text-xs font-semibold text-amber-700">
                / {PLANS[TIER.PREMIUM_PLUS].period}
              </span>
            </div>

            <p className="mt-3 text-[11px] text-slate-600">
              {PLANS[TIER.PREMIUM_PLUS].tagline}
            </p>

            <ul className={pricingFeatureList}>
              {PLANS[TIER.PREMIUM_PLUS].features.map((feature, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <Check className="mt-0.5 size-3 shrink-0 text-amber-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className={pricingBonusBox}>
              <Gift className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
              <span>
                Also unlocked <strong>free</strong> when booking{" "}
                {AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD} weeks of sidebar
                sponsorships.
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="mt-6 w-full cursor-pointer border-amber-300 text-xs font-bold text-amber-900 shadow-2xs hover:bg-amber-50"
            onClick={() => setUpgradeModalTier(TIER.PREMIUM_PLUS)}
          >
            {PLANS[TIER.PREMIUM_PLUS].ctaText}
          </Button>
        </div>
      </div>

      {upgradeModalTier && (
        <SelectListingUpgradeModal
          isOpen={Boolean(upgradeModalTier)}
          onClose={() => setUpgradeModalTier(null)}
          targetTier={upgradeModalTier}
        />
      )}
    </section>
  )
}
