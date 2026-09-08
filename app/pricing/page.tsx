import type { Metadata } from "next"
import Link from "next/link"
import { Check, Sparkles, ShieldCheck, Zap, HelpCircle } from "lucide-react"
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
import { PLANS, TIER } from "@/constants/plans"
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema"
import { AI_PROMPTS } from "@/lib/prompts"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pricing & Sponsorship Plans — Boost Your Developer Tool",
  description: `Promote your developer tool or product to thousands of software engineers, indie hackers, and tech leads on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/pricing`,
  },
  openGraph: {
    title: `Pricing & Sponsorship Plans | ${SITE_CONFIG.name}`,
    description:
      "Promote your developer tool or product to thousands of software engineers, indie hackers, and tech leads.",
    type: "website",
    url: `${SITE_CONFIG.url}/pricing`,
    images: [
      {
        url: `${SITE_CONFIG.url}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Pricing & Sponsorship Plans | DevStacks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Pricing & Sponsorship Plans | ${SITE_CONFIG.name}`,
    description:
      "Promote your developer tool or product to thousands of software engineers, indie hackers, and tech leads.",
    images: [`${SITE_CONFIG.url}/twitter-image`],
  },
}

const FAQ_ITEMS = [
  {
    question: "What is a Do-Follow link and why does it matter?",
    answer:
      "Do-Follow links pass search engine authority directly to your domain, enhancing your domain rating and organic search rank for high-intent developer keywords.",
  },
  {
    question: "How fast is my tool or product reviewed?",
    answer:
      "Standard community submissions are reviewed within 48 to 72 hours. Featured and Partner tier submissions receive expedited verification within 12 hours.",
  },
  {
    question: "Can I upgrade an existing free submission?",
    answer:
      "Yes! You can upgrade your listing at any time to add verified badges, do-follow links, and featured placement.",
  },
  {
    question: "What is the 7-day discovery window?",
    answer:
      "Every new approved tool or product receives an algorithmic boost in the 'New & Rising' feed during its first 7 days, giving early momentum before graduating into the general index.",
  },
]

const PricingPage = () => {
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_CONFIG.url },
    { name: "Pricing", url: `${SITE_CONFIG.url}/pricing` },
  ])

  const faqJsonLd = faqSchema(FAQ_ITEMS)

  const planList = [
    PLANS[TIER.FREE],
    PLANS[TIER.PREMIUM],
    PLANS[TIER.PREMIUM_PLUS],
  ]

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
          heading="💎 Sponsorship & Listing Plans"
          description="Amplify your reach across the developer community. Guaranteed visibility, verified badges, and high-authority backlinks."
          aiPrompt={AI_PROMPTS.pricing}
        />

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-6 border-b border-dashed border-border bg-white p-6 md:p-10 lg:grid-cols-3">
          {planList.map((plan) => (
            <div key={plan.id} className="group relative flex">
              <Card
                className={cn(
                  "flex w-full flex-col justify-between rounded-xl border p-6 transition-all",
                  plan.popular
                    ? "border-indigo-600 bg-indigo-50/20 shadow-md ring-1 ring-indigo-600"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-slate-900">
                      {plan.name}
                    </CardTitle>
                    {plan.popular ? (
                      <Badge className="bg-indigo-600 text-white hover:bg-indigo-700">
                        <Sparkles className="mr-1 size-3" /> Most Popular
                      </Badge>
                    ) : (
                      <Badge variant="outline" className={plan.badgeClass}>
                        {plan.badgeLabel}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="mt-2 text-xs leading-relaxed text-slate-500">
                    {plan.tagline}
                  </CardDescription>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                      {plan.price}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      / {plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="mt-6 flex-1 p-0">
                  <div className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                    What&apos;s included
                  </div>
                  <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="size-4 shrink-0 text-emerald-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter className="mt-8 p-0">
                  <Button
                    className={cn(
                      "w-full rounded-lg text-xs font-semibold transition-colors",
                      plan.popular
                        ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                        : "bg-slate-900 text-white hover:bg-slate-800"
                    )}
                    nativeButton={false}
                    render={<Link href={plan.ctaHref} />}
                  >
                    {plan.ctaText}
                  </Button>
                </CardFooter>
              </Card>
              <HoverOutline />
            </div>
          ))}
        </div>

        {/* Feature Comparison Highlights */}
        <div className="grid grid-cols-1 gap-6 border-b border-dashed border-border bg-slate-50/50 p-6 sm:grid-cols-3 md:p-8">
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Do-Follow Backlinks
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Premium listings receive permanent, high-authority do-follow
                links to boost your search domain rating.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Zap className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Instant AI & LLM Indexing
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Partner listings are prioritized in our llms.txt endpoints
                consumed by Claude, ChatGPT, and developer agents.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Verified Badges
              </h4>
              <p className="mt-1 text-xs text-slate-500">
                Stand out with verified checkmarks and gold shimmer badges to
                establish developer trust immediately.
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
