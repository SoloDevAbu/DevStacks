import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const content = `# ${SITE_CONFIG.name} CLI and Public API

> Official command-line client and OpenAPI 3.1 REST API for the developer tools and products catalog. No API key for reads.

\`\`\`yaml
url: "${SITE_CONFIG.url}/cli"
openapi: "${SITE_CONFIG.url}/openapi.json"
openapi_yaml: "${SITE_CONFIG.url}/api/openapi.yaml"
rest: "${SITE_CONFIG.url}/v1"
cli: npx @devstacks/cli
auth: none - public read-only GET
\`\`\`

## Quick Start via CLI

Run without installing:

\`\`\`bash
npx @devstacks/cli --help
npx @devstacks/cli search "postgres" --json
npx @devstacks/cli leaderboard --limit 10
npx @devstacks/cli tool supabase
npx @devstacks/cli product decispher
\`\`\`

## Public REST Endpoints

All \`/v1\` endpoints are public and read-only without authentication:

- \`GET /v1\` — Public API directory & index
- \`GET /v1/tools\` — Paginated tools catalog (?q=, ?category=, ?pricing=, ?sort=)
- \`GET /v1/tools/{slug}\` — Tool details and verified builds count
- \`GET /v1/products\` — Paginated products catalog (?q=, ?category=, ?pricing=, ?sort=)
- \`GET /v1/products/{slug}\` — Product details and declared tech stack
- \`GET /v1/search?q={query}\` — Unified search across tools and products
- \`GET /v1/leaderboard\` — Top tools and trending products by upvotes

## Curl Examples

\`\`\`bash
# Search for auth providers
curl -sS "${SITE_CONFIG.url}/v1/search?q=auth"

# Fetch this week's leaderboard
curl -sS "${SITE_CONFIG.url}/v1/leaderboard?limit=5"

# Fetch markdown representation of a tool
curl -H "Accept: text/markdown" "${SITE_CONFIG.url}/tools/supabase"
\`\`\`

## RFC 9457 Errors & Rate Limiting

Error responses use RFC 9457 Problem Details as \`application/problem+json\` with \`type\`, \`title\`, \`status\`, and \`detail\`.
Rate limit: **120 requests per minute per IP**. Responses include standard IETF headers:
- \`RateLimit-Limit\`
- \`RateLimit-Remaining\`
- \`RateLimit-Reset\`
- \`Retry-After\` (on 429)

## Related Agent Surfaces

- [MCP docs](${SITE_CONFIG.url}/mcp) — Model Context Protocol tools
- [llms.txt](${SITE_CONFIG.url}/llms.txt) — LLM site map
- [AI snapshot](${SITE_CONFIG.url}/api/ai) — Bounded JSON snapshot
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
