import type { Metadata } from "next"
import Link from "next/link"
import { ShieldCheck, Lock, Eye, Server, RefreshCw, Mail } from "lucide-react"
import { SITE_CONFIG } from "@/constants/site"
import { ROUTES } from "@/constants/routes"
import { breadcrumbSchema } from "@/lib/seo/schema"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_CONFIG.name} collects, protects, and handles data for developers, creators, and autonomous AI agents.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy`,
  },
}

const PrivacyPage = () => {
  const siteUrl = SITE_CONFIG.url
  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Privacy Policy", url: `${siteUrl}${ROUTES.PRIVACY}` },
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
            <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
              UPDATED MARCH 2026
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Privacy Policy
          </h1>
          <p className="text-sm leading-relaxed text-slate-600">
            {SITE_CONFIG.name} is dedicated to respecting your privacy and protecting the data of developers, founders, and autonomous agents visiting our platform.
          </p>
        </div>

        {/* Content */}
        <div className="mt-8 space-y-8 text-sm text-slate-600">
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <ShieldCheck className="size-4 text-emerald-600" />
              <h2 className="text-base font-bold sm:text-lg">1. Information We Collect</h2>
            </div>
            <p className="leading-relaxed">
              We collect minimal information necessary to deliver a trustworthy developer ecosystem and public discovery directory:
            </p>
            <ul className="list-inside list-disc space-y-1.5 pl-2 leading-relaxed">
              <li>
                <strong className="text-slate-800">Account Credentials:</strong> When you sign in via Google OAuth, we receive your verified email address, public profile name, and avatar image. We do not receive or store your Google passwords.
              </li>
              <li>
                <strong className="text-slate-800">Product & Tool Submissions:</strong> When submitting software to {SITE_CONFIG.name}, we store public metadata you provide (tool name, tagline, description, website URL, tech stack, and logo).
              </li>
              <li>
                <strong className="text-slate-800">Community Engagement:</strong> Upvotes, likes, and bookmarks are tied to authenticated user IDs to protect against vote manipulation and maintain verified rankings.
              </li>
              <li>
                <strong className="text-slate-800">Technical & Telemetry Data:</strong> IP addresses, request user-agents, and visited endpoints are processed for rate-limiting, DDoS prevention, and performance monitoring.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Eye className="size-4 text-blue-600" />
              <h2 className="text-base font-bold sm:text-lg">2. How We Use Your Data</h2>
            </div>
            <p className="leading-relaxed">
              Data collected by {SITE_CONFIG.name} is utilized strictly for:
            </p>
            <ul className="list-inside list-disc space-y-1.5 pl-2 leading-relaxed">
              <li>Publishing and indexing developer tools, software products, and verified tech stacks.</li>
              <li>Calculating community momentum, leaderboard rankings, and freshness discovery windows.</li>
              <li>Delivering verification checks and promotional sponsorship placements.</li>
              <li>Serving machine-readable outputs to AI assistants, LLM pipelines, and Model Context Protocol (MCP) clients.</li>
              <li>Enforcing security guidelines and preventing spam or fraudulent submissions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Lock className="size-4 text-indigo-600" />
              <h2 className="text-base font-bold sm:text-lg">3. Cookies & Local Storage</h2>
            </div>
            <p className="leading-relaxed">
              We utilize essential session cookies strictly to keep you authenticated across browser sessions. We do not use third-party tracking cookies or sell your browsing history to advertising data brokers.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <Server className="size-4 text-purple-600" />
              <h2 className="text-base font-bold sm:text-lg">4. Data Sharing & Third-Party Infrastructure</h2>
            </div>
            <p className="leading-relaxed">
              Public tool descriptions, tags, and tech stack details are intentionally accessible to the public, search engines, and AI agents. We share non-public data exclusively with trusted cloud infrastructure providers that comply with strict privacy standards (cloud hosting, database storage, and secure payment processing). We never sell your personal data.
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900">
              <RefreshCw className="size-4 text-amber-600" />
              <h2 className="text-base font-bold sm:text-lg">5. Data Retention & Your Rights</h2>
            </div>
            <p className="leading-relaxed">
              You retain full rights under GDPR and CCPA to request an export or complete deletion of your account and submitted data. To request data deletion or account removal, please reach out through our contact email below.
            </p>
          </section>

          <section className="space-y-3 rounded-lg border border-dashed border-border bg-slate-50/50 p-5">
            <div className="flex items-center gap-2 text-slate-900">
              <Mail className="size-4 text-slate-700" />
              <h2 className="text-base font-bold">6. Contact & Data Protection Officer</h2>
            </div>
            <p className="leading-relaxed">
              If you have any questions or concerns regarding our privacy practices or wish to submit a data removal request, contact our team directly at:
            </p>
            <div className="font-mono text-xs text-slate-800">
              <p>Email: <a href="mailto:support@devstacks.io" className="text-blue-600 hover:underline">support@devstacks.io</a></p>
              <p>Platform: {SITE_CONFIG.domain}</p>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default PrivacyPage
