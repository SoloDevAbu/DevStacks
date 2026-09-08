import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const serverCard = {
    $schema: "https://static.modelcontextprotocol.io/schemas/mcp-server-card/v1.json",
    version: "1.0",
    protocolVersion: "2024-11-05",
    schemaVersion: "2024-11-05",
    serverInfo: {
      name: "devstacks",
      title: `${SITE_CONFIG.name} MCP Server`,
      version: "1.0.0",
      vendor: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      homepage: SITE_CONFIG.url,
      documentation: `${SITE_CONFIG.url}/mcp`,
      description: `Public, read-only MCP tools for the ${SITE_CONFIG.name} developer tools and software directory. Query tools, discover tech stacks, and fetch trending leaderboards without an API key.`,
    },
    transport: {
      type: "streamable-http",
      endpoint: `${SITE_CONFIG.url}/api/mcp`,
    },
    authentication: {
      required: false,
      schemes: [],
    },
    capabilities: {
      tools: {
        listChanged: false,
      },
      resources: {
        subscribe: false,
        listChanged: false,
      },
      prompts: {
        listChanged: false,
      },
      logging: {},
    },
    tools: [
      {
        name: "search_tools",
        description: `Search ${SITE_CONFIG.name}'s developer tools catalog by keyword, category, or pricing. Returns matching tools with tagline, website, build counts, and canonical URLs.`,
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Free-text search term across tool name, category, and tagline",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 25,
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "search_products",
        description: `Search developer-built products cataloged on ${SITE_CONFIG.name}. Returns products with description, category, tags, and declared 'Built With' tools.`,
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Free-text search term across product name, tagline, and tags",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 25,
              default: 10,
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_tool",
        description: `Fetch detailed metadata and specifications for a single developer tool by its slug on ${SITE_CONFIG.name}.`,
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description: "Tool slug, e.g. 'supabase', 'prisma', 'stripe'",
            },
          },
          required: ["slug"],
        },
      },
      {
        name: "get_product",
        description: `Fetch detailed specifications, problem, solution, unique value, and 'Built With' tech stack for a product by its slug.`,
        inputSchema: {
          type: "object",
          properties: {
            slug: {
              type: "string",
              description: "Product slug, e.g. 'decispher', 'cron-master'",
            },
          },
          required: ["slug"],
        },
      },
      {
        name: "get_leaderboard",
        description: `Fetch the top community-upvoted developer tools or trending products on ${SITE_CONFIG.name}.`,
        inputSchema: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["tools", "products"],
              default: "tools",
              description: "Whether to return top tools or top products",
            },
            limit: {
              type: "integer",
              minimum: 1,
              maximum: 50,
              default: 20,
            },
          },
        },
      },
    ],
    meta: {
      catalog: `${SITE_CONFIG.url}/.well-known/api-catalog`,
      skills: `${SITE_CONFIG.url}/.well-known/agent-skills/index.json`,
      mcpJson: `${SITE_CONFIG.url}/.well-known/mcp.json`,
      alias: `${SITE_CONFIG.url}/mcp`,
    },
  }

  return NextResponse.json(serverCard, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
