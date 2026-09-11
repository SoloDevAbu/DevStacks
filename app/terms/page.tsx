import type { Metadata } from "next"
import Link from "next/link"
import { FileText, CheckCircle2, ShieldAlert, Cpu, Award, HelpCircle } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { breadcrumbSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms and conditions governing use of ${SITE_CONFIG.name}, directory submissions, community rankings, and promotional services.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
}

const TermsPage = () => {
  const siteUrl = SITE_CONFIG.url
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Terms of Service", url: `${siteUrl}${ROUTES.TERMS}` },
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
            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-bold text-blue-700">
              UPDATED MARCH 2026
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Terms of Service
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            Please read these terms carefully before using {SITE_CONFIG.name}, submitting products, or accessing our developer APIs and machine-readable surfaces.
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-8 text-sm text-slate-600">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <FileText className="size-4 text-blue-600" />
              <h2 className="text-base font-bold sm:text-lg">1. Agreement to Terms</h2>
            </div>
            <p className="leading-relaxed">
              By accessing or using {SITE_CONFIG.name} (including our website, REST API, Model Context Protocol server, and related feeds), you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <CheckCircle2 className="size-4 text-emerald-600" />
              <h2 className="text-base font-bold sm:text-lg">2. Submissions & Directory Listings</h2>
            </div>
            <p className="leading-relaxed">
              When listing a developer tool, software product, or project on {SITE_CONFIG.name}:
            </p>
            <ul className="list-inside list-disc space-y-1.5 pl-2 leading-relaxed">
              <li>You warrant that you own or are an authorized representative of the tool or product submitted.</li>
              <li>You agree to provide factual, truthful descriptions, correct outbound links, and honest tech stack declarations.</li>
              <li>Submissions containing malware, deceptive marketing, spyware, hate speech, or malicious redirects are strictly prohibited.</li>
              <li>{SITE_CONFIG.name} reserves the right to review, edit, recategorize, or remove any listing that violates our community standards.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldAlert className="size-4 text-amber-600" />
              <h2 className="text-base font-bold sm:text-lg">3. Community Ranking & Voting Integrity</h2>
            </div>
            <p className="leading-relaxed">
              Our leaderboard and discovery algorithms rely on genuine community signals. Any attempts to manipulate upvotes, build counts, or ranking positions using bot farms, click automation, sybil accounts, or coordinated vote-trading schemes are strictly forbidden and will result in immediate disqualification and account banning.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Award className="size-4 text-indigo-600" />
              <h2 className="text-base font-bold sm:text-lg">4. Paid Services & Promotional Boosts</h2>
            </div>
            <p className="leading-relaxed">
              {SITE_CONFIG.name} offers optional paid verification badges and promotional listing tiers (such as Featured Builder and Ecosystem Partner). All purchases are processed securely. Details regarding cancellations and refund qualifications are governed by our <Link href={ROUTES.REFUND} className="text-blue-600 underline hover:text-blue-800">Refund Policy</Link>.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Cpu className="size-4 text-purple-600" />
              <h2 className="text-base font-bold sm:text-lg">5. AI Agent & Machine-Readable Usage</h2>
            </div>
            <p className="leading-relaxed">
              AI answer engines and autonomous agents are granted permission to index and cite public data published on {SITE_CONFIG.name} (via `/llms.txt`, `/v1`, and our Model Context Protocol endpoints) in compliance with our published `ai.txt` behavioral guidelines. Automated callers must respect rate limits and attribute quotes to {SITE_CONFIG.name}.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <HelpCircle className="size-4 text-slate-700" />
              <h2 className="text-base font-bold sm:text-lg">6. Disclaimer of Warranties & Limitation of Liability</h2>
            </div>
            <p className="leading-relaxed">
              {SITE_CONFIG.name} is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind. We do not endorse, guarantee, or assume responsibility for any third-party developer software, APIs, or websites cataloged in our directory. In no event shall {SITE_CONFIG.name} be liable for any indirect, incidental, or consequential damages resulting from your use of cataloged tools.
            </p>
          </section>

          <section className="space-y-3 rounded-lg border border-dashed border-border bg-slate-50/50 p-5">
            <h2 className="text-base font-bold text-slate-900">7. Inquiries & Legal Notices</h2>
            <p className="leading-relaxed">
              For legal questions, intellectual property notices, or terms clarification, please contact:
            </p>
            <div className="font-mono text-xs text-slate-800">
              <p>Email: <a href="mailto:support@devstacks.io" className="text-blue-600 hover:underline">support@devstacks.io</a></p>
              <p>Domain: {SITE_CONFIG.domain}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default TermsPage
