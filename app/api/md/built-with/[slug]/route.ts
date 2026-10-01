import { NextResponse } from "next/server"
import { resolveTool, getProductsBuiltWithTool } from "@/lib/tools/resolve-tool"
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

  const builtWithProducts = await getProductsBuiltWithTool(tool.slug, tool.name, 50)
  const canonicalUrl = `${SITE_CONFIG.url}/built-with/${tool.slug}`

  const productsTable = builtWithProducts.length > 0
    ? `| Product | Tagline | Category | Pricing | Tier |
|---|---|:---:|:---:|:---:|
${builtWithProducts
  .map(
    (p) =>
      `| [${p.name}](${SITE_CONFIG.url}/products/${p.slug}) | ${p.tagline.replace(/\|/g, "-")} | ${p.category ?? "Product"} | ${p.pricing} | ${p.tier} |`
  )
  .join("\n")}`
    : "No verified products currently cataloged using this tool."

  const productsDetailList = builtWithProducts
    .map(
      (p, idx) => `### ${idx + 1}. [${p.name}](${SITE_CONFIG.url}/products/${p.slug})
- **Tagline**: ${p.tagline}
- **Category**: ${p.category ?? "Developer Product"}
- **Pricing**: ${p.pricing}
- **Website**: ${p.websiteUrl ?? `${SITE_CONFIG.url}/products/${p.slug}`}
- **Machine Twin**: ${SITE_CONFIG.url}/api/md/products/${p.slug}`
    )
    .join("\n\n")

  const markdown = `# Products Built With ${tool.name} — ${SITE_CONFIG.name}

> Verified production showcase of ${builtWithProducts.length} software applications, SaaS tools, and indie projects powered by ${tool.name}.

\`\`\`yaml
tool: "${tool.name}"
tool_slug: "${tool.slug}"
tool_website: "${tool.websiteUrl ?? ""}"
verified_builds_count: ${builtWithProducts.length}
url: "${canonicalUrl}"
updated: "2026-10-01"
\`\`\`

## About ${tool.name}
${tool.description ?? `${tool.name} is a developer tool and software building block cataloged on ${SITE_CONFIG.name}.`}

- **Official Tool Page**: ${SITE_CONFIG.url}/tools/${tool.slug}
- **Tool Website**: ${tool.websiteUrl ?? `${SITE_CONFIG.url}/tools/${tool.slug}`}

---

## Production Applications & Stacks

${productsTable}

---

## Detailed Product Showcases

${productsDetailList}

---

## Submit Your Build
Are you building with ${tool.name}?
Submit your product to the ${tool.name} ecosystem showcase at:
${SITE_CONFIG.url}/submit?type=product&tool=${encodeURIComponent(tool.slug)}

---

## Machine & AI Discovery
- **Canonical HTML URL**: ${canonicalUrl}
- **Tool Machine Twin**: ${SITE_CONFIG.url}/api/md/tools/${tool.slug}
- **Full LLM Corpus**: ${SITE_CONFIG.url}/llms-full.txt
`

  return createMarkdownResponse(markdown, canonicalUrl)
}
