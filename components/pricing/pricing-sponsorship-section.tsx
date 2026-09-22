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

      {/* 2. Listing Tiers Section (Commented out for now)
      <section className={pricingSection}>
        // Section Header
        <div className={pricingSectionHeader}>
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
              <BadgeCheck className="size-3.5" /> Tool & Product Listing Tiers
            </div>
            <h2 className={pricingSectionTitle}>
              Directory Listings & Verification
            </h2>
            <p className={pricingSectionSubtitle}>
              Permanent directory indexing with optional verification tiers.
            </p>
          </div>
          <Badge
            variant="outline"
            className="self-start rounded-full border-blue-200 bg-white px-3 py-1 text-[11px] font-semibold text-blue-700 sm:self-auto"
          >
            Permanent Indexing • Verified Badges
          </Badge>
        </div>

        // Pricing Sub-Section
        <div className={pricingTiersGrid}>
          // Community Free
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

              <div className={`${pricingPriceBox} border border-slate-200 bg-slate-50/50`}>
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

          // Premium Tier (Featured)
          <div
            className={`${pricingColumn} bg-linear-to-b from-blue-50/30 via-white to-white`}
          >
            <CornerBrackets />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">
                  {PLANS[TIER.PREMIUM].name}
                </span>
                <Badge className="bg-blue-600 text-[10px] text-white hover:bg-blue-700">
                  {PLANS[TIER.PREMIUM].badgeLabel}
                </Badge>
              </div>

              <div className={`${pricingPriceBox} border border-blue-100 bg-blue-50/50`}>
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

              <div className="mt-3 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50/50 p-2 text-[11px] text-amber-800">
                <Gift className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Also earned <strong>free</strong> when booking {AD_TIER_BONUS.PREMIUM_THRESHOLD}+ weeks of ads
                </span>
              </div>
            </div>

            <Button
              className="mt-6 w-full bg-blue-600 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700"
              nativeButton={false}
              render={<Link href={ROUTES.SUBMIT} />}
            >
              Get Verified ({PLANS[TIER.PREMIUM].price})
            </Button>
          </div>

          // Premium+ Tier (Partner)
          <div
            className={`${pricingColumn} bg-linear-to-b from-amber-50/20 via-white to-white`}
          >
            <CornerBrackets />
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  {PLANS[TIER.PREMIUM_PLUS].name}
                </span>
                <Badge className="bg-amber-600 text-[10px] text-white hover:bg-amber-700">
                  {PLANS[TIER.PREMIUM_PLUS].badgeLabel}
                </Badge>
              </div>

              <div className={`${pricingPriceBox} border border-amber-100 bg-amber-50/50`}>
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

              <div className="mt-3 flex items-start gap-1.5 rounded-md border border-amber-200 bg-amber-50/50 p-2 text-[11px] text-amber-800">
                <Gift className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Also earned <strong>free</strong> when booking {AD_TIER_BONUS.PREMIUM_PLUS_THRESHOLD} weeks of ads
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="mt-6 w-full border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-50"
              nativeButton={false}
              render={<Link href={ROUTES.SUBMIT} />}
            >
              Become a Partner ({PLANS[TIER.PREMIUM_PLUS].price})
            </Button>
          </div>
        </div>
      </section>
      */}

      <CreateAdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultPlacement={selectedPlacement}
      />
    </>
  )
}
