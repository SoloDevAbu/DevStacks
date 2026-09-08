import type { Metadata } from "next"
import Link from "next/link"
import { SITE_CONFIG } from "@/constants/site"

export const metadata: Metadata = {
  title: "MCP Server Documentation",
  description: `Connect AI agents and LLMs (Cursor, Claude, Windsurf) to ${SITE_CONFIG.name} via Model Context Protocol tools.`,
  alternates: {
    canonical: `${SITE_CONFIG.url}/mcp`,
  },
}

const McpPage = () => {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10 md:px-8">
      <div className="flex flex-col gap-2 border-b border-dashed border-border pb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold tracking-widest text-[#a06138] uppercase">
            MODEL CONTEXT PROTOCOL
          </span>
          <span className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700 border border-emerald-200">
            STREAMABLE HTTP
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {SITE_CONFIG.name} MCP Server
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Public, read-only Model Context Protocol server exposing real-time developer tools, tech stacks, and community upvotes to AI coding assistants and agents.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 font-mono text-xs text-slate-500">
          <span>Transport: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">Streamable HTTP</code></span>
          <span>·</span>
          <span>Endpoint: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">POST /api/mcp</code></span>
          <span>·</span>
          <Link href="/mcp.md" className="text-indigo-600 hover:underline">
            View as Markdown (.md)
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Quick Connect */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">1. Connect with Cursor</h2>
          <p className="text-xs text-slate-600">
            Add this to your project or user <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">~/.cursor/mcp.json</code>:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-slate-900 p-4 font-mono text-xs text-slate-100">
{`{
  "mcpServers": {
    "devstacks": {
      "url": "${SITE_CONFIG.url}/api/mcp",
      "transport": "streamable-http"
    }
  }
}`}
          </pre>
        </section>

        {/* Claude Code */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">2. Connect with Claude Code / Claude Desktop</h2>
          <p className="text-xs text-slate-600">
            Add to your <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-800">claude_desktop_config.json</code>:
          </p>
          <pre className="overflow-x-auto rounded-lg border border-border bg-slate-900 p-4 font-mono text-xs text-slate-100">
{`{
  "mcpServers": {
    "devstacks": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch", "${SITE_CONFIG.url}/api/mcp"]
    }
  }
}`}
          </pre>
        </section>

        {/* Tools Reference */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">3. Registered Tools Reference</h2>
          <div className="grid gap-3">
            {[
              {
                name: "search_tools",
                desc: "Search developer infrastructure tools by keyword or category. Returns tool name, tagline, website, and verified build counts.",
                args: "query (string, required), limit (number, optional)",
              },
              {
                name: "search_products",
                desc: "Search developer-built applications. Inspect what tools products are 'Built With'.",
                args: "query (string, required), limit (number, optional)",
              },
              {
                name: "get_tool",
                desc: "Fetch detailed metadata and verified build count for a single developer tool.",
                args: "slug (string, required)",
              },
              {
                name: "get_product",
                desc: "Fetch specifications, problem, solution, unique value, and verified tech stack for a product.",
                args: "slug (string, required)",
              },
              {
                name: "get_leaderboard",
                desc: "Fetch top community-upvoted developer tools or trending products.",
                args: "type ('tools' | 'products'), limit (number, optional)",
              },
            ].map((tool) => (
              <div key={tool.name} className="rounded-lg border border-dashed border-border p-4 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <code className="font-mono text-xs font-bold text-indigo-600">{tool.name}</code>
                  <span className="font-mono text-[10px] text-slate-400">tool</span>
                </div>
                <p className="mt-1 text-xs text-slate-600">{tool.desc}</p>
                <div className="mt-2 font-mono text-[11px] text-slate-500">
                  <span className="font-medium text-slate-700">Arguments:</span> {tool.args}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Related Specs */}
        <section className="space-y-2 border-t border-dashed border-border pt-6">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
            Related Agent Endpoints
          </h3>
          <div className="flex flex-wrap gap-2 font-mono text-xs">
            <Link href="/.well-known/mcp/server-card.json" className="text-indigo-600 hover:underline">
              Server Card JSON
            </Link>
            <span>·</span>
            <Link href="/.well-known/mcp.json" className="text-indigo-600 hover:underline">
              mcp.json Manifest
            </Link>
            <span>·</span>
            <Link href="/openapi.json" className="text-indigo-600 hover:underline">
              OpenAPI 3.1
            </Link>
            <span>·</span>
            <Link href="/v1" className="text-indigo-600 hover:underline">
              Public REST /v1
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default McpPage
