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
} from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HoverOutline } from "@/components/shared/hover-outline"
import { CreateAdDialog } from "@/components/ads/create-ad-dialog"
import {
  AD_PLACEMENT,
  SIDEBAR_AD_TIERS,
  FEED_AD_TIERS,
  type AdPlacement,
} from "@/constants/ads"
import { PLANS, TIER } from "@/constants/plans"
import { ROUTES } from "@/constants/routes"

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
      {/* 1. Ad Placements Grid (Sidebar & Feed) */}
      <div className="border-b border-dashed border-border bg-white px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[11px] font-bold text-indigo-700">
              <Megaphone className="size-3.5" /> Direct Builder Sponsorships
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              High-Authority Sponsorship Slots
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Instant self-serve activation powered by Dodo Payments.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Right Sidebar Placement */}
            <div className="group relative flex">
              <Card className="flex w-full flex-col justify-between rounded-xl border border-indigo-200 bg-linear-to-b from-indigo-50/40 via-white to-white p-6 shadow-sm">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs">
                      <Megaphone className="size-4" />
                    </span>
                    <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">
                      <Sparkles className="mr-1 size-3" /> Right Sidebar
                    </Badge>
                  </div>

                  <CardTitle className="mt-4 text-lg font-bold text-slate-900">
                    Right Sidebar Placement
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Persistent rail seen across every tool, product, and maker page
                  </CardDescription>

                  <div className="mt-4 flex items-baseline gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 p-3">
                    <span className="text-2xl font-extrabold text-indigo-950">
                      ${SIDEBAR_AD_TIERS.weekly.price}
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">
                      / week
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-lg font-extrabold text-indigo-950">
                      ${SIDEBAR_AD_TIERS.monthly.price}
                    </span>
                    <span className="text-xs font-semibold text-indigo-700">
                      / month
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="mt-4 flex-1 p-0">
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>
                        <strong>Persistent Sticky View:</strong> Placed on the
                        right navigation rail of all desktop and tablet views.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>
                        <strong>Direct Outbound Links:</strong> Custom CTA button
                        linking directly to your landing page or sign-up.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>
                        <strong>Instant Dodo Checkout:</strong> Automated
                        activation immediately after payment approval.
                      </span>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="mt-6 p-0">
                  <Button
                    onClick={() => handleOpenDialog(AD_PLACEMENT.SIDEBAR)}
                    className="w-full bg-indigo-600 text-xs font-bold text-white hover:bg-indigo-700 cursor-pointer shadow-xs"
                  >
                    <span>Book Sidebar Placement</span>
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Button>
                </CardFooter>
              </Card>
              <HoverOutline />
            </div>

            {/* Native Feed Card Placement */}
            <div className="group relative flex">
              <Card className="flex w-full flex-col justify-between rounded-xl border border-slate-200 bg-linear-to-b from-slate-50/40 via-white to-white p-6 shadow-sm">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-slate-900 text-white shadow-xs">
                      <Layers className="size-4" />
                    </span>
                    <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50/50">
                      <Zap className="mr-1 size-3" /> Native Feed
                    </Badge>
                  </div>

                  <CardTitle className="mt-4 text-lg font-bold text-slate-900">
                    Discovery Feed Placement
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Seamless native card injected directly between organic directory listings
                  </CardDescription>

                  <div className="mt-4 flex items-baseline gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                    <span className="text-2xl font-extrabold text-slate-900">
                      ${FEED_AD_TIERS.weekly.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      / week
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="text-lg font-extrabold text-slate-900">
                      ${FEED_AD_TIERS.monthly.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      / month
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="mt-4 flex-1 p-0">
                  <ul className="space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>
                        <strong>In-Stream Discovery:</strong> Displayed prominently
                        among the newest trending developer tools and products.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>
                        <strong>Native Developer Card:</strong> Includes logo,
                        headline, description, and direct external visit action.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="size-3.5 shrink-0 text-emerald-600 mt-0.5" />
                      <span>
                        <strong>High-Intent CTR:</strong> Catches engineers actively
                        exploring new developer stack solutions.
                      </span>
                    </li>
                  </ul>
                </CardContent>

                <CardFooter className="mt-6 p-0">
                  <Button
                    onClick={() => handleOpenDialog(AD_PLACEMENT.FEED)}
                    variant="outline"
                    className="w-full border-slate-300 text-xs font-bold text-slate-800 hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    <span>Book Feed Card Placement</span>
                    <ArrowRight className="ml-1.5 size-3.5" />
                  </Button>
                </CardFooter>
              </Card>
              <HoverOutline />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Listing Tiers (Community, Premium, Premium+) */}
      <div className="border-b border-dashed border-border bg-slate-50/50 px-6 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold text-blue-700">
              <BadgeCheck className="size-3.5" /> Tool & Product Listing Tiers
            </div>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              Directory Listings & Verification
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Permanent directory indexing with optional verification tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Community Free */}
            <Card className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">
                    {PLANS[TIER.FREE].name}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    Free
                  </Badge>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-slate-900">
                    $0
                  </span>
                  <span className="text-xs text-slate-500"> / lifetime</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  {PLANS[TIER.FREE].tagline}
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  {PLANS[TIER.FREE].features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="size-3 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
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
                Submit Free Listing
              </Button>
            </Card>

            {/* Premium Tier */}
            <Card className="relative flex flex-col justify-between rounded-xl border border-blue-200 bg-linear-to-b from-blue-50/40 to-white p-5 shadow-xs">
              <div className="absolute -top-2.5 right-4">
                <Badge className="bg-blue-600 text-white text-[10px]">
                  Verified Check
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">
                    {PLANS[TIER.PREMIUM].name}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-blue-950">
                    $49
                  </span>
                  <span className="text-xs text-blue-700"> / one-time</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  {PLANS[TIER.PREMIUM].tagline}
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  {PLANS[TIER.PREMIUM].features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="size-3 text-blue-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className="mt-6 w-full bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 shadow-2xs"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT} />}
              >
                Get Verified ($49)
              </Button>
            </Card>

            {/* Premium+ Tier */}
            <Card className="flex flex-col justify-between rounded-xl border border-amber-200 bg-linear-to-b from-amber-50/40 to-white p-5 shadow-2xs">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900">
                    {PLANS[TIER.PREMIUM_PLUS].name}
                  </span>
                  <Badge className="bg-amber-600 text-white text-[10px]">
                    Partner
                  </Badge>
                </div>
                <div className="mt-3">
                  <span className="text-2xl font-extrabold text-amber-950">
                    $149
                  </span>
                  <span className="text-xs text-amber-700"> / quarterly</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-600">
                  {PLANS[TIER.PREMIUM_PLUS].tagline}
                </p>

                <ul className="mt-4 space-y-2 text-xs text-slate-700">
                  {PLANS[TIER.PREMIUM_PLUS].features.map((f, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <Check className="size-3 text-amber-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="outline"
                className="mt-6 w-full border-amber-300 text-xs font-semibold text-amber-900 hover:bg-amber-50"
                nativeButton={false}
                render={<Link href={ROUTES.SUBMIT} />}
              >
                Ecosystem Partner ($149)
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <CreateAdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultPlacement={selectedPlacement}
      />
    </>
  )
}
