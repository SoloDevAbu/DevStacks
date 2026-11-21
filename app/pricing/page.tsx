import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  pricingPageWrapper,
  pricingPageContainer,
  pricingBreadcrumbNav,
} from "@/utils/styles"
import { breadcrumbSchema, safeJsonLd } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"
import { PricingTiersSection } from "@/components/pricing/pricing-tiers-section"
import { PricingSponsorshipSection } from "@/components/pricing/pricing-sponsorship-section"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Pricing: Launch Listings & Sponsorship",
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

const PricingPage = () => {
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
            heading="Pricing: Free Launches, Premium Listings & Sponsorship"
            description="Directory submissions are completely free. Grow your developer mindshare with verified builder tiers and high-visibility sidebar sponsorships seen across all pages."
            aiPrompt={AI_PROMPTS.pricing}
            variant="pricing"
          />

          {/* 1. Directory Listing & Promotion Tiers (Placed ABOVE ad slot pricing) */}
          <PricingTiersSection />

          {/* 2. Sponsorship & Ad Slots (Sidebar & Feed Placements) */}
          <PricingSponsorshipSection />
        </div>
      </div>
    </>
  )
}

export default PricingPage
