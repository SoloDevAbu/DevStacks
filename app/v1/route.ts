import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const apiIndex = {
    name: `${SITE_CONFIG.name} Public API`,
    version: "1.0.0",
    openapi: `${SITE_CONFIG.url}/openapi.json`,
    docs: `${SITE_CONFIG.url}/cli`,
    mcp: `${SITE_CONFIG.url}/api/mcp`,
    mcpJson: `${SITE_CONFIG.url}/.well-known/mcp.json`,
    llmsTxt: `${SITE_CONFIG.url}/llms.txt`,
    auth: "No API key required for GET reads. Submissions and upvotes require an authenticated user session (see /auth.md).",
    errors: "RFC 9457 Problem Details as application/problem+json with type, title, status, detail.",
    rateLimit: "120 requests per minute per IP.",
    endpoints: [
      { method: "GET", path: "/v1", summary: "Public REST API directory and index" },
      { method: "GET", path: "/v1/tools", summary: "Paginated developer infrastructure tools catalog" },
      { method: "GET", path: "/v1/tools/{slug}", summary: "Tool details and verified builds count" },
      { method: "GET", path: "/v1/products", summary: "Paginated developer products catalog" },
      { method: "GET", path: "/v1/products/{slug}", summary: "Product details and declared tech stack" },
      { method: "GET", path: "/v1/search?q=", summary: "Unified search across tools and products" },
      { method: "GET", path: "/v1/leaderboard", summary: "Community rankings for tools and products" },
    ],
  }

  return NextResponse.json(apiIndex, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
