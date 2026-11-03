"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sparkles, ArrowRight, X } from "lucide-react"
import { LAUNCH_PROMO, PROMO_BANNER_DISMISS } from "@/constants/promo"
import { ROUTES } from "@/constants/routes"
import { launchPromoBannerWrapper } from "@/utils/styles"

// Rendered on the server so it never pushes the page down after hydration. A dismissed banner is
// hidden before first paint by PromoBannerDismissScript, which sets an attribute on <html>.
export const LaunchPromoBanner = () => {
  const pathname = usePathname()

  if (
    !LAUNCH_PROMO.IS_ACTIVE ||
    LAUNCH_PROMO.BANNER_HIDDEN_ROUTES.includes(pathname)
  ) {
    return null
  }

  const handleDismiss = () => {
    document.documentElement.setAttribute(
      PROMO_BANNER_DISMISS.HTML_ATTRIBUTE,
      ""
    )
    try {
      localStorage.setItem(PROMO_BANNER_DISMISS.STORAGE_KEY, "true")
    } catch {
      // Storage can be unavailable (private mode); the banner stays hidden for this visit.
    }
  }

  return (
    <aside
      aria-label="Launch Promotion Announcement"
      data-promo-banner=""
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
