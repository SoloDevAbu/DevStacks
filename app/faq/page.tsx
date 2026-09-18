import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { HelpCircle, ChevronRight, ArrowLeft, Sparkles, MessageCircleQuestion, PlusCircle, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HoverOutline } from "@/components/shared/hover-outline"
import { LAUNCHNESTS_FAQS } from "@/constants/faqs"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROVIDERS } from "@/constants/ai-providers"
import { AI_PROMPTS } from "@/lib/prompts"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { footerAiButton, footerAiTrayLabel } from "@/utils/styles"

export const metadata: Metadata = {
  title: `Frequently Asked Questions — ${SITE_CONFIG.name}`,
  description: `Answers to common questions about ${SITE_CONFIG.name}, developer tool rankings, the tech stack directory, submissions, and autonomous AI search indexing.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}${ROUTES.FAQ}`,
  },
  openGraph: {
    title: `Frequently Asked Questions — ${SITE_CONFIG.name}`,
    description: `Answers to common questions about ${SITE_CONFIG.name}, developer tool rankings, the tech stack directory, and AI answer engine discoverability.`,
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
    title: `Frequently Asked Questions — ${SITE_CONFIG.name}`,
    description: `Answers to common questions about ${SITE_CONFIG.name}, developer tool rankings, and the tech stack directory.`,
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const FaqPage = () => {
  const siteUrl = SITE_CONFIG.url
  const breadcrumbsJsonLd = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "FAQs", url: `${siteUrl}${ROUTES.FAQ}` },
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

      <div className="flex min-h-screen flex-col bg-slate-50/50">
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

        {/* Hero Header */}
        <div className="border-b border-dashed border-border bg-linear-to-b from-slate-50/80 via-white to-white px-6 py-10 md:px-8 md:py-14">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
                Knowledge Base
              </span>
              <Badge
                variant="outline"
                className="border-dashed border-indigo-200 bg-indigo-50/80 font-mono text-[10px] font-bold text-indigo-700"
              >
                Updated 2026
              </Badge>
            </div>
            <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-600 md:text-sm">
              Everything you need to know about {SITE_CONFIG.name}, how developer tools and products are ranked, the "Built With" architectural graph, and our machine-readable protocol for AI agents.
            </p>

            {/* Ask AI Sub-tray */}
            <div className="mt-8 flex flex-col gap-3 rounded-lg border border-dashed border-border bg-slate-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex shrink-0 items-center gap-2">
                <Sparkles className="size-3.5 text-blue-600" />
                <span className={footerAiTrayLabel}>
                  Ask AI about {SITE_CONFIG.name}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                {AI_PROVIDERS.map((ai) => (
                  <div key={ai.id} className="group/btn relative inline-flex">
                    <a
                      href={`${ai.url}${encodeURIComponent(AI_PROMPTS.home)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerAiButton}
                      title={`Ask ${ai.name} about ${SITE_CONFIG.name}`}
                    >
                      <Image
                        src={ai.icon}
                        alt={ai.name}
                        width={14}
                        height={14}
                        className="object-contain mix-blend-multiply"
                      />
                      <span className="text-xs font-medium text-slate-700 transition-colors group-hover/btn:text-slate-950">
                        {ai.name}
                      </span>
                    </a>
                    <HoverOutline />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Cards Grid */}
        <div className="mx-auto w-full max-w-4xl px-6 py-10 md:px-8 md:py-14">
          <div className="flex flex-col gap-5">
            {LAUNCHNESTS_FAQS.map((faq, index) => (
              <Card
                key={faq.question}
                className="overflow-hidden border border-dashed border-border bg-white transition-all hover:border-slate-300"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 font-mono text-[11px] font-bold text-slate-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <CardTitle className="text-base font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0 pl-14 text-sm leading-relaxed text-slate-600">
                  {faq.answer}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom Help CTA */}
          <Card className="mt-12 border border-dashed border-border bg-slate-900 text-white">
            <CardContent className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row sm:p-8">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-base font-bold">Still have questions?</h3>
                <p className="text-xs text-slate-400">
                  Can&apos;t find what you&apos;re looking for? Reach out to our team or list your tool directly.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  className="cursor-pointer bg-white text-xs font-semibold text-slate-900 shadow-xs hover:bg-slate-100"
                  render={<Link href={ROUTES.SUBMIT} />}
                >
                  <PlusCircle className="mr-1.5 size-3.5" />
                  List a Tool
                </Button>
                <Button
                  variant="outline"
                  className="cursor-pointer border-slate-700 bg-transparent text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white"
                  render={<a href="mailto:support@launchnests.com" />}
                >
                  <Mail className="mr-1.5 size-3.5 text-slate-400" />
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default FaqPage
