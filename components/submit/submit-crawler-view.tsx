import Link from "next/link"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Globe,
  Sparkles,
  Layers,
  Cpu,
  Package,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Code2,
  Terminal,
  ShieldCheck,
  Search,
  Share2,
} from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { AI_PROMPTS } from "@/lib/prompts"
import { LAUNCH_PROMO } from "@/constants/promo"
import {
  SUBMISSION_BENEFITS,
  LAUNCH_TRACKS,
  SUBMISSION_STEPS,
  SUBMISSION_FAQS,
} from "@/constants/submit"
import {
  launchPromoCard,
  launchPromoCardList,
  launchPromoCardItem,
  launchPromoBadge,
  crawlerTrackCard,
  crawlerTrackHeader,
  crawlerTrackPerkItem,
} from "@/utils/styles"

export const SubmitCrawlerView = () => {
  const productTrack = LAUNCH_TRACKS.product
  const toolTrack = LAUNCH_TRACKS.tool

  return (
    <div className="relative flex min-h-full flex-col bg-slate-50/50">
      <PageHeader
        heading="Launch a Product or Developer Tool"
        description={`List your software application, SaaS, developer tool, or API on ${SITE_CONFIG.name}. Gain high-authority organic backlinks, permanent AI engine indexing (/llms.txt), and reach thousands of active software engineers.`}
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
                    Submit your product or developer tool today and receive an
                    automatic upgrade to Verified Premium status (
                    {LAUNCH_PROMO.VALUE_GIFTED} value) upon approval.
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
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-indigo-200 bg-indigo-50/70 text-[11px] font-semibold text-indigo-700"
              >
                Two Launch Tracks
              </Badge>
              <span className="text-xs text-slate-500">
                Choose the format that fits your software
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Submit Products & Developer Tools on {SITE_CONFIG.name}
            </h2>
            <p className="max-w-3xl text-xs leading-relaxed text-slate-600">
              {SITE_CONFIG.name} accepts both end-user software products and
              developer building blocks. Each submission track includes tailored
              fields, specialized structured data schema, and relational
              indexing in our &ldquo;Built With&rdquo; tech stack graph.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <article className={crawlerTrackCard}>
              <div className="flex flex-col gap-4">
                <div className={crawlerTrackHeader}>
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-700 shadow-2xs">
                      <Package className="size-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {productTrack.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-blue-200 bg-blue-50/80 text-[10px] font-medium text-blue-700"
                        >
                          {productTrack.badge}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {productTrack.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-dashed border-blue-100 bg-blue-50/30 p-3">
                  <span className="text-[11px] font-semibold text-blue-900 uppercase">
                    Accepted Software Formats
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {productTrack.forWhom}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold tracking-wide text-slate-900 uppercase">
                    Key Launch Features & Distribution
                  </span>
                  <ul className="flex flex-col gap-2">
                    {productTrack.keyFeatures.map((feat, idx) => (
                      <li key={idx} className={crawlerTrackPerkItem}>
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 border-t border-dashed border-border pt-2">
                  <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                    Required & Optional Fields Collected
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {productTrack.fields.map((f, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-dashed border-border pt-4">
                <p className="text-[11px] text-slate-500">
                  Ready to launch your SaaS or application?
                </p>
                <Button
                  render={<Link href="/?redirect=/submit?type=product" />}
                  size="sm"
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Package className="size-3.5" />
                  Launch Product
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </article>

            <article className={crawlerTrackCard}>
              <div className="flex flex-col gap-4">
                <div className={crawlerTrackHeader}>
                  <div className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 shadow-2xs">
                      <Wrench className="size-5" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900">
                          {toolTrack.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="border-indigo-200 bg-indigo-50/80 text-[10px] font-medium text-indigo-700"
                        >
                          {toolTrack.badge}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {toolTrack.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 rounded-lg border border-dashed border-indigo-100 bg-indigo-50/30 p-3">
                  <span className="text-[11px] font-semibold text-indigo-900 uppercase">
                    Accepted Developer Formats
                  </span>
                  <p className="text-xs leading-relaxed text-slate-600">
                    {toolTrack.forWhom}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold tracking-wide text-slate-900 uppercase">
                    Key Launch Features & Distribution
                  </span>
                  <ul className="flex flex-col gap-2">
                    {toolTrack.keyFeatures.map((feat, idx) => (
                      <li key={idx} className={crawlerTrackPerkItem}>
                        <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-indigo-600" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-2 border-t border-dashed border-border pt-2">
                  <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                    Required & Optional Fields Collected
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {toolTrack.fields.map((f, idx) => (
                      <span
                        key={idx}
                        className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-dashed border-border pt-4">
                <p className="text-[11px] text-slate-500">
                  Ready to launch your dev tool or API?
                </p>
                <Button
                  render={<Link href="/?redirect=/submit?type=tool" />}
                  size="sm"
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Wrench className="size-3.5" />
                  Launch Dev Tool
                  <ArrowRight className="size-3" />
                </Button>
              </div>
            </article>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Why Launch on {SITE_CONFIG.name}?
            </h2>
            <p className="text-xs text-slate-500">
              Engineered for perpetual organic discovery across search engines,
              AI crawlers, and developer communities.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SUBMISSION_BENEFITS.map((b) => (
              <Card
                key={b.title}
                className="rounded-xl border-dashed border-border bg-white shadow-2xs"
              >
                <CardContent className="flex flex-col gap-2 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-600">
                      <b.icon className="size-4" />
                    </span>
                    <h3 className="text-xs leading-snug font-bold text-slate-900">
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

        <section className="flex flex-col gap-4 rounded-xl border border-dashed border-border bg-white p-6 md:p-7">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-bold text-slate-900">
              The 4-Step Submission Process
            </h2>
            <p className="text-xs text-slate-500">
              Our unified submission workflow takes less than 3 minutes to
              complete.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-4">
            {SUBMISSION_STEPS.map((s) => (
              <div
                key={s.step}
                className="flex flex-col gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-6 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white">
                    {s.step}
                  </span>
                  <s.icon className="size-4 text-slate-500" />
                </div>
                <h3 className="mt-1 text-xs font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  {s.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 rounded-lg border border-dashed border-amber-200/80 bg-amber-50/30 p-4">
            <div className="flex items-center gap-2 text-amber-900">
              <ShieldCheck className="size-4 shrink-0 text-amber-600" />
              <h4 className="text-xs font-bold">
                Quality Review &amp; Moderation Standards
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Every product and developer tool submitted to {SITE_CONFIG.name}{" "}
              undergoes editorial verification. We confirm that official URLs
              are functional, descriptions accurately represent the technical
              capabilities, pricing tiers are transparent, and software is free
              of deceptive redirect patterns. Submissions are typically reviewed
              and approved within 12 to 24 hours.
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500">
              Everything search engines, AI crawlers, and creators need to know
              about submitting to {SITE_CONFIG.name}.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-dashed divide-border overflow-hidden rounded-xl border border-dashed border-border bg-white shadow-2xs">
            {SUBMISSION_FAQS.map((faq, i) => (
              <div
                key={i}
                className="flex flex-col gap-2 p-5 transition-colors hover:bg-slate-50/50 sm:p-6"
              >
                <h3 className="text-xs font-bold tracking-wide text-slate-900 uppercase sm:text-sm">
                  {faq.question}
                </h3>
                <p className="max-w-4xl text-xs leading-relaxed whitespace-pre-line text-slate-600 sm:text-sm">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center justify-between gap-5 rounded-xl border border-dashed border-slate-300 bg-white p-6 shadow-xs sm:flex-row sm:p-8">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-slate-900">
              Ready to Launch Your Software on {SITE_CONFIG.name}?
            </h3>
            <p className="max-w-xl text-xs leading-relaxed text-slate-600">
              Join thousands of developers, founders, and creators. List your
              product or developer tool today to earn permanent high-authority
              backlinks and generative AI discovery.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Button
              render={<Link href="/?redirect=/submit?type=product" />}
              className="text-xs font-semibold"
            >
              <Package className="mr-1.5 size-3.5" />
              Launch Product
            </Button>
            <Button
              variant="outline"
              render={<Link href="/?redirect=/submit?type=tool" />}
              className="text-xs font-semibold"
            >
              <Wrench className="mr-1.5 size-3.5" />
              Launch Dev Tool
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
