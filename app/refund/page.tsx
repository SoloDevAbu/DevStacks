import type { Metadata } from "next"
import Link from "next/link"
import { BadgeHelp, CheckCircle, Clock, AlertCircle, CreditCard, Mail } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { breadcrumbSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Refund, cancellation, and editorial review policies for paid verification and promotional listings on ${SITE_CONFIG.name}.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/refund`,
  },
}

const RefundPage = () => {
  const siteUrl = SITE_CONFIG.url
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Refund Policy", url: `${siteUrl}${ROUTES.REFUND}` },
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <div className="mx-auto max-w-4xl px-6 py-10 md:px-8">
        {/* Header */}
        <div className="flex flex-col gap-2 border-b border-dashed border-border pb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
              LEGAL & COMPLIANCE
            </span>
            <span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-700">
              UPDATED MARCH 2026
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Refund Policy
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Transparent refund and cancellation terms for developer tool submissions, verified check badges, and promotional boosts on {SITE_CONFIG.name}.
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-8 text-sm text-slate-600">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <BadgeHelp className="size-4 text-blue-600" />
              <h2 className="text-base font-bold sm:text-lg">1. Nature of Services</h2>
            </div>
            <p className="leading-relaxed">
              {SITE_CONFIG.name} provides digital visibility, algorithmic discovery boosts, verified check badges, and permanent SEO Do-Follow backlinks for developer tools, APIs, and software products. Because our verification and backlink services deliver immediate digital value upon publication, our policy is structured around the lifecycle of your submission.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <CheckCircle className="size-4 text-emerald-600" />
              <h2 className="text-base font-bold sm:text-lg">2. 100% Refund on Rejected Submissions</h2>
            </div>
            <p className="leading-relaxed">
              If you purchase a paid verification tier (such as Featured Builder) and our editorial team rejects your tool or product during review (e.g. if the submission fails our developer relevance criteria, contains malicious code, or is fundamentally broken), you will receive a <strong className="text-slate-800">100% full refund</strong> immediately without penalty.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Clock className="size-4 text-amber-600" />
              <h2 className="text-base font-bold sm:text-lg">3. Approved & Published Listings</h2>
            </div>
            <p className="leading-relaxed">
              Once your submission has been reviewed, approved, and published to the live directory—with its permanent Do-Follow SEO backlink and verified badge active—the digital service is deemed fully delivered and non-refundable.
            </p>
            <p className="leading-relaxed">
              However, if you experience a technical failure on our platform that prevents your approved listing from rendering or operating as described within 48 hours of purchase, contact us and we will promptly rectify the issue or issue a full refund.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <CreditCard className="size-4 text-indigo-600" />
              <h2 className="text-base font-bold sm:text-lg">4. Recurring Sponsorship Plans</h2>
            </div>
            <p className="leading-relaxed">
              For recurring sponsorship tiers (such as Ecosystem Partner):
            </p>
            <ul className="list-inside list-disc space-y-1.5 pl-2 leading-relaxed">
              <li>You may cancel your recurring plan at any time through your maker portal or by notifying our support team.</li>
              <li>Cancellations take effect at the conclusion of your current billing period; no future renewals will be charged.</li>
              <li>Renewal refund requests submitted within 7 days of an automatic renewal will be refunded on a prorated basis upon review.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <AlertCircle className="size-4 text-rose-600" />
              <h2 className="text-base font-bold sm:text-lg">5. How to Request Assistance or a Refund</h2>
            </div>
            <p className="leading-relaxed">
              Before disputing a charge with your card issuer, please reach out to our team. We are indie builders ourselves and resolve legitimate billing concerns swiftly and amicably.
            </p>
            <p className="leading-relaxed">
              To submit a refund inquiry, please provide:
            </p>
            <ul className="list-inside list-disc space-y-1 pl-2 text-xs font-mono text-slate-700">
              <li>Your tool or product name</li>
              <li>Submission URL or link</li>
              <li>Transaction ID or the email address used during payment</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-lg border border-dashed border-border bg-slate-50/50 p-5">
            <div className="flex items-center gap-2 text-slate-900">
              <Mail className="size-4 text-slate-700" />
              <h2 className="text-base font-bold">6. Support Contacts</h2>
            </div>
            <p className="leading-relaxed">
              Send refund requests and billing questions to:
            </p>
            <div className="font-mono text-xs text-slate-800">
              <p>Email: <a href="mailto:support@devstacks.io" className="text-blue-600 hover:underline">support@devstacks.io</a></p>
              <p>Response Time: Typically within 24–48 business hours</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default RefundPage
