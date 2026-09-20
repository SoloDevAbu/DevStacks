import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { REFUND_CATEGORIES, ALL_REFUND_ITEMS } from "@/constants/refund"

export const revalidate = 86400

export const GET = () => {
  const content = `# Refund & Cancellation Policy — ${SITE_CONFIG.name}

> Directory listings on ${SITE_CONFIG.name} are completely free. Paid sponsorships and promotional placements are digital services governed by our clear, good-faith cancellation policy.

\`\`\`yaml
url: "${SITE_CONFIG.url}/refund"
title: "Refund & Cancellation Policy — ${SITE_CONFIG.name}"
spec: "Dualmark AEO 1.0"
categories_count: ${REFUND_CATEGORIES.length}
refund_items_count: ${ALL_REFUND_ITEMS.length}
updated: "2026-09-19"
\`\`\`

${REFUND_CATEGORIES.map(
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
- **Canonical HTML**: ${SITE_CONFIG.url}/refund
- **Full LLM Mirror**: ${SITE_CONFIG.url}/llms-full.txt
- **LLM Summary Index**: ${SITE_CONFIG.url}/llms.txt
- **Model Context Protocol (MCP)**: ${SITE_CONFIG.url}/api/mcp
- **REST API v1**: ${SITE_CONFIG.url}/v1
- **AI Behavior Policy**: ${SITE_CONFIG.url}/ai.txt
- **Terms Markdown Twin**: ${SITE_CONFIG.url}/terms.md
- **Privacy Markdown Twin**: ${SITE_CONFIG.url}/privacy.md
- **FAQ Markdown Twin**: ${SITE_CONFIG.url}/faq.md
`

  const tokens = Math.ceil(content.length / 4)

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": `${SITE_CONFIG.url}/refund`,
      "X-Markdown-Tokens": tokens.toString(),
      "X-AEO-Version": "1.0.0",
      "X-Robots-Tag": "noindex, follow",
      Vary: "Accept, Origin",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
