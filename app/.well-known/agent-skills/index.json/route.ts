import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const skillsIndex = {
    $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
    publisher: {
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    skills: [
      {
        name: "search-tools",
        type: "mcp-tool",
        description: `Search developer infrastructure tools and APIs on ${SITE_CONFIG.name}.`,
        url: `${SITE_CONFIG.url}/api/mcp`,
      },
      {
        name: "search-products",
        type: "mcp-tool",
        description: `Search developer-built applications and inspect tech stacks on ${SITE_CONFIG.name}.`,
        url: `${SITE_CONFIG.url}/api/mcp`,
      },
      {
        name: "get-tool-details",
        type: "rest-endpoint",
        description: "Retrieve specifications and verified builds for a developer tool.",
        url: `${SITE_CONFIG.url}/v1/tools/{slug}`,
      },
      {
        name: "submit-product",
        type: "auth-skill",
        description: `Guide a human developer through submitting a product or tool to ${SITE_CONFIG.name}.`,
        url: `${SITE_CONFIG.url}/auth.md`,
      },
    ],
  }

  return NextResponse.json(skillsIndex, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
