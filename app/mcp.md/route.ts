import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const content = `# ${SITE_CONFIG.name} MCP Server

> Public, read-only Model Context Protocol tools for the ${SITE_CONFIG.name} developer tools and software directory. No API key required.

\`\`\`yaml
url: "${SITE_CONFIG.url}/mcp"
transport: "${SITE_CONFIG.url}/api/mcp"
alias: "${SITE_CONFIG.url}/mcp"
server_card: "${SITE_CONFIG.url}/.well-known/mcp/server-card.json"
mcp_json: "${SITE_CONFIG.url}/.well-known/mcp.json"
ai_snapshot: "${SITE_CONFIG.url}/api/ai"
auth: none - public read-only
protocol: JSON-RPC 2.0 over HTTP POST
tools: 5
\`\`\`

## Start Here

- Site map: [llms.txt](${SITE_CONFIG.url}/llms.txt) — do not guess URLs.
- Bounded catalog snapshot: [GET /api/ai](${SITE_CONFIG.url}/api/ai) — trending tools + products.
- Tool calls: POST JSON-RPC to [MCP endpoint](${SITE_CONFIG.url}/api/mcp).
- Any public page also has a markdown twin — append \`.md\` or send \`Accept: text/markdown\`. Catalog: [/api/md/_catalog](${SITE_CONFIG.url}/api/md/_catalog).

## Available Tools

1. \`search_tools\` — Keyword search across developer tools. Args: \`query\` (required), \`limit\` (default 10).
2. \`search_products\` — Search developer-built products and inspect declared tech stacks. Args: \`query\` (required), \`limit\` (default 10).
3. \`get_tool\` — Fetch specifications and verified builds count for a tool by slug. Args: \`slug\` (required).
4. \`get_product\` — Fetch problem, solution, unique value, and tech stack for a product by slug. Args: \`slug\` (required).
5. \`get_leaderboard\` — Fetch community-upvoted developer tools or trending products. Args: \`type\` ('tools' | 'products'), \`limit\` (default 20).

## How to Connect

### Cursor Setup (~/.cursor/mcp.json)

\`\`\`json
{
  "mcpServers": {
    "devstacks": {
      "url": "${SITE_CONFIG.url}/api/mcp",
      "transport": "streamable-http"
    }
  }
}
\`\`\`

### Claude Desktop / Claude Code

\`\`\`json
{
  "mcpServers": {
    "devstacks": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch", "${SITE_CONFIG.url}/api/mcp"]
    }
  }
}
\`\`\`

## JSON-RPC Example

### initialize

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": { "name": "ai-assistant", "version": "1.0.0" }
  }
}
\`\`\`

### tools/call — search_tools

\`\`\`json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "search_tools",
    "arguments": { "query": "database", "limit": 5 }
  }
}
\`\`\`
`

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "noindex, follow",
    },
  })
}
