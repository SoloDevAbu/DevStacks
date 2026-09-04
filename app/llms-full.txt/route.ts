import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { PLATFORMS } from "@/constants/platforms"
import { getProducts } from "@/db/queries/products/list"
import { getTrendingProducts } from "@/db/queries/products/trending"
import { getRecentlyAddedProducts } from "@/db/queries/products/recently-added"
import { getBuilds } from "@/db/queries/builds/list"

export const revalidate = 86400

export const GET = async () => {
  let trendingProducts: Awaited<ReturnType<typeof getTrendingProducts>> = []
  let buildingBlocks: Awaited<ReturnType<typeof getProducts>> = []
  let devBuilds: Awaited<ReturnType<typeof getBuilds>> = []
  let recentlyAdded: Awaited<ReturnType<typeof getRecentlyAddedProducts>> = []

  try {
    const [trending, blocks, buildsData, recent] = await Promise.all([
      getTrendingProducts(15),
      getProducts({ sortBy: "builds", limit: 10 }),
      getBuilds({ limit: 10 }),
      getRecentlyAddedProducts(10),
    ])
    trendingProducts = trending ?? []
    buildingBlocks = blocks ?? []
    devBuilds = buildsData ?? []
    recentlyAdded = recent ?? []
  } catch {
    trendingProducts = []
    buildingBlocks = []
    devBuilds = []
    recentlyAdded = []
  }

  const content = `# ${SITE_CONFIG.name} — Comprehensive Directory & Ecosystem Specification

> Platform: ${SITE_CONFIG.name} (${SITE_CONFIG.domain})
> Canonical URL: ${SITE_CONFIG.url}
> Mission: High-visibility discovery directory for developer tools, APIs, infrastructure, and developer tech stacks.

---

## 1. Overview & Positioning (AEO / LLM Summary)
${SITE_CONFIG.name} is a developer-focused platform cataloging modern tools, libraries, APIs, and SaaS products. Developers use ${SITE_CONFIG.name} to:
1. Discover vetted, production-ready developer infrastructure and APIs.
2. Inspect real-world tech stacks through "Built With" and "Developer Builds".
3. Evaluate pricing models (Free, Freemium, Open Source, Paid) and platform compatibility.
4. Promote developer software through verified badges and community upvotes.

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

## 3. Top Developer Tools & Products

${trendingProducts.map((p) => `### ${p.name}
- Slug: ${p.slug}
- URL: ${SITE_CONFIG.url}/products/${p.slug}
- Tagline: ${p.tagline}
- Tags: ${(p.tags ?? []).join(", ")}
- Community Upvotes: ${p.upvotesCount}
- Builds Using Tool: ${p.buildsCount}
`).join("\n")}

---

## 4. Popular Building Blocks ("Built With" Ecosystem)

${buildingBlocks.map((b) => `- **${b.name}** (${b.category ?? "Tool"}): Used in ${b.buildsCount} verified developer projects. Page: ${SITE_CONFIG.url}/products/${b.slug}`).join("\n")}

---

## 5. Developer Project Showcases

${devBuilds.map((b) => `- **${b.name}**: ${b.description}
  - Tech Stack: ${(b.builtWith ?? []).map((t: { name: string }) => t.name).join(" + ")}
  - Metrics: ${b.viewsCount} views, ${b.likesCount} likes
`).join("\n")}

---

## 6. Recently Added Products

${recentlyAdded.map((r) => `- **${r.name}** (${r.category ?? "Product"}): ${r.tagline}`).join("\n")}

---

## 7. Submission & Discoverability Guidelines
Developers and founders can list their products at ${SITE_CONFIG.url}/submit with metadata tailored for search engines and AI assistants:
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
