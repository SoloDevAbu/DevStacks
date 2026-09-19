import type { Metadata } from "next"
import Link from "next/link"
import { Check, Sparkles, HelpCircle } from "lucide-react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { LAUNCH_PROMO } from "@/constants/promo"
import {
  launchPromoCard,
  launchPromoCardList,
  launchPromoCardItem,
} from "@/utils/styles"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"
import { PricingSponsorshipSection } from "@/components/pricing/pricing-sponsorship-section"

export const metadata: Metadata = {
  title: `Sidebar Sponsorship & Advertising — ${SITE_CONFIG.name}`,
  description: `Promote your developer tool, API, or infrastructure with dedicated sidebar ad placements reaching thousands of engineers on ${SITE_CONFIG.name}.`,
  keywords: [
    "developer advertising",
    "sponsor dev tools",
    "promote developer tool",
    "software sponsorship",
    "LaunchNests pricing",
    "tech advertising",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}/pricing`,
  },
  openGraph: {
    title: `Sidebar Sponsorship & Advertising | ${SITE_CONFIG.name}`,
    description: `Promote your developer tool or API with high-visibility sidebar ad placements across ${SITE_CONFIG.name}.`,
    type: "website",
    url: `${SITE_CONFIG.url}/pricing`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Sidebar Advertising | ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Sidebar Sponsorship & Advertising | ${SITE_CONFIG.name}`,
    description: `Promote your developer tool or API with high-visibility sidebar ad placements across ${SITE_CONFIG.name}.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const FAQ_ITEMS = [
  {
    question: "How much does directory submission cost?",
    answer: `Submitting developer tools and products to ${SITE_CONFIG.name} is 100% free. Every approved submission is indexed in our public directory with full searchability.`,
  },
  {
    question: "Where do sidebar ads appear?",
    answer:
      "Sidebar ads are displayed in prime view on navigation rails across all desktop and tablet pages, remaining sticky as users explore developer tools.",
  },
  {
    question: "What creative formats are supported?",
    answer:
      "We support clean developer-centric banners, rich media cards with verified badges, and direct call-to-action buttons with custom UTM parameters.",
  },
  {
    question: "How do I reserve a sponsorship slot?",
    answer:
      "Send a direct message on X to discuss available slots and placement details. Slots are allocated on a weekly or monthly basis with category exclusivity options.",
  },
]

const PricingPage = () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Pricing", url: `${SITE_CONFIG.url}/pricing` },
  ])

  const faqJsonLd = faqSchema(FAQ_ITEMS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        <PageHeader
          heading="📣 Sidebar Advertising & Sponsorship"
          description="Directory submissions are completely free. Grow your developer mindshare with premium, high-visibility sidebar placements seen across all pages."
          aiPrompt={AI_PROMPTS.pricing}
          variant="pricing"
        />

        {/* Launch Promo Card */}
        {LAUNCH_PROMO.IS_ACTIVE && (
          <div className="border-b border-dashed border-border bg-amber-50/20 px-6 py-8 md:px-10">
            <div className="mx-auto max-w-3xl">
              <div className={launchPromoCard}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700">
                      <Sparkles className="size-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {LAUNCH_PROMO.PROMO_TITLE}
                      </h3>
                      <p className="text-xs text-slate-600">
                        All directory submissions are currently receiving free Lifetime Premium upgrades ({LAUNCH_PROMO.VALUE_GIFTED} value) with permanent Do-Follow SEO backlinks.
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="rounded-lg bg-amber-600 text-xs font-semibold text-white hover:bg-amber-700"
                    nativeButton={false}
                    render={<Link href={ROUTES.SUBMIT} />}
                  >
                    Claim Free Listing
                  </Button>
                </div>
                <div className={launchPromoCardList}>
                  {LAUNCH_PROMO.PERKS.map((perk, i) => (
                    <div key={i} className={launchPromoCardItem}>
                      <Check className="size-3.5 shrink-0 text-emerald-600" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sponsorship & Listings Section */}
        <PricingSponsorshipSection />

        {/* FAQ Section */}
        <div className="flex flex-col bg-white px-6 py-10 md:px-10 md:py-16">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <HelpCircle className="size-4 text-indigo-600" /> Frequently Asked
            Questions
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4"
              >
                <h4 className="text-xs font-bold text-slate-900">
                  {item.question}
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default PricingPage
