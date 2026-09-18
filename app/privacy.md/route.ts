import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { PRIVACY_CATEGORIES, ALL_PRIVACY_ITEMS } from "@/constants/privacy"

export const revalidate = 86400

export const GET = () => {
  const content = `# Privacy Policy — ${SITE_CONFIG.name}

> How ${SITE_CONFIG.name} collects, uses, shares, and protects your personal data — and your rights under GDPR, India's DPDP Act, and other applicable laws.

\`\`\`yaml
url: "${SITE_CONFIG.url}/privacy"
title: "Privacy Policy — ${SITE_CONFIG.name}"
spec: "Dualmark AEO 1.0"
categories_count: ${PRIVACY_CATEGORIES.length}
privacy_items_count: ${ALL_PRIVACY_ITEMS.length}
updated: "2026-09-19"
\`\`\`

${PRIVACY_CATEGORIES.map(
  (category) => `## ${category.title}

> ${category.description}

${category.items
  .map(
    (item) => `### ${item.number}. ${item.title}

${item.content}${
      item.bulletPoints && item.bulletPoints.length > 0
        ? `\n\n${item.bulletPoints.map((bp) => `- ${bp}`).join("\n")}`
        : ""
    }`
  )
  .join("\n\n")}`
).join("\n\n---\n\n")}

---

## Machine & AI Discovery Links
- **Canonical HTML**: ${SITE_CONFIG.url}/privacy
- **Full LLM Mirror**: ${SITE_CONFIG.url}/llms-full.txt
- **LLM Summary Index**: ${SITE_CONFIG.url}/llms.txt
- **Model Context Protocol (MCP)**: ${SITE_CONFIG.url}/api/mcp
- **REST API v1**: ${SITE_CONFIG.url}/v1
- **AI Behavior Policy**: ${SITE_CONFIG.url}/ai.txt
- **Terms Markdown Twin**: ${SITE_CONFIG.url}/terms.md
- **FAQ Markdown Twin**: ${SITE_CONFIG.url}/faq.md
`

  const tokens = Math.ceil(content.length / 4)

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": `${SITE_CONFIG.url}/privacy`,
      "X-Markdown-Tokens": tokens.toString(),
      "X-AEO-Version": "1.0.0",
      "X-Robots-Tag": "noindex, follow",
      Vary: "Accept, Origin",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
