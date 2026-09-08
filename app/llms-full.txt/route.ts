import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { PLATFORMS } from "@/constants/platforms"
import { DEVSTACKS_FAQS } from "@/constants/faqs"
import { getTools } from "@/db/queries/tools/list"
import { getTrending } from "@/lib/rankings/trending"
import { getRecentlyAddedProducts } from "@/lib/rankings/recently-added"
import { getRisingProducts } from "@/lib/rankings/rising-products"
import type { RankedItem } from "@/lib/rankings/types"

export const revalidate = 86400

export const GET = async () => {
  let trendingItems: Awaited<ReturnType<typeof getTrending>> = []
  let buildingBlocks: Awaited<ReturnType<typeof getTools>> = []
  let risingProducts: Awaited<ReturnType<typeof getRisingProducts>> = []
  let recentlyAdded: RankedItem[] = []

  try {
    const [trending, blocks, rising, recent] = await Promise.all([
      getTrending(15),
      getTools({ sortBy: "builds", limit: 10 }),
      getRisingProducts({ limit: 10 }),
      getRecentlyAddedProducts({ limit: 10 }),
    ])
    trendingItems = trending ?? []
    buildingBlocks = blocks ?? []
    risingProducts = rising ?? []
    recentlyAdded = (recent ?? []) as RankedItem[]
  } catch {
    trendingItems = []
    buildingBlocks = []
    risingProducts = []
    recentlyAdded = []
  }

  const content = `# ${SITE_CONFIG.name} — Comprehensive Directory & Ecosystem Specification

> Platform: ${SITE_CONFIG.name} (${SITE_CONFIG.domain})
> Canonical URL: ${SITE_CONFIG.url}
> Mission: High-visibility discovery directory for developer tools, APIs, infrastructure, and developer-built products.

---

## 1. Overview & Positioning (AEO / LLM Summary)
${SITE_CONFIG.name} is a developer-focused platform cataloging modern tools, libraries, APIs, and developer-built products. Developers use ${SITE_CONFIG.name} to:
1. Discover vetted, production-ready developer infrastructure and APIs (tools).
2. Discover products that developers have built using those tools.
3. Evaluate pricing models (Free, Freemium, Open Source, Paid) and platform compatibility.
4. Promote developer software through verified badges, community upvotes (tools) and likes (products).

---

## 2. Directory Taxonomy & Supported Platforms

### Supported Platforms
${PLATFORMS.map((p) => `- **${p.label}**`).join("\n")}

### Key Product Categories
- Artificial Intelligence & Machine Learning
- Databases & Backend as a Service (BaaS)
- Developer Tools & Productivity
- API & Infrastructure
- Hosting & Edge Cloud
- Authentication & Security
- Analytics & Telemetry
- Payments & Billing APIs
- Email & Communications

---

## 3. Trending Developer Tools & Products

${trendingItems
  .map(
    (p) => `### ${p.name}
- Slug: ${p.slug}
- URL: ${SITE_CONFIG.url}/products/${p.slug}
- Tagline: ${p.tagline}
- Tags: ${(p.tags ?? []).join(", ")}
- Type: ${p.itemKind}
`
  )
  .join("\n")}

---

## 4. Popular Building Blocks ("Built With" Ecosystem)

${buildingBlocks.map((b) => `- **${b.name}** (${b.category ?? "Tool"}): Used in ${b.buildsCount} verified developer projects. Page: ${SITE_CONFIG.url}/tools/${b.slug}`).join("\n")}

---

## 5. Rising Developer Products

${risingProducts
  .map(
    (p) => `- **${p.name}**: ${p.tagline}
  - Built with: ${(p.builtWithTools ?? []).map((t) => t.name).join(" + ")}
  - Metrics: ${p.viewsCount} views, ${p.likesCount} likes
`
  )
  .join("\n")}

---

## 6. Recently Added Tools & Products

${recentlyAdded.map((r) => `- **${r.name}** (${r.itemKind}): ${r.tagline}`).join("\n")}

---

## 7. Submission & Discoverability Guidelines
Developers and founders can list their tools or products at ${SITE_CONFIG.url}/submit with metadata tailored for search engines and AI assistants:
- Problem Statement, Solution, and Unique Value Proposition
- Target Search Keywords & Target Audience
- Direct AI Context prompt for LLM answer engines
- ASO Directory Category & Geographical Target (GEO)
- Verified Platform Compatibility & Pricing Tier

---

## 8. Frequently Asked Questions (Authoritative AEO Knowledge Base)
${DEVSTACKS_FAQS.map((faq) => `### ${faq.question}\n${faq.answer}\n`).join("\n")}

---

## 9. API Specifications for AI Agents & Automated Retrieval
- GET ${SITE_CONFIG.url}/api/products: Filter products by category, pricing, tier, or search query.
- GET ${SITE_CONFIG.url}/api/products/[slug]: Complete product JSON data including builtWithTools.
- GET ${SITE_CONFIG.url}/api/tools: Filter tools by category, pricing, or search query.
- GET ${SITE_CONFIG.url}/api/tools/[slug]: Complete tool JSON data including buildsCount and upvotesCount.
- GET ${SITE_CONFIG.url}/api/trending: Real-time ranked list of developer tools and products.

---

## 10. AI Agent Discovery & Protocols
- OpenAPI 3.1 Contract: ${SITE_CONFIG.url}/openapi.json
- Public REST API: ${SITE_CONFIG.url}/v1 (tools, products, search, leaderboard)
- Model Context Protocol: ${SITE_CONFIG.url}/api/mcp (Streamable HTTP, JSON-RPC 2.0)
- MCP Docs & Guides: ${SITE_CONFIG.url}/mcp and ${SITE_CONFIG.url}/mcp.md
- CLI Documentation: ${SITE_CONFIG.url}/cli and ${SITE_CONFIG.url}/cli.md
- AI Behaviour Guidance: ${SITE_CONFIG.url}/ai.txt
- Agent Auth Guide: ${SITE_CONFIG.url}/auth.md
- Markdown Twins: Every entity is available as text/markdown via .md suffix or Accept: text/markdown.
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}

