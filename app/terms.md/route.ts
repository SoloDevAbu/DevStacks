import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { TERMS_CATEGORIES, ALL_TERMS_ITEMS } from "@/constants/terms"

export const revalidate = 86400

export const GET = () => {
  const content = `# Terms of Service — ${SITE_CONFIG.name}

> The terms that govern your use of ${SITE_CONFIG.name} — directory listings, sponsorships, AI agent access, and all platform features.

\`\`\`yaml
url: "${SITE_CONFIG.url}/terms"
title: "Terms of Service — ${SITE_CONFIG.name}"
spec: "Dualmark AEO 1.0"
categories_count: ${TERMS_CATEGORIES.length}
terms_count: ${ALL_TERMS_ITEMS.length}
updated: "2026-09-19"
\`\`\`

${TERMS_CATEGORIES.map(
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
- **Canonical HTML**: ${SITE_CONFIG.url}/terms
- **Full LLM Mirror**: ${SITE_CONFIG.url}/llms-full.txt
- **LLM Summary Index**: ${SITE_CONFIG.url}/llms.txt
- **Model Context Protocol (MCP)**: ${SITE_CONFIG.url}/api/mcp
- **REST API v1**: ${SITE_CONFIG.url}/v1
- **AI Behavior Policy**: ${SITE_CONFIG.url}/ai.txt
- **FAQ Markdown Twin**: ${SITE_CONFIG.url}/faq.md
`

  const tokens = Math.ceil(content.length / 4)

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": `${SITE_CONFIG.url}/terms`,
      "X-Markdown-Tokens": tokens.toString(),
      "X-AEO-Version": "1.0.0",
      "X-Robots-Tag": "noindex, follow",
      Vary: "Accept, Origin",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
