import type { Metadata } from "next"
import Link from "next/link"
import {
  HelpCircle,
  ChevronRight,
  ArrowLeft,
  PlusCircle,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/shared/page-header"
import { FAQ_CATEGORIES, LAUNCHNESTS_FAQS } from "@/constants/faqs"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import {
  faqCategoryHeaders,
  faqSectionTitle,
  faqSectionSubtitle,
  faqRowItem,
  faqRowHeader,
  faqRowIconBox,
  faqRowQuestion,
  faqRowAnswer,
} from "@/utils/styles"

export const metadata: Metadata = {
  title: `Frequently Asked Questions — ${SITE_CONFIG.name}`,
  description: `Answers to common questions about ${SITE_CONFIG.name}, developer tool submissions, community rankings, sponsorship, and autonomous AI search indexing.`,
  keywords: [
    "FAQ",
    "frequently asked questions",
    "developer tools FAQ",
    "how LaunchNests works",
    "tech stack directory FAQ",
    "dev tools sponsorship",
    "AI agent discoverability",
    "AEO dev tools",
    "Model Context Protocol FAQ",
    ...SITE_CONFIG.keywords,
  ],
  alternates: {
    canonical: `${SITE_CONFIG.url}${ROUTES.FAQ}`,
  },
  openGraph: {
    title: `Frequently Asked Questions | ${SITE_CONFIG.name}`,
    description: `Answers to common questions about ${SITE_CONFIG.name}, developer tool submissions, rankings, and AI search indexing.`,
    type: "website",
    url: `${SITE_CONFIG.url}${ROUTES.FAQ}`,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `Frequently Asked Questions — ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Frequently Asked Questions | ${SITE_CONFIG.name}`,
    description: `Answers to common questions about ${SITE_CONFIG.name}, developer tool submissions, and the tech stack directory.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const FaqPage = () => {
  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "FAQs", url: `${SITE_CONFIG.url}${ROUTES.FAQ}` },
  ])
  const faqJsonLd = faqSchema(LAUNCHNESTS_FAQS)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
          <span className="font-semibold text-slate-900">FAQs</span>
        </nav>

        {/* Page Header with Ask AI prompt */}
        <PageHeader
          heading="Frequently Asked Questions"
          description={`Everything you need to know about ${SITE_CONFIG.name}, developer tool submissions, community rankings, sponsorship, and machine-readable agent protocols.`}
          aiPrompt={AI_PROMPTS.faq}
          askAiLabel={`ASK AI ABOUT ${SITE_CONFIG.name.toUpperCase()}`}
        />

        {/* Main Content Sections */}
        <div className="flex w-full flex-1 flex-col bg-white">
          {FAQ_CATEGORIES.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="flex flex-col"
            >
              {/* Category Section Header with Gradient and Dashed Border */}
              <div className={faqCategoryHeaders[category.headerThemeKey]}>
                <div className="flex items-center gap-2.5">
                  <h2 className={faqSectionTitle}>{category.title}</h2>
                </div>

                <p className={faqSectionSubtitle}>{category.description}</p>
              </div>

              {/* Questions List, each separated by dashed border */}
              <div className="flex flex-col">
                {category.items.map((faq) => (
                  <div key={faq.question} className={faqRowItem}>
                    <div className={faqRowHeader}>
                      <span className={faqRowIconBox}>
                        <HelpCircle className="size-3.5" />
                      </span>
                      <h3 className={faqRowQuestion}>{faq.question}</h3>
                    </div>
                    <div className={faqRowAnswer}>{faq.answer}</div>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Bottom Help & Contact Bar */}
          <div className="flex flex-col gap-4 border-b border-dashed border-border bg-slate-50/50 px-6 py-8 md:px-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Still have questions?
                </h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Can&apos;t find what you&apos;re looking for? List your tool
                  or reach out to our team directly.
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2.5">
                <Button
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.SUBMIT} />}
                  className="text-xs"
                >
                  <PlusCircle className="mr-1.5 size-3.5" />
                  Submit a Tool
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={ROUTES.PRICING} />}
                  className="text-xs"
                >
                  View Sponsorships
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  nativeButton={false}
                  render={<a href="mailto:support@launchnests.com" />}
                  className="text-xs text-slate-600 hover:text-slate-900"
                >
                  <Mail className="mr-1.5 size-3.5" />
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FaqPage
