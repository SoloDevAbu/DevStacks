import type { Metadata } from "next"
import Link from "next/link"
import {
  Megaphone,
  Check,
  Sparkles,
  HelpCircle,
  Mail,
  ArrowRight,
  MousePointerClick,
  Layers,
  ShieldCheck,
} from "lucide-react"
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
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"

export const metadata: Metadata = {
  title: "Sidebar Sponsorship & Advertising — DevStacks",
  description: `Promote your developer tool, API, or infrastructure with dedicated sidebar ad placements reaching thousands of engineers on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/pricing`,
  },
  openGraph: {
    title: `Sidebar Sponsorship & Advertising | ${SITE_CONFIG.name}`,
    description:
      "Promote your developer tool or API with high-visibility sidebar ad placements across DevStacks.",
    type: "website",
    url: `${SITE_CONFIG.url}/pricing`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sidebar Advertising | DevStacks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Sidebar Sponsorship & Advertising | ${SITE_CONFIG.name}`,
    description:
      "Promote your developer tool or API with high-visibility sidebar ad placements across DevStacks.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const FAQ_ITEMS = [
  {
    question: "How much does directory submission cost?",
    answer:
      "Submitting developer tools and products to DevStacks is 100% free. Every approved submission is indexed in our public directory with full searchability.",
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
      "Click the inquiry button below to reach out to our sponsorships team. Slots are allocated on a weekly or monthly basis with category exclusivity options.",
  },
]

const PricingPage = () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Advertising", url: `${SITE_CONFIG.url}/pricing` },
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

        {/* Sponsorship Grid */}
        <div className="grid grid-cols-1 gap-8 border-b border-dashed border-border bg-white p-6 md:p-10 lg:grid-cols-12">
          {/* Main Sponsorship Offer Card */}
          <div className="group relative flex lg:col-span-7">
            <Card className="flex w-full flex-col justify-between rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50/30 via-white to-white p-6 shadow-sm md:p-8">
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
                    Direct access to software engineers, technical founders, and indie hackers evaluating new tools.
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
                      <strong>Persistent Sidebar Visibility:</strong> Displayed across tool directories, product showcases, and maker profiles.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Direct Do-Follow Backlinks:</strong> Drive high-intent traffic directly to your landing page or sign-up flow.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Category Relevance:</strong> Option to sponsor specific tech categories (AI, Backend, DevOps, DB).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="size-4 shrink-0 text-indigo-600" />
                    <span>
                      <strong>Transparent Metrics:</strong> Real-time click and impression tracking.
                    </span>
                  </li>
                </ul>
              </CardContent>

              <CardFooter className="mt-8 flex flex-col gap-3 p-0 sm:flex-row">
                <Button
                  className="w-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 sm:w-auto"
                  nativeButton={false}
                  render={
                    <a
                      href="mailto:sponsor@devstacks.io?subject=Sidebar%20Ad%20Placement%20Inquiry"
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <Mail className="mr-2 size-4" /> Inquire for Placement
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto"
                  nativeButton={false}
                  render={<Link href={ROUTES.SUBMIT} />}
                >
                  Add Your Tool Free <ArrowRight className="ml-1 size-3.5" />
                </Button>
              </CardFooter>
            </Card>
            <HoverOutline />
          </div>

          {/* Sidebar Preview Box */}
          <div className="flex flex-col justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-6 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <Layers className="size-3.5 text-slate-400" /> Live Sidebar Preview
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Here is an example of how your brand appears on the left/right rails:
              </p>

              {/* Mock Ad Card */}
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px] font-medium text-slate-500">
                    Sponsored
                  </Badge>
                  <span className="text-[11px] text-slate-400">devstacks.io/ad</span>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-bold text-indigo-700 text-sm">
                    🚀
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">Your Developer Tool</h5>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">
                      The fastest way to deploy, monitor, and scale your backend APIs.
                    </p>
                  </div>
                </div>
                <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-medium text-indigo-600">
                    Try for free →
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <MousePointerClick className="size-3" /> High CTR
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="size-4 text-emerald-600" /> Free Submissions
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Listing your developer tool or product on DevStacks is completely free with no hidden fees or tier barriers.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="flex flex-col bg-white p-6 md:p-10">
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

