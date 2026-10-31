"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Megaphone,
  Check,
  Sparkles,
  ArrowRight,
  Zap,
  Layers,
  BadgeCheck,
  Gift,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CornerBrackets } from "@/components/shared/corner-brackets"
import { CreateAdDialog } from "@/components/ads/create-ad-dialog"
import {
  AD_PLACEMENT,
  AD_PRICING,
  AD_TIER_BONUS,
  type AdPlacement,
} from "@/constants/ads"
import { PLANS, TIER } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"
import {
  pricingSection,
  pricingSectionHeader,
  pricingSectionTitle,
  pricingSectionSubtitle,
  pricingSponsorshipGrid,
  pricingTiersGrid,
  pricingColumn,
  pricingPriceBox,
  pricingFeatureList,
  pricingBonusBox,
} from "@/utils/styles"

export const PricingSponsorshipSection = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedPlacement, setSelectedPlacement] = useState<AdPlacement>(
    AD_PLACEMENT.SIDEBAR
  )

  const handleOpenDialog = (placement: AdPlacement) => {
    setSelectedPlacement(placement)
    setDialogOpen(true)
  }

  return (
    <>
      {/* 1. Sponsorship Section */}
      <section className={pricingSection}>
        {/* Section Header */}
        <div className={pricingSectionHeader}>
          <div>
            <h2 className={pricingSectionTitle}>Sponsorship Slots</h2>
            <p className={pricingSectionSubtitle}>
              Instant self-serve activation powered by Dodo Payments. Per-week
              ISO scheduling with 3 slots per week.
            </p>
          </div>
        </div>

        {/* Pricing Sub-Section */}
        <div className={pricingSponsorshipGrid}>
          {/* Right Sidebar Placement */}
          <div className={pricingColumn}>
            <CornerBrackets />
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Megaphone className="size-4" />
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Right Sidebar Placement
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Persistent rail seen across every tool, product, and maker page
              </p>

              <div
                className={`${pricingPriceBox} border border-indigo-100 bg-indigo-50/50`}
              >
                <span className="text-2xl font-extrabold text-indigo-950">
                  ${AD_PRICING[AD_PLACEMENT.SIDEBAR].pricePerWeek}
                </span>
                <span className="text-xs font-semibold text-indigo-700">
                  / week
                </span>
              </div>

              <ul className={pricingFeatureList}>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Persistent Sticky View:</strong> Placed on the right
                    navigation rail of all desktop and tablet views.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Direct Outbound Links:</strong> Custom CTA button
                    linking directly to your landing page or sign-up.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Instant Dodo Checkout:</strong> Automated activation
                    immediately after payment approval.
                  </span>
                </li>
              </ul>

              <div className={pricingBonusBox}>
                <Gift className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                <span>
                  Book {AD_TIER_BONUS.PREMIUM_THRESHOLD}+ weeks →{" "}
                  <strong>Free Premium</strong> upgrade. Book{" "}
                  {AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD} weeks →{" "}
                  <strong>Free Premium+</strong> upgrade.
                </span>
              </div>
            </div>

            <Button
              onClick={() => handleOpenDialog(AD_PLACEMENT.SIDEBAR)}
              className="mt-6 w-full cursor-pointer bg-indigo-600 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
            >
              <span>Book Sidebar Placement</span>
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </div>

          {/* Native Feed Card Placement */}
          <div className={pricingColumn}>
            <CornerBrackets />
            <div>
              <div className="flex items-center justify-between">
                <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
                  <Layers className="size-4" />
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Discovery Feed Placement
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Seamless native card injected directly between organic directory
                listings
              </p>

              <div
                className={`${pricingPriceBox} border border-slate-200 bg-slate-50/50`}
              >
                <span className="text-2xl font-extrabold text-slate-900">
                  ${AD_PRICING[AD_PLACEMENT.FEED].pricePerWeek}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  / week
                </span>
              </div>

              <ul className={pricingFeatureList}>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>In-Stream Discovery:</strong> Displayed prominently
                    among the newest trending developer tools and products.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>Native Developer Card:</strong> Includes logo,
                    headline, description, and direct external visit action.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                  <span>
                    <strong>High-Intent CTR:</strong> Catches engineers actively
                    exploring new developer stack solutions.
                  </span>
                </li>
              </ul>

              <div className={pricingBonusBox}>
                <Gift className="mt-0.5 size-3.5 shrink-0 text-amber-600" />
                <span>
                  Book {AD_TIER_BONUS.PREMIUM_THRESHOLD}+ weeks →{" "}
                  <strong>Free Premium</strong> upgrade. Book{" "}
                  {AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD} weeks →{" "}
                  <strong>Free Premium+</strong> upgrade.
                </span>
              </div>
            </div>

            <Button
              onClick={() => handleOpenDialog(AD_PLACEMENT.FEED)}
              variant="outline"
              className="mt-6 w-full cursor-pointer border-slate-300 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50"
            >
              <span>Book Feed Card Placement</span>
              <ArrowRight className="ml-1.5 size-3.5" />
            </Button>
          </div>
        </div>
      </section>

      <CreateAdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultPlacement={selectedPlacement}
      />
    </>
  )
}
