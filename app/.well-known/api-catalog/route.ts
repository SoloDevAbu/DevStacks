import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const catalog = {
    linkset: [
      {
        anchor: `${SITE_CONFIG.url}/v1`,
        "service-desc": [
          {
            href: `${SITE_CONFIG.url}/openapi.json`,
            type: "application/openapi+json",
            title: "OpenAPI 3.1 specification (JSON)",
          },
          {
            href: `${SITE_CONFIG.url}/api/openapi.yaml`,
            type: "application/yaml",
            title: "OpenAPI 3.1 specification (YAML)",
          },
        ],
        "service-doc": [
          {
            href: `${SITE_CONFIG.url}/cli`,
            type: "text/html",
            title: "CLI and public API documentation",
          },
        ],
      },
      {
        anchor: `${SITE_CONFIG.url}/api/ai`,
        "service-doc": [
          {
            href: `${SITE_CONFIG.url}/mcp`,
            type: "text/html",
            title: "MCP + AI agent documentation",
          },
          {
            href: `${SITE_CONFIG.url}/trending`,
            type: "text/html",
            title: "Trending leaderboard (HTML)",
          },
        ],
        describedby: [
          {
            href: `${SITE_CONFIG.url}/llms.txt`,
            type: "text/plain",
            title: "Agent-readable site description",
          },
        ],
      },
      {
        anchor: `${SITE_CONFIG.url}/api/mcp`,
        "service-doc": [
          {
            href: `${SITE_CONFIG.url}/mcp`,
            type: "text/html",
            title: "MCP server docs",
          },
        ],
        "service-meta": [
          {
            href: `${SITE_CONFIG.url}/.well-known/mcp/server-card.json`,
            type: "application/json",
            title: "MCP server card (Streamable HTTP)",
          },
          {
            href: `${SITE_CONFIG.url}/.well-known/mcp.json`,
            type: "application/json",
            title: "MCP discovery (mcp.json)",
          },
        ],
      },
      {
        anchor: `${SITE_CONFIG.url}/api/tools`,
        "service-doc": [
          {
            href: `${SITE_CONFIG.url}/tools`,
            type: "text/html",
            title: "Developer tools directory",
          },
        ],
        "service-meta": [
          {
            href: `${SITE_CONFIG.url}/sitemap.xml`,
            type: "application/xml",
            title: "Site and tools sitemap",
          },
        ],
        describedby: [
          {
            href: `${SITE_CONFIG.url}/llms.txt`,
            type: "text/plain",
            title: "Agent-readable site description",
          },
        ],
      },
      {
        anchor: `${SITE_CONFIG.url}/api/products`,
        "service-doc": [
          {
            href: `${SITE_CONFIG.url}/products`,
            type: "text/html",
            title: "Developer products directory",
          },
        ],
      },
      {
        anchor: `${SITE_CONFIG.url}/api/md/_catalog`,
        "service-doc": [
          {
            href: `${SITE_CONFIG.url}/api/md/_catalog`,
            type: "text/markdown",
            title: "Markdown content catalog",
          },
        ],
      },
    ],
  }

  return new NextResponse(JSON.stringify(catalog, null, 2), {
    headers: {
      "Content-Type": "application/linkset+json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
