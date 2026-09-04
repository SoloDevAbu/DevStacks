import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { TRENDING_PRODUCTS, BUILDING_BLOCKS } from "@/constants/products"

export const dynamic = "force-static"
export const revalidate = 86400

export const GET = () => {
  const content = `# ${SITE_CONFIG.name}

> ${SITE_CONFIG.description}

## About ${SITE_CONFIG.name}
${SITE_CONFIG.name} (${SITE_CONFIG.domain}) is a curated discovery directory and ecosystem for developer tools, APIs, and infrastructure products. It features community-upvoted developer products, tech stack breakdowns ("Built With"), developer project showcases, and in-depth architectural comparisons.

## Core Navigation & Endpoints
- [Home](${SITE_CONFIG.url}): Discover trending and newly launched developer tools.
- [Trending Products](${SITE_CONFIG.url}/trending): Community-ranked developer tools by upvotes, views, and builds.
- [Discover Directory](${SITE_CONFIG.url}/discover): Search developer products by categories (AI, Analytics, Databases, DevTools, Auth, Hosting).
- [Built With Ecosystem](${SITE_CONFIG.url}/built-with): Products and building blocks ranked by how many developer projects use them.
- [Showcase Builds](${SITE_CONFIG.url}/showcase): Real-world software projects and their complete developer tech stacks.
- [Submit a Product](${SITE_CONFIG.url}/submit): Submission portal for developers and founders to list developer tools.

## Popular Developer Building Blocks
${BUILDING_BLOCKS.map((b) => `- [${b.name}](${SITE_CONFIG.url}/products/${b.name.toLowerCase().replace(/\s+/g, "-")}): ${b.category} (${b.builds} builds)`).join("\n")}

## Featured Developer Tools
${TRENDING_PRODUCTS.slice(0, 10).map((p) => `- [${p.name}](${SITE_CONFIG.url}/products/${p.name.toLowerCase().replace(/\s+/g, "-")}): ${p.tagline} (Tags: ${p.tags.join(", ")})`).join("\n")}

## API Access
- GET ${SITE_CONFIG.url}/api/products: JSON list of approved developer tools.
- GET ${SITE_CONFIG.url}/api/products/trending: List of top trending products.
- GET ${SITE_CONFIG.url}/api/products/[slug]: In-depth specifications, schema, problem statements, and solutions for a specific tool.

## Full Context
For comprehensive technical details, category indexes, and full directory listings, see [llms-full.txt](${SITE_CONFIG.url}/llms-full.txt).
`

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
