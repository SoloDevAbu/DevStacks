import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const manifest = {
    name: SITE_CONFIG.name,
    description: `Public, read-only Model Context Protocol tools for the ${SITE_CONFIG.name} developer tools and products catalog. Search tools, inspect tech stacks, fetch leaderboard, and retrieve product specifications. No API key required for reads.`,
    icon: `${SITE_CONFIG.url}/favicon.ico`,
    endpoint: `${SITE_CONFIG.url}/api/mcp`,
    transport: "streamable-http",
    mcp_version: "2024-11-05",
    endpoints: [
      {
        url: `${SITE_CONFIG.url}/api/mcp`,
        transport: "streamable-http",
        capabilities: ["tools"],
        auth: {
          type: "none",
        },
      },
      {
        url: `${SITE_CONFIG.url}/mcp`,
        transport: "streamable-http",
        capabilities: ["tools"],
        auth: {
          type: "none",
        },
      },
    ],
    documentation: `${SITE_CONFIG.url}/mcp`,
    serverCard: `${SITE_CONFIG.url}/.well-known/mcp/server-card.json`,
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
