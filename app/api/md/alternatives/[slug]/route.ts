import { NextResponse } from "next/server"
import { resolveTool } from "@/lib/tools/resolve-tool"
import { getRelatedTools } from "@/db/queries/tools/get"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    return new NextResponse(
      `# 404 Not Found\n\nDeveloper tool "${slug}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const alternatives = tool.categoryId
    ? await getRelatedTools(tool.categoryId, tool.id, 20)
    : []

  const canonicalUrl = `${SITE_CONFIG.url}/alternatives/${tool.slug}`

  const comparisonTable = alternatives.length > 0
    ? `| Tool | Pricing | Builds | Upvotes | Category | Status |
|---|:---:|:---:|:---:|:---:|:---:|
| **[${tool.name}](${SITE_CONFIG.url}/tools/${tool.slug})** | ${tool.pricing} | ${tool.buildsCount} | ${tool.upvotesCount} | ${tool.category ?? "Tool"} | **Target** |
${alternatives
  .map(
    (alt) =>
      `| [${alt.name}](${SITE_CONFIG.url}/tools/${alt.slug}) | ${alt.pricing} | ${alt.buildsCount} | ${alt.upvotesCount} | ${alt.category ?? "Tool"} | Alternative |`
  )
  .join("\n")}`
    : "No verified alternatives currently cataloged in this category."

  const alternativeDetails = alternatives
    .map(
      (alt, idx) => `### ${idx + 1}. [${alt.name}](${SITE_CONFIG.url}/tools/${alt.slug})
- **Tagline**: ${alt.tagline}
- **Pricing Model**: ${alt.pricing}
- **Verified Production Builds**: ${alt.buildsCount} projects
- **Community Upvotes**: ${alt.upvotesCount}
- **Platforms**: ${(alt.platforms ?? []).join(", ") || "Web / Cloud"}
- **Canonical Profile**: ${SITE_CONFIG.url}/tools/${alt.slug}
- **Machine Twin**: ${SITE_CONFIG.url}/api/md/tools/${alt.slug}`
    )
    .join("\n\n")

  const markdown = `# Best ${tool.name} Alternatives & Competitors — ${SITE_CONFIG.name}

> Objective comparison of verified developer tools competing with ${tool.name} in the ${tool.category ?? "Developer Tools"} category.

\`\`\`yaml
target_tool: "${tool.name}"
target_slug: "${tool.slug}"
category: "${tool.category ?? "Developer Tools"}"
pricing: "${tool.pricing}"
builds_count: ${tool.buildsCount}
upvotes_count: ${tool.upvotesCount}
alternatives_count: ${alternatives.length}
url: "${canonicalUrl}"
updated: "2026-10-01"
\`\`\`

## About ${tool.name} (Current Target)
${tool.description ?? `${tool.name} is a developer tool and API listed on ${SITE_CONFIG.name}.`}

- **Official Website**: ${tool.websiteUrl ?? canonicalUrl}
- **Pricing**: ${tool.pricing}
- **Active Production Builds**: ${tool.buildsCount} verified apps

---

## Comparative Matrix: ${tool.name} vs Competitors

${comparisonTable}

---

## Detailed Alternative Profiles

${alternativeDetails}

---

## Machine & AI Discovery
- **Canonical HTML URL**: ${canonicalUrl}
- **Tool Machine Twin**: ${SITE_CONFIG.url}/api/md/tools/${tool.slug}
- **Full LLM Corpus**: ${SITE_CONFIG.url}/llms-full.txt
`

  return createMarkdownResponse(markdown, canonicalUrl)
}
