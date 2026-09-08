import type { Metadata } from "next"
import Link from "next/link"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: "CLI and Public REST API",
  description: `Official ${SITE_CONFIG.name} command-line client and OpenAPI 3.1 REST API for querying developer tools and tech stacks.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/cli`,
  },
}

const CliPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-8">
      <div className="flex flex-col gap-2 border-b border-dashed border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
            DEVELOPER ACCESS
          </span>
          <span className="rounded bg-sky-50 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-700 border border-sky-200">
            OPENAPI 3.1
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          CLI & Public REST API
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Query the live catalog of developer tools, products, and tech stacks directly from your terminal, scripts, or AI agent pipelines. No API key required for reads.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500">
          <span>Contract: <Link href="/openapi.json" className="text-indigo-600 hover:underline">openapi.json</Link></span>
          <span>·</span>
          <span>Base Path: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">/v1</code></span>
          <span>·</span>
          <Link href="/cli.md" className="text-indigo-600 hover:underline">
            View as Markdown (.md)
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* CLI Section */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">1. Command-Line Usage</h2>
          <p className="text-xs text-slate-600">
            Query the directory immediately using npx:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-slate-900 p-4 font-mono text-xs text-slate-100">
{`# Search developer tools and products
npx @devstacks/cli search "vector database"

# Fetch top community upvoted tools
npx @devstacks/cli leaderboard --limit 10

# Inspect verified tech stack and details
npx @devstacks/cli tool supabase`}
          </pre>
        </section>

        {/* REST Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">2. Public REST Endpoints (/v1)</h2>
          <div className="grid gap-3">
            {[
              {
                method: "GET",
                path: "/v1",
                desc: "Public API index and link directory",
              },
              {
                method: "GET",
                path: "/v1/tools",
                desc: "Paginated developer tools. Supports ?q=, ?category=, ?pricing=, ?sort=",
              },
              {
                method: "GET",
                path: "/v1/tools/{slug}",
                desc: "Full tool details, website, category, and verified build counts",
              },
              {
                method: "GET",
                path: "/v1/products",
                desc: "Paginated developer products. Supports ?q=, ?category=, ?pricing=, ?sort=",
              },
              {
                method: "GET",
                path: "/v1/products/{slug}",
                desc: "Product details, problem, solution, unique value, and 'Built With' tech stack",
              },
              {
                method: "GET",
                path: "/v1/search?q={query}",
                desc: "Unified search across tools and products",
              },
              {
                method: "GET",
                path: "/v1/leaderboard",
                desc: "Community rankings for top tools and products",
              },
            ].map((ep) => (
              <div key={ep.path} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border border-dashed border-border p-4 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-800">
                    {ep.method}
                  </span>
                  <code className="font-mono text-xs font-semibold text-slate-900">{ep.path}</code>
                </div>
                <p className="text-xs text-slate-600 sm:text-right">{ep.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Curl Examples */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">3. Quick Curl Examples</h2>
          <pre className="overflow-x-auto rounded-lg border border-border bg-slate-900 p-4 font-mono text-xs text-slate-100">
{`# 1. Search for auth tools
curl -sS "${SITE_CONFIG.url}/v1/search?q=auth"

# 2. Get tool details
curl -sS "${SITE_CONFIG.url}/v1/tools/supabase"

# 3. Request markdown representation via content negotiation
curl -sS -H "Accept: text/markdown" "${SITE_CONFIG.url}/tools/supabase"`}
          </pre>
        </section>
      </div>
    </div>
  )
}

export default CliPage
