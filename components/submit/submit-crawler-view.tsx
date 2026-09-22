import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Sparkles, CheckCircle2, Layers, Cpu } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { AI_PROMPTS } from "@/lib/prompts"
import { LAUNCH_PROMO } from "@/constants/promo"
import {
  launchPromoCard,
  launchPromoCardList,
  launchPromoCardItem,
  launchPromoBadge,
} from "@/utils/styles"
import Link from "next/link"

const SUBMISSION_BENEFITS = [
  {
    icon: Globe,
    title: "High-Authority Organic SEO",
    description:
      "Permanent directory listing with verified meta tags, structured SoftwareApplication schema, and category indexes.",
  },
  {
    icon: Sparkles,
    title: "AEO & GEO Optimization",
    description:
      "Automatic inclusion in /llms.txt and /llms-full.txt, ensuring ChatGPT, Claude, and Perplexity understand and recommend your tool.",
  },
  {
    icon: Layers,
    title: "Built With Tech-Stack Graph",
    description:
      "Link your product to the developer tools it was built with, gaining cross-discovery from tool detail pages.",
  },
  {
    icon: Cpu,
    title: "This Week's Launches",
    description:
      "Every new submission features in This Week's Launches on the homepage, ranked directly by community votes.",
  },
]

export const SubmitCrawlerView = () => {
  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Submit a Developer Tool or Product"
        description={`List your developer tool, API, or infrastructure product on ${SITE_CONFIG.name}. Gain discoverability across search engines, AI answer engines, and the developer community.`}
        aiPrompt={AI_PROMPTS.submit}
      />

      <div className="flex flex-col gap-8 p-6 md:p-8">
        {LAUNCH_PROMO.IS_ACTIVE && (
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
                    Submit your tool today and receive an automatic upgrade to
                    Verified Premium status ({LAUNCH_PROMO.VALUE_GIFTED} value)
                    upon approval.
                  </p>
                </div>
              </div>
              <Badge variant="outline" className={launchPromoBadge}>
                {LAUNCH_PROMO.BADGE_LABEL}
              </Badge>
            </div>
            <div className={launchPromoCardList}>
              {LAUNCH_PROMO.PERKS.map((perk, i) => (
                <div key={i} className={launchPromoCardItem}>
                  <CheckCircle2 className="size-3.5 shrink-0 text-emerald-600" />
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-slate-900">
            Why List Your Product on {SITE_CONFIG.name}?
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {SUBMISSION_BENEFITS.map((b) => (
              <Card
                key={b.title}
                className="rounded-none border-dashed bg-white"
              >
                <CardContent className="flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <b.icon className="size-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      {b.title}
                    </h3>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {b.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-white p-6">
          <h2 className="text-base font-bold text-slate-900">
            Developer Submission Guidelines
          </h2>
          <ul className="list-disc space-y-2.5 pl-5 text-xs leading-relaxed text-slate-600">
            <li>
              <strong>Required Information:</strong> Provide your product name,
              catchy tagline, official website URL, full description, and
              pricing model.
            </li>
            <li>
              <strong>Product Showcase & Deep Dive (Optional):</strong> Detail
              the specific problem your tool solves, architectural solution,
              unique advantages, target use cases, categories, tags, supported
              platforms, media gallery, demo video, and social channels.
            </li>
            <li>
              <strong>SEO, GEO & AI Discoverability (Metadata Only):</strong>{" "}
              Specify search keywords, target audience personas, geographical
              targeting (GEO), directory categories (ASO), SERP meta tags, and
              an AI Context prompt for LLM answer engines (ChatGPT, Claude,
              Perplexity). This data is machine-readable and not displayed on
              your public product page.
            </li>
          </ul>

          <div className="mt-4 flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
            <p className="text-xs text-slate-500">
              Ready to submit your developer tool? Sign in with your Google
              account.
            </p>
            <Button
              render={<Link href="/?redirect=/submit" />}
              className="text-xs"
            >
              Sign in to Submit
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
