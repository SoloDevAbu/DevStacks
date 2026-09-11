import { SITE_CONFIG } from "@/constants/site"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"

export const revalidate = 86400

export const GET = () => {
  const content = `# ${SITE_CONFIG.name} — Markdown Content Catalog

> Every public page and entity on ${SITE_CONFIG.name} is available as \`text/markdown\`.

## How to Fetch

Either send \`Accept: text/markdown\` on any canonical HTML URL:

\`\`\`bash
curl -H "Accept: text/markdown" ${SITE_CONFIG.url}/
curl -H "Accept: text/markdown" ${SITE_CONFIG.url}/tools/<slug>
curl -H "Accept: text/markdown" ${SITE_CONFIG.url}/products/<slug>
\`\`\`

…or address \`/api/md/<path>\` or append \`.md\` to the URL:

\`\`\`bash
curl ${SITE_CONFIG.url}/tools/<slug>.md
curl ${SITE_CONFIG.url}/products/<slug>.md
curl ${SITE_CONFIG.url}/api/md/tools/<slug>
curl ${SITE_CONFIG.url}/api/md/products/<slug>
curl ${SITE_CONFIG.url}/api/md/_catalog
\`\`\`

## Markdown Response Headers

Every markdown twin returns:
- \`Content-Location\`: Canonical HTML URL of the resource.
- \`X-Markdown-Tokens\`: Approximate token count (~4 chars/token) for LLM context budgeting.
- \`X-AEO-Version\`: Dualmark AEO Spec version (1.0.0).
- \`X-Robots-Tag: noindex, follow\`: Instructs search bots that the canonical HTML twin is the indexed entity.
- \`Vary: Accept, Origin\`: Ensures reverse-proxy and CDN caching keys on representation.

## Core Routes

- \`/\` — Homepage (trending and newly launched tools)
- \`/tools\` — Developer infrastructure tools directory
- \`/tools/{slug}\` — Tool detail (about, verified builds, pricing, upvotes)
- \`/products\` — Developer products & software directory
- \`/products/{slug}\` — Product detail (about, problem, solution, unique value, tech stack)
- \`/trending\` — Community-ranked trending tools and products
- \`/showcase\` — Developer project showcases & complete software stacks
- \`/pricing\` — Platform plans and promotional listing boosts
- \`/submit\` — Developer tool & product submission portal
- \`/mcp\` — MCP documentation for agents (JSON-RPC tools)
- \`/cli\` — CLI and Public REST API documentation
- \`/auth.md\` — Agent authentication guidance

## Bulk & Machine Surfaces

- ${SITE_CONFIG.url}/llms.txt — Concise agent index ([llmstxt.org](https://llmstxt.org/))
- ${SITE_CONFIG.url}/llms-full.txt — Full-catalog mirror of tools and products
- ${SITE_CONFIG.url}/ai.txt — Behavioural guidance and AI permissions
- ${SITE_CONFIG.url}/api/ai — Bounded JSON snapshot for answer engines
- ${SITE_CONFIG.url}/openapi.json — OpenAPI 3.1.0 REST contract
- ${SITE_CONFIG.url}/v1 — Public REST entrypoint
- ${SITE_CONFIG.url}/.well-known/api-catalog — RFC 9727 API catalog
- ${SITE_CONFIG.url}/.well-known/mcp.json — Model Context Protocol discovery manifest
`

  return createMarkdownResponse(content, `${SITE_CONFIG.url}/api/md/_catalog`)
}
