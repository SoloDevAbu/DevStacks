import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { FAQ_CATEGORIES, LAUNCHNESTS_FAQS } from "@/constants/faqs"

export const revalidate = 86400

export const GET = () => {
  const content = `# Frequently Asked Questions — ${SITE_CONFIG.name}

> Comprehensive knowledge base, directory guidelines, community ranking methodology, sponsorship details, and AI agent protocols for ${SITE_CONFIG.name}.

\`\`\`yaml
url: "${SITE_CONFIG.url}/faq"
title: "Frequently Asked Questions — ${SITE_CONFIG.name}"
spec: "Dualmark AEO 1.0"
categories_count: ${FAQ_CATEGORIES.length}
questions_count: ${LAUNCHNESTS_FAQS.length}
updated: "2026-09-18"
\`\`\`

${FAQ_CATEGORIES.map(
  (category) => `## ${category.title}

> ${category.description}

${category.items
  .map(
    (item) => `### ${item.question}

${item.answer}`
  )
  .join("\n\n")}`
).join("\n\n---\n\n")}

---

## Machine & AI Discovery Links
- **Canonical HTML**: ${SITE_CONFIG.url}/faq
- **Full LLM Mirror**: ${SITE_CONFIG.url}/llms-full.txt
- **LLM Summary Index**: ${SITE_CONFIG.url}/llms.txt
- **Model Context Protocol (MCP)**: ${SITE_CONFIG.url}/api/mcp
- **REST API v1**: ${SITE_CONFIG.url}/v1
- **AI Behavior Policy**: ${SITE_CONFIG.url}/ai.txt
`

  const tokens = Math.ceil(content.length / 4)

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Location": `${SITE_CONFIG.url}/faq`,
      "X-Markdown-Tokens": tokens.toString(),
      "X-AEO-Version": "1.0.0",
      "X-Robots-Tag": "noindex, follow",
      Vary: "Accept, Origin",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  })
}
