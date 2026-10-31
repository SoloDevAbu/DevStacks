import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { LAUNCH_PROMO } from "@/constants/promo"
import {
  pricingPageWrapper,
  pricingPageContainer,
  pricingBreadcrumbNav,
  launchPromoFullWidthSection,
} from "@/utils/styles"
import { breadcrumbSchema, safeJsonLd } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"
import { getLaunchPromoStatus } from "@/db/queries/launches/availability"
import { PricingTiersSection } from "@/components/pricing/pricing-tiers-section"
import { PricingSponsorshipSection } from "@/components/pricing/pricing-sponsorship-section"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Pricing & Promotion Tiers | Launch Listings & Sponsorship",
  description: `Explore transparent pricing for developer tool directory listings, verified badges, AI search citations, and dedicated sidebar sponsorships on ${SITE_CONFIG.name}.`,
  keywords: [
    "developer advertising",
    "sponsor dev tools",
    "promote developer tool",
    "software sponsorship",
    "LaunchNests pricing",
    "directory listing pricing",
    "verified developer badge",
    "tech advertising",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/pricing`,
  },
  openGraph: {
    title: `Pricing & Promotion Tiers | ${SITE_CONFIG.name}`,
    description: `Explore transparent pricing for directory listings, verified badges, AI search citations, and sidebar sponsorships across ${SITE_CONFIG.name}.`,
    type: "website",
    url: `${SITE_CONFIG.url}/pricing`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: SITE_CONFIG.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `Pricing & Tiers | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Pricing & Promotion Tiers | ${SITE_CONFIG.name}`,
    description: `Explore transparent pricing for directory listings, verified badges, AI search citations, and sidebar sponsorships across ${SITE_CONFIG.name}.`,
    images: [SITE_CONFIG.ogImageUrl],
  },
}

const PricingPage = async () => {
  const promoStatus = await getLaunchPromoStatus()

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Pricing", url: `${SITE_CONFIG.url}/pricing` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbs) }}
      />
      <div className={pricingPageWrapper}>
        <div className={pricingPageContainer}>
          {/* Breadcrumb & Markdown discovery strip */}
          <nav aria-label="Breadcrumb" className={pricingBreadcrumbNav}>
            <div className="flex min-w-0 items-center gap-2">
              <Link
                href={ROUTES.HOME}
                className="flex shrink-0 items-center gap-1 transition-colors hover:text-slate-900"
              >
                <ArrowLeft className="size-3 shrink-0" />
                Home
              </Link>
              <ChevronRight
                className="size-3 shrink-0 text-slate-400"
                aria-hidden="true"
              />
              <span
                className="truncate font-semibold text-slate-900"
                aria-current="page"
              >
                Pricing
              </span>
            </div>
            <Link
              href="/pricing.md"
              className="shrink-0 text-xs font-medium text-indigo-600 hover:underline"
            >
              View as Markdown (/pricing.md)
            </Link>
          </nav>

          <PageHeader
            heading="Pricing for Advertising & Tiers"
            description="Directory submissions are completely free. Grow your developer mindshare with verified builder tiers and high-visibility sidebar sponsorships seen across all pages."
            aiPrompt={AI_PROMPTS.pricing}
            variant="pricing"
          />

          {/* Launch Promo Full Width Banner */}
          {promoStatus.isPromoActive && (
            <section className={launchPromoFullWidthSection}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3 sm:items-center">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700">
                    <Sparkles className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                      {LAUNCH_PROMO.PROMO_TITLE}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-600">
                      First {LAUNCH_PROMO.MAX_LAUNCHES} launches get a 100% free Lifetime Premium Listing ({LAUNCH_PROMO.VALUE_GIFTED} value) with permanent Do-Follow SEO backlink and AI launch spotlight. Only {promoStatus.promoRemaining} spots remaining!
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="w-full shrink-0 cursor-pointer rounded-none bg-amber-600 text-xs font-semibold text-white shadow-xs hover:bg-amber-700 sm:w-auto"
                  nativeButton={false}
                  render={<Link href={ROUTES.SUBMIT} />}
                >
                  <Sparkles className="mr-1.5 size-3.5" />
                  Claim Free Premium Listing
                </Button>
              </div>
            </section>
          )}

          {/* 1. Directory Listing & Promotion Tiers (Placed ABOVE ad slot pricing) */}
          <PricingTiersSection promo={promoStatus} />

          {/* 2. Sponsorship & Ad Slots (Sidebar & Feed Placements) */}
          <PricingSponsorshipSection />
        </div>
      </div>
    </>
  )
}

export default PricingPage
