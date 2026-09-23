import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Database,
  Eye,
  Scale,
  Globe,
  Server,
  Share2,
  Clock,
  UserCheck,
  Lock,
  Cpu,
  Users,
  ShieldAlert,
  History,
  Mail,
  HelpCircle,
  type LucideIcon,
} from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import {
  PRIVACY_CATEGORIES,
  PRIVACY_LAST_UPDATED,
} from "@/constants/privacy"
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
  title: `Privacy Policy | ${SITE_CONFIG.name}`,
  description: `How ${SITE_CONFIG.name} collects, protects, and handles personal data for developers, creators, and autonomous AI agents. Compliant with GDPR and India's DPDP Act.`,
  keywords: [
    "privacy policy",
    "developer data protection",
    "GDPR compliance",
    "DPDP compliance",
    "AI agent privacy",
    "data controller",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}${ROUTES.PRIVACY}`,
  },
  openGraph: {
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description: `How ${SITE_CONFIG.name} collects, protects, and handles data for developers and autonomous AI agents.`,
    type: "website",
    url: `${SITE_CONFIG.url}${ROUTES.PRIVACY}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Privacy Policy — ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Privacy Policy | ${SITE_CONFIG.name}`,
    description: `How ${SITE_CONFIG.name} collects and protects developer data.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const PRIVACY_ICONS: Record<number, LucideIcon> = {
  1: ShieldCheck,
  2: Database,
  3: Eye,
  4: Scale,
  5: Globe,
  6: Server,
  7: Share2,
  8: Clock,
  9: UserCheck,
  10: Lock,
  11: Cpu,
  12: Users,
  13: ShieldAlert,
  14: History,
  15: Mail,
}

const PrivacyPage = () => {
  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Privacy Policy", url: `${SITE_CONFIG.url}${ROUTES.PRIVACY}` },
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
          <span className="font-semibold text-slate-900">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <PageHeader
          heading="Privacy Policy"
          description={`How ${SITE_CONFIG.name} collects, uses, shares, and protects your personal data — and your rights under GDPR, India's DPDP Act, and international data protection laws.`}
          aiPrompt={AI_PROMPTS.privacy}
          askAiLabel="ASK AI ABOUT PRIVACY"
          metrics={
            <div className="flex items-center gap-2">
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                UPDATED {PRIVACY_LAST_UPDATED.toUpperCase()}
              </span>
            </div>
          }
        />

        {/* Main Content Sections */}
        <div className="flex w-full flex-1 flex-col bg-white">
          {PRIVACY_CATEGORIES.map((category) => (
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

              {/* Privacy Items */}
              <div className="flex flex-col">
                {category.items.map((item) => {
                  const Icon = PRIVACY_ICONS[item.number] ?? ShieldCheck

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
                  Data Protection & Privacy Inquiries
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Wish to submit a data deletion request, export your account data, or ask privacy questions?
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
                  Email Data Team
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

export default PrivacyPage
