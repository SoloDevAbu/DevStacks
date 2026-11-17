import { NextResponse } from "next/server"
import { getAlternativesPageData } from "@/lib/alternatives/page-data"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { toAbsoluteRowUrl } from "@/utils/alternatives"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

const CATALOG_UPDATED_ON = "2026-10-01"

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const data = await getAlternativesPageData(slug)

  if (!data) {
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

  const { tool, curated, rows } = data
  const canonicalUrl = `${SITE_CONFIG.url}/alternatives/${tool.slug}`
  const formatCount = (count: number | null) => count ?? "—"

  const comparisonTable =
    rows.length > 0
      ? `| Tool | License | Pricing | Builds | Upvotes | Platforms |
|---|:---:|:---:|:---:|:---:|:---:|
| **[${tool.name}](${SITE_CONFIG.url}/tools/${tool.slug})** (target) | — | ${tool.pricing} | ${tool.buildsCount} | ${tool.upvotesCount} | ${(tool.platforms ?? []).join(", ") || "Web / Cloud"} |
${rows
  .map(
    (row) =>
      `| [${row.name}](${toAbsoluteRowUrl(row)}) | ${row.licenseLabel} | ${row.pricing} | ${formatCount(row.buildsCount)} | ${formatCount(row.upvotesCount)} | ${row.platforms} |`
  )
  .join("\n")}`
      : "No verified alternatives currently cataloged in this category."

  const alternativeDetails = rows
    .map(
      (row, idx) => `### ${idx + 1}. [${row.name}](${toAbsoluteRowUrl(row)})
- **Best for**: ${row.description}
- **License**: ${row.licenseLabel}
- **Pricing Model**: ${row.pricing}
- **Platforms**: ${row.platforms}${
        row.isExternal
          ? ""
          : `
- **Verified Production Builds**: ${row.buildsCount} projects
- **Community Upvotes**: ${row.upvotesCount}`
      }`
    )
    .join("\n\n")

  const decisionGuide = curated
    ? `## When to Stick with ${tool.name}
${curated.stickWith.map((reason) => `- ${reason}`).join("\n")}

## When to Switch
${curated.switchWhen.map((reason) => `- ${reason}`).join("\n")}

---

`
    : ""

  const markdown = `# ${rows.length} ${tool.name} Alternatives & Competitors — ${SITE_CONFIG.name}

> ${curated?.intro ?? `Developer tools listed on ${SITE_CONFIG.name} alongside ${tool.name} in the ${tool.category ?? "Developer Tools"} category.`}

\`\`\`yaml
target_tool: "${tool.name}"
target_slug: "${tool.slug}"
category: "${tool.category ?? "Developer Tools"}"
pricing: "${tool.pricing}"
builds_count: ${tool.buildsCount}
upvotes_count: ${tool.upvotesCount}
alternatives_count: ${rows.length}
curated: ${Boolean(curated)}
url: "${canonicalUrl}"
updated: "${curated?.factsCheckedOn ?? CATALOG_UPDATED_ON}"
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

${decisionGuide}## Detailed Alternative Profiles

${alternativeDetails}

---

## Machine & AI Discovery
- **Canonical HTML URL**: ${canonicalUrl}
- **Tool Machine Twin**: ${SITE_CONFIG.url}/api/md/tools/${tool.slug}
- **Full LLM Corpus**: ${SITE_CONFIG.url}/llms-full.txt
`

  return createMarkdownResponse(markdown, canonicalUrl)
}
