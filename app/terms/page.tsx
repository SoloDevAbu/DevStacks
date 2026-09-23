import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Layers,
  Network,
  MessageSquare,
  Award,
  Globe,
  Cpu,
  ShieldCheck,
  Server,
  ExternalLink,
  AlertTriangle,
  Scale,
  Shield,
  UserX,
  History,
  Gavel,
  Mail,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  TERMS_CATEGORIES,
  TERMS_LAST_UPDATED,
} from "@/constants/terms"
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
  title: `Terms of Service | ${SITE_CONFIG.name}`,
  description: `Terms and conditions governing your use of ${SITE_CONFIG.name} — directory listings, live launch voting, 'Built With' graphs, sponsorships, and AI agent protocols.`,
  keywords: [
    "terms of service",
    "directory terms",
    "developer tools platform terms",
    "submission guidelines",
    "launch ranking rules",
    "developer ecosystem terms",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}${ROUTES.TERMS}`,
  },
  openGraph: {
    title: `Terms of Service | ${SITE_CONFIG.name}`,
    description: `Terms and conditions governing the use of ${SITE_CONFIG.name} — directory listings, community rankings, and AI agent protocols.`,
    type: "website",
    url: `${SITE_CONFIG.url}${ROUTES.TERMS}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Terms of Service — ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Terms of Service | ${SITE_CONFIG.name}`,
    description: `Terms and conditions governing the use of ${SITE_CONFIG.name}.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const TERM_ICONS: Record<number, LucideIcon> = {
  1: FileText,
  2: UserCheck,
  3: ShieldAlert,
  4: Sparkles,
  5: Layers,
  6: Network,
  7: MessageSquare,
  8: Award,
  9: Globe,
  10: Cpu,
  11: ShieldCheck,
  12: Server,
  13: ExternalLink,
  14: AlertTriangle,
  15: Scale,
  16: Shield,
  17: UserX,
  18: History,
  19: Gavel,
  20: Mail,
}

const TermsPage = () => {
  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Terms of Service", url: `${SITE_CONFIG.url}${ROUTES.TERMS}` },
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
          <span className="font-semibold text-slate-900">Terms of Service</span>
        </nav>

        {/* Page Header */}
        <PageHeader
          heading="Terms of Service"
          description={`The terms that govern your use of ${SITE_CONFIG.name} — directory listings, sponsorships, AI agent access, and all platform features.`}
          aiPrompt={AI_PROMPTS.terms}
          askAiLabel={`ASK AI ABOUT TERMS`}
          metrics={
            <div className="flex items-center gap-2">
              <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
                UPDATED {TERMS_LAST_UPDATED.toUpperCase()}
              </span>
            </div>
          }
        />

        {/* Main Content Sections */}
        <div className="flex w-full flex-1 flex-col bg-white">
          {TERMS_CATEGORIES.map((category) => (
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

              {/* Terms Items */}
              <div className="flex flex-col">
                {category.items.map((item) => {
                  const Icon = TERM_ICONS[item.number] ?? FileText

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
                  Questions about our Terms?
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Need clarification on directory guidelines, API access, or sponsorships? Contact our team.
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
                  Email Support
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
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.REFUND} />}
                  className="text-xs"
                >
                  Refund Policy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.FAQ} />}
                  className="text-xs"
                >
                  <HelpCircle className="mr-1.5 size-3.5" />
                  View FAQs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TermsPage
