import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Mail,
  ShieldCheck,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  REFUND_CATEGORIES,
  REFUND_LAST_UPDATED,
} from "@/constants/refund"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { breadcrumbSchema, safeJsonLd } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"
import {
  termsCategoryHeaders,
  faqSectionTitle,
  faqSectionSubtitle,
  termsRowItem,
  termsRowHeader,
  termsRowIconBox,
  termsRowTitle,
  termsRowBody,
  termsBulletList,
} from "@/utils/styles"

export const metadata: Metadata = {
  title: `Refund & Cancellation Policy | ${SITE_CONFIG.name}`,
  description: `Refund, cancellation, and slot reallocation terms for free directory submissions and paid promotional sponsorships on ${SITE_CONFIG.name}.`,
  keywords: [
    "refund policy",
    "cancellation policy",
    "developer tool sponsorship refunds",
    "advertising terms",
    "free listing policy",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}${ROUTES.REFUND}`,
  },
  openGraph: {
    title: `Refund & Cancellation Policy | ${SITE_CONFIG.name}`,
    description: `Refund and cancellation terms for directory listings and paid sponsorships on ${SITE_CONFIG.name}.`,
    type: "website",
    url: `${SITE_CONFIG.url}${ROUTES.REFUND}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Refund Policy — ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Refund & Cancellation Policy | ${SITE_CONFIG.name}`,
    description: `Refund and cancellation terms for ${SITE_CONFIG.name}.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const REFUND_ICONS: Record<number, LucideIcon> = {
  1: CreditCard,
  2: CheckCircle2,
  3: Clock,
  4: ShieldAlert,
  5: AlertTriangle,
  6: Scale,
  7: Mail,
  8: ShieldCheck,
  9: HelpCircle,
}

const RefundPage = () => {
  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Refund Policy", url: `${SITE_CONFIG.url}${ROUTES.REFUND}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbsJsonLd) }}
      />

      <div className="relative flex min-h-full flex-col bg-slate-50/50">
        {/* Top Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 border-b border-dashed border-border bg-white px-6 py-3 text-xs font-medium text-slate-500 md:px-8"
        >
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="size-3" />
            Home
          </Link>
          <ChevronRight className="size-3 text-slate-400" />
          <span className="font-semibold text-slate-900">Refund Policy</span>
        </nav>

        {/* Page Header */}
        <PageHeader
          heading="Refund & Cancellation Policy"
          description={`Directory listings on ${SITE_CONFIG.name} are completely free. Paid sponsorships and promotional placements are digital services governed by our clear, good-faith cancellation policy.`}
          aiPrompt={AI_PROMPTS.refund}
          askAiLabel="ASK AI ABOUT REFUNDS"
          metrics={
            <div className="flex items-center gap-2">
              <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-700">
                UPDATED {REFUND_LAST_UPDATED.toUpperCase()}
              </span>
            </div>
          }
        />

        {/* Main Content Sections */}
        <div className="flex w-full flex-1 flex-col bg-white">
          {REFUND_CATEGORIES.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="flex flex-col"
            >
              {/* Category Header with Gradient and Dashed Border */}
              <div className={termsCategoryHeaders[category.headerThemeKey]}>
                <div className="flex items-center gap-2.5">
                  <h2 className={faqSectionTitle}>{category.title}</h2>
                </div>
                <p className={faqSectionSubtitle}>{category.description}</p>
              </div>

              {/* Refund Items */}
              <div className="flex flex-col">
                {category.items.map((item) => {
                  const Icon = REFUND_ICONS[item.number] ?? CreditCard

                  return (
                    <div
                      key={item.id}
                      id={item.id}
                      className={termsRowItem}
                    >
                      <div className={termsRowHeader}>
                        <span className={termsRowIconBox}>
                          <Icon className="size-3.5" />
                        </span>
                        <h3 className={termsRowTitle}>
                          {item.number}. {item.title}
                        </h3>
                      </div>

                      <div className={termsRowBody}>
                        <p>{item.content}</p>

                        {item.bulletPoints && item.bulletPoints.length > 0 && (
                          <ul className={termsBulletList}>
                            {item.bulletPoints.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}

          {/* Bottom Inquiries & Related Policies Bar */}
          <div className="flex flex-col gap-4 border-b border-dashed border-border bg-slate-50/50 px-6 py-8 md:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Billing Inquiries & Slot Management
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Have questions about an invoice, sponsorship reservation, or refund request?
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<a href={`mailto:${SITE_CONFIG.supportEmail}`} />}
                  className="text-xs"
                >
                  <Mail className="mr-1.5 size-3.5" />
                  Email Billing Support
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.PRICING} />}
                  className="text-xs"
                >
                  View Pricing
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.TERMS} />}
                  className="text-xs"
                >
                  Terms of Service
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.PRIVACY} />}
                  className="text-xs"
                >
                  Privacy Policy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RefundPage
