import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { PLATFORMS } from "@/constants/platforms"
import { getTools } from "@/db/queries/tools/list"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { getRecentlyAddedProducts } from "@/lib/rankings/recently-added"
import { getRisingProducts } from "@/lib/rankings/rising-products"
import type { RankedItem } from "@/lib/rankings/types"

export const revalidate = 86400

export const GET = async () => {
  let trendingItems: Awaited<ReturnType<typeof getTrendingProducts>> = []
  let buildingBlocks: Awaited<ReturnType<typeof getTools>> = []
  let risingProducts: Awaited<ReturnType<typeof getRisingProducts>> = []
  let recentlyAdded: RankedItem[] = []

  try {
    const [trending, blocks, rising, recent] = await Promise.all([
      getTrendingProducts(15),
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

${trendingItems.map((p) => `### ${p.name}
- Slug: ${p.slug}
- URL: ${SITE_CONFIG.url}/products/${p.slug}
- Tagline: ${p.tagline}
- Tags: ${(p.tags ?? []).join(", ")}
- Type: ${p.itemKind}
`).join("\n")}

---

## 4. Popular Building Blocks ("Built With" Ecosystem)

${buildingBlocks.map((b) => `- **${b.name}** (${b.category ?? "Tool"}): Used in ${b.buildsCount} verified developer projects. Page: ${SITE_CONFIG.url}/products/${b.slug}`).join("\n")}

---

## 5. Rising Developer Products

${risingProducts.map((p) => `- **${p.name}**: ${p.tagline}
  - Built with: ${(p.builtWithTools ?? []).map((t) => t.name).join(" + ")}
  - Metrics: ${p.viewsCount} views, ${p.likesCount} likes
`).join("\n")}

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
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
