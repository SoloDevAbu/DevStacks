import { NextResponse } from "next/server"
import { getCategoryBySlug, getCategoryStats } from "@/db/queries/categories/list"
import { getTools } from "@/db/queries/tools/list"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return new NextResponse(
      `# 404 Not Found\n\nCategory "${slug}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const [toolsList, stats] = await Promise.all([
    getTools({ category: category.slug, limit: 100, sortBy: "builds" }),
    getCategoryStats(category.id),
  ])

  const canonicalUrl = `${SITE_CONFIG.url}/tools/category/${category.slug}`

  const toolsTable = toolsList.length > 0
    ? `| Tool | Tagline | Pricing | Production Builds | Upvotes |
|---|---|:---:|:---:|:---:|
${toolsList
  .map(
    (t) =>
      `| [${t.name}](${SITE_CONFIG.url}/tools/${t.slug}) | ${t.tagline.replace(/\|/g, "-")} | ${t.pricing} | ${t.buildsCount} | ${t.upvotesCount} |`
  )
  .join("\n")}`
    : "No verified tools currently listed in this category."

  const toolsDetailList = toolsList.map((t) => `### [${t.name}](${SITE_CONFIG.url}/tools/${t.slug})
- **Tagline**: ${t.tagline}
- **Pricing**: ${t.pricing}
- **Verified Builds**: ${t.buildsCount} projects
- **Community Upvotes**: ${t.upvotesCount}
- **Website**: ${t.websiteUrl ?? `${SITE_CONFIG.url}/tools/${t.slug}`}
- **Markdown Twin**: ${SITE_CONFIG.url}/api/md/tools/${t.slug}`).join("\n\n")

  const markdown = `# ${category.name} Developer Tools & APIs — ${SITE_CONFIG.name}

> Comprehensive directory of ${stats.toolCount} verified ${category.name} developer tools, libraries, and APIs powering ${stats.totalBuilds.toLocaleString()} production builds.

\`\`\`yaml
category: "${category.name}"
slug: "${category.slug}"
url: "${canonicalUrl}"
total_tools: ${stats.toolCount}
total_builds: ${stats.totalBuilds}
open_source_count: ${stats.openSourceCount}
free_tier_count: ${stats.freeCount}
updated: "2026-10-01"
\`\`\`

## Ecosystem Summary
The ${category.name} category on ${SITE_CONFIG.name} catalogs ${stats.toolCount} verified tools with ${stats.totalBuilds.toLocaleString()} verified applications built by developers.

## Verified ${category.name} Tools Directory

${toolsTable}

---

## Detailed Tool Profiles

${toolsDetailList}

---

## Machine & AI Discovery
- **Canonical HTML URL**: ${canonicalUrl}
- **Full LLM Corpus**: ${SITE_CONFIG.url}/llms-full.txt
- **Tools Directory API**: ${SITE_CONFIG.url}/v1/tools?category=${encodeURIComponent(category.name)}
`

  return createMarkdownResponse(markdown, canonicalUrl)
}
