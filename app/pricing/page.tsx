import type { Metadata } from "next"
import Link from "next/link"
import {
  Megaphone,
  Check,
  Sparkles,
  HelpCircle,
  ArrowRight,
} from "lucide-react"
import { XIcon } from "@/components/shared/icons"
import { PageHeader } from "@/components/shared/page-header"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HoverOutline } from "@/components/shared/hover-outline"
import { SITE_CONFIG, CREATOR_SOCIALS } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"

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

        {/* Sponsorship Card */}
        <div className="border-b border-dashed border-border bg-white px-6 py-10 md:px-10 md:py-16">
          <div className="group relative mx-auto flex max-w-3xl">
            <Card className="flex w-full flex-col justify-between rounded-xl border border-indigo-200 bg-linear-to-b from-indigo-50/30 via-white to-white p-6 shadow-sm md:p-8">
              <CardHeader className="p-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                      <Megaphone className="size-4" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-slate-900">
                        Sidebar Placement Sponsor
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-500">
                        Prime developer visibility across every page
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">
                    <Sparkles className="mr-1 size-3" /> Early Access
                  </Badge>
                </div>

                <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold tracking-tight text-indigo-950">
                      Custom Sponsorship
                    </span>
                    <span className="text-xs font-medium text-indigo-700">
                      Weekly & Monthly Slots
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-indigo-800/80">
                    Direct access to software engineers, technical founders, and
                    indie hackers evaluating new tools.
                  </p>
                </div>
              </CardHeader>

              <CardContent className="mt-6 flex-1 p-0">
                <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Sponsorship Highlights
                </div>
                <ul className="mt-3 space-y-3 text-xs text-slate-700">
                  <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Persistent Sidebar Visibility:</strong> Displayed
                      across tool directories, product showcases, and maker
                      profiles.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Direct Do-Follow Backlinks:</strong> Drive
                      high-intent traffic directly to your landing page or
                      sign-up flow.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Category Relevance:</strong> Option to sponsor
                      specific tech categories (AI, Backend, DevOps, DB).
                    </span>
                  </li>
                  {/* <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Transparent Metrics:</strong> Real-time click and impression tracking.
                    </span>
                  </li> */}
                </ul>
              </CardContent>

              <CardFooter className="mt-8 grid w-full grid-cols-1 gap-3 p-0 pb-6 sm:grid-cols-3 md:pb-8">
                <Button
                  className="w-full bg-slate-900 text-white shadow-sm hover:bg-slate-800"
                  nativeButton={false}
                  render={
                    <a
                      href={CREATOR_SOCIALS.x}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <XIcon className="mr-2 size-3.5 shrink-0" /> DM on X for
                  Placement
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<Link href={ROUTES.SHOWCASE} />}
                >
                  Add Product Free{" "}
                  <ArrowRight className="ml-1 size-3.5 shrink-0" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  nativeButton={false}
                  render={<Link href={ROUTES.SUBMIT} />}
                >
                  Add Tool Free{" "}
                  <ArrowRight className="ml-1 size-3.5 shrink-0" />
                </Button>
              </CardFooter>
            </Card>
            <HoverOutline />
          </div>
        </div>

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
