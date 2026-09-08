import { NextRequest, NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"
import { getTools } from "@/db/queries/tools/list"
import { getToolBySlug } from "@/db/queries/tools/get"
import { getProducts } from "@/db/queries/products/list"
import { getProductBySlug } from "@/db/queries/products/get"
import { getTrending } from "@/lib/rankings/trending"

export const revalidate = 0

const MCP_TOOLS = [
  {
    name: "search_tools",
    description: `Search ${SITE_CONFIG.name}'s developer tools directory by keyword or category. Returns a list of tools with tagline, verified build counts, and canonical URLs.`,
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        limit: { type: "integer", default: 10, minimum: 1, maximum: 25 },
      },
      required: ["query"],
    },
  },
  {
    name: "search_products",
    description: `Search developer-built applications cataloged on ${SITE_CONFIG.name}. Returns products with declared 'Built With' tech stacks and community likes.`,
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search query" },
        limit: { type: "integer", default: 10, minimum: 1, maximum: 25 },
      },
      required: ["query"],
    },
  },
  {
    name: "get_tool",
    description: `Fetch detailed specifications, pricing, and verified builds for a single developer tool by slug.`,
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Tool slug, e.g. 'supabase'" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_product",
    description: `Fetch detailed problem, solution, unique value, and verified tech stack for a product by slug.`,
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Product slug" },
      },
      required: ["slug"],
    },
  },
  {
    name: "get_leaderboard",
    description: `Fetch top ranked developer tools or trending products on ${SITE_CONFIG.name}.`,
    inputSchema: {
      type: "object",
      properties: {
        type: { type: "string", enum: ["tools", "products"], default: "tools" },
        limit: { type: "integer", default: 20, minimum: 1, maximum: 50 },
      },
    },
  },
]

export const GET = () => {
  const discovery = {
    name: `${SITE_CONFIG.name} MCP`,
    transport: "streamable-http",
    usage: "POST JSON-RPC 2.0 messages to this endpoint (/api/mcp). GET is discovery only.",
    endpoint: `${SITE_CONFIG.url}/api/mcp`,
    alias: `${SITE_CONFIG.url}/mcp`,
    documentation: `${SITE_CONFIG.url}/mcp.md`,
    htmlDocs: `${SITE_CONFIG.url}/mcp`,
    serverCard: `${SITE_CONFIG.url}/.well-known/mcp/server-card.json`,
    mcpJson: `${SITE_CONFIG.url}/.well-known/mcp.json`,
    aiSnapshot: `${SITE_CONFIG.url}/api/ai`,
    tools: MCP_TOOLS.map((t) => t.name),
  }

  return NextResponse.json(discovery, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}

interface JsonRpcRequest {
  jsonrpc?: string
  id?: string | number | null
  method?: string
  params?: Record<string, unknown>
}

export const POST = async (request: NextRequest) => {
  let body: JsonRpcRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } },
      { status: 400 }
    )
  }

  const { id = null, method, params = {} } = body

  if (method === "initialize") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: {
          name: "devstacks",
          version: "1.0.0",
        },
      },
    })
  }

  if (method === "ping") {
    return NextResponse.json({ jsonrpc: "2.0", id, result: {} })
  }

  if (method === "tools/list") {
    return NextResponse.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: MCP_TOOLS,
      },
    })
  }

  if (method === "tools/call") {
    const toolName = (params as { name?: string }).name
    const toolArgs = (params as { arguments?: Record<string, unknown> }).arguments ?? {}

    try {
      if (toolName === "search_tools") {
        const query = String(toolArgs.query ?? "")
        const limit = Number(toolArgs.limit ?? 10)
        const results = await getTools({ q: query, limit })
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(results) }],
          },
        })
      }

      if (toolName === "search_products") {
        const query = String(toolArgs.query ?? "")
        const limit = Number(toolArgs.limit ?? 10)
        const results = await getProducts({ q: query, limit })
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(results) }],
          },
        })
      }

      if (toolName === "get_tool") {
        const slug = String(toolArgs.slug ?? "")
        const tool = await getToolBySlug(slug)
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(tool ?? { error: "Tool not found" }) }],
          },
        })
      }

      if (toolName === "get_product") {
        const slug = String(toolArgs.slug ?? "")
        const product = await getProductBySlug(slug)
        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(product ?? { error: "Product not found" }) }],
          },
        })
      }

      if (toolName === "get_leaderboard") {
        const type = String(toolArgs.type ?? "tools")
        const limit = Number(toolArgs.limit ?? 20)
        const items =
          type === "products"
            ? await getTrending(limit)
            : await getTools({ sortBy: "builds", limit })

        return NextResponse.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(items) }],
          },
        })
      }

      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: `Tool '${toolName}' not found` },
      })
    } catch (err) {
      return NextResponse.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32000, message: err instanceof Error ? err.message : "Execution error" },
      })
    }
  }

  return NextResponse.json({
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: `Method '${method}' not found` },
  })
}
