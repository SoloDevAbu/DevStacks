import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { TRENDING_PRODUCTS, BUILDING_BLOCKS, DEVELOPER_BUILDS, RECENTLY_ADDED } from "@/constants/products"
import { PLATFORMS } from "@/constants/platforms"

export const dynamic = "force-static"
export const revalidate = 86400

export const GET = () => {
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

${TRENDING_PRODUCTS.map((p) => `### ${p.name}
- Slug: ${p.name.toLowerCase().replace(/\s+/g, "-")}
- URL: ${SITE_CONFIG.url}/products/${p.name.toLowerCase().replace(/\s+/g, "-")}
- Tagline: ${p.tagline}
- Tags: ${p.tags.join(", ")}
- Community Upvotes: ${p.upvotes}
- Builds Using Tool: ${p.builds}
`).join("\n")}

---

## 4. Popular Building Blocks ("Built With" Ecosystem)

${BUILDING_BLOCKS.map((b) => `- **${b.name}** (${b.category}): Used in ${b.builds} verified developer projects. Page: ${SITE_CONFIG.url}/products/${b.name.toLowerCase().replace(/\s+/g, "-")}`).join("\n")}

---

## 5. Developer Project Showcases

${DEVELOPER_BUILDS.map((b) => `- **${b.name}**: ${b.desc}
  - Tech Stack: ${b.builtWith.join(" + ")}
  - Metrics: ${b.views} views, ${b.likes} likes
`).join("\n")}

---

## 6. Recently Added Products

${RECENTLY_ADDED.map((r) => `- **${r.name}** (${r.category}): ${r.desc}`).join("\n")}

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
