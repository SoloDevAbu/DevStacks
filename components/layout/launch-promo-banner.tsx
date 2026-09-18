"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles, ArrowRight, X } from "lucide-react"
import { LAUNCH_PROMO } from "@/constants/promo"
import { ROUTES } from "@/constants/routes"
import { launchPromoBannerWrapper } from "@/utils/styles"

const DISMISS_KEY = "launchnests_promo_banner_dismissed_v1"

export const LaunchPromoBanner = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem(DISMISS_KEY)
    if (!isDismissed) {
      setIsVisible(true)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem(DISMISS_KEY, "true")
  }

  if (!isVisible || !LAUNCH_PROMO.IS_ACTIVE) {
    return null
  }

  return (
    <aside
      aria-label="Launch Promotion Announcement"
      className={launchPromoBannerWrapper}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-2 sm:px-4">
        <div className="flex flex-1 items-center justify-center gap-2 text-center text-xs sm:gap-2.5">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-700">
            <Sparkles className="size-3" />
          </span>
          <p className="font-medium text-amber-950">
            <strong className="font-semibold text-amber-900">
              Launch Special:
            </strong>{" "}
            First {LAUNCH_PROMO.MAX_LAUNCHES} launches get a{" "}
            <span className="font-semibold text-amber-900 underline decoration-amber-400 underline-offset-2">
              FREE Lifetime Premium Listing ({LAUNCH_PROMO.VALUE_GIFTED} value)
            </span>{" "}
            with permanent Do-Follow SEO backlink!
          </p>
          <Link
            href={ROUTES.SUBMIT}
            className="inline-flex shrink-0 items-center gap-1 font-semibold text-amber-900 transition-colors hover:text-amber-700 hover:underline"
          >
            {LAUNCH_PROMO.BANNER_CTA}
            <ArrowRight className="size-3" />
          </Link>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded p-1 text-amber-700 transition-colors hover:bg-amber-500/15 hover:text-amber-900"
          aria-label="Dismiss banner"
        >
          <X className="size-3.5" />
        </button>
      </div>
    </aside>
  )
}
