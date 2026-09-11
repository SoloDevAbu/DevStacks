import { NextResponse } from "next/server"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 86400

export const GET = () => {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: `${SITE_CONFIG.name} Public API`,
      summary: "Read-only REST API for the developer tools and products catalog.",
      description: `Public, unauthenticated REST API for ${SITE_CONFIG.name}. Use this contract to search tools and products, inspect verified tech stacks, read leaderboard rankings, and fetch entity details. No API key required for GET requests. Rate limit: 120 requests per minute per IP. RFC 9457 Problem Details for errors. CLI: npx @devstacks/cli (see ${SITE_CONFIG.url}/cli). MCP Streamable HTTP: POST ${SITE_CONFIG.url}/api/mcp.`,
      version: "1.0.0",
      contact: {
        name: SITE_CONFIG.name,
        url: `${SITE_CONFIG.url}/cli`,
        email: "support@devstacks.io",
      },
      license: {
        name: "Public read-only API",
        url: `${SITE_CONFIG.url}/terms`,
      },
    },
    servers: [
      {
        url: SITE_CONFIG.url,
        description: "Production Server",
      },
    ],
    tags: [
      { name: "Catalog", description: "Developer tools and products catalog" },
      { name: "Search", description: "Live full-text search across catalog" },
      { name: "Rankings", description: "Community leaderboard and trending items" },
      { name: "Discovery", description: "API index and machine-readable discovery" },
    ],
    paths: {
      "/v1": {
        get: {
          tags: ["Discovery"],
          operationId: "getApiIndex",
          summary: "Public API index",
          description: "Lists all public REST endpoints, OpenAPI contract, CLI instructions, and MCP transport.",
          responses: {
            "200": {
              description: "API index summary",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ApiIndex" },
                },
              },
            },
          },
        },
      },
      "/v1/tools": {
        get: {
          tags: ["Catalog"],
          operationId: "listTools",
          summary: "List developer infrastructure tools",
          description: "Paginated catalog of developer tools with category and pricing filters.",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1, minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, minimum: 1, maximum: 60 } },
            { name: "q", in: "query", description: "Search query across name and tagline", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "pricing", in: "query", schema: { type: "string", enum: ["free", "freemium", "paid", "open_source"] } },
            { name: "sort", in: "query", schema: { type: "string", enum: ["upvotes", "builds", "newest", "name"], default: "builds" } },
          ],
          responses: {
            "200": {
              description: "Paginated list of tools",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ToolListResponse" },
                },
              },
            },
          },
        },
      },
      "/v1/tools/{slug}": {
        get: {
          tags: ["Catalog"],
          operationId: "getTool",
          summary: "Get tool details by slug",
          description: "Returns metadata, website, verified build count, and specifications for a single tool.",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Tool detail",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ToolDetail" },
                },
              },
            },
            "404": {
              description: "Tool not found",
              content: {
                "application/problem+json": {
                  schema: { $ref: "#/components/schemas/ProblemDetails" },
                },
              },
            },
          },
        },
      },
      "/v1/products": {
        get: {
          tags: ["Catalog"],
          operationId: "listProducts",
          summary: "List developer products and applications",
          description: "Paginated catalog of products with tag and category filtering.",
          parameters: [
            { name: "page", in: "query", schema: { type: "integer", default: 1, minimum: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 20, minimum: 1, maximum: 60 } },
            { name: "q", in: "query", schema: { type: "string" } },
            { name: "category", in: "query", schema: { type: "string" } },
            { name: "pricing", in: "query", schema: { type: "string", enum: ["free", "freemium", "paid", "open_source"] } },
            { name: "sort", in: "query", schema: { type: "string", enum: ["likes", "newest", "views"], default: "likes" } },
          ],
          responses: {
            "200": {
              description: "Paginated list of products",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProductListResponse" },
                },
              },
            },
          },
        },
      },
      "/v1/products/{slug}": {
        get: {
          tags: ["Catalog"],
          operationId: "getProduct",
          summary: "Get product details by slug",
          description: "Returns complete product overview, problem, solution, unique value, and verified tech stack.",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Product detail",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ProductDetail" },
                },
              },
            },
            "404": {
              description: "Product not found",
              content: {
                "application/problem+json": {
                  schema: { $ref: "#/components/schemas/ProblemDetails" },
                },
              },
            },
          },
        },
      },
      "/v1/search": {
        get: {
          tags: ["Search"],
          operationId: "searchCatalog",
          summary: "Search tools and products",
          description: "Unified keyword search across tools and products.",
          parameters: [
            { name: "q", in: "query", required: true, schema: { type: "string", minLength: 2 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10, maximum: 30 } },
          ],
          responses: {
            "200": {
              description: "Search results",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SearchResults" },
                },
              },
            },
          },
        },
      },
      "/v1/leaderboard": {
        get: {
          tags: ["Rankings"],
          operationId: "getLeaderboard",
          summary: "Top ranked tools and trending products",
          description: "Community upvotes and momentum rankings.",
          parameters: [
            { name: "limit", in: "query", schema: { type: "integer", default: 20, maximum: 50 } },
          ],
          responses: {
            "200": {
              description: "Leaderboard entries",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/LeaderboardResponse" },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        ApiIndex: {
          type: "object",
          properties: {
            name: { type: "string" },
            version: { type: "string" },
            openapi: { type: "string" },
            docs: { type: "string" },
            mcp: { type: "string" },
            endpoints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  method: { type: "string" },
                  path: { type: "string" },
                  summary: { type: "string" },
                },
              },
            },
          },
        },
        ProblemDetails: {
          type: "object",
          required: ["type", "title", "status", "detail"],
          properties: {
            type: { type: "string", format: "uri" },
            title: { type: "string" },
            status: { type: "integer" },
            detail: { type: "string" },
            instance: { type: "string" },
          },
        },
        ToolDetail: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            tagline: { type: "string" },
            description: { type: "string" },
            websiteUrl: { type: "string" },
            category: { type: "string" },
            pricing: { type: "string" },
            buildsCount: { type: "integer" },
            upvotesCount: { type: "integer" },
          },
        },
        ProductDetail: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            tagline: { type: "string" },
            description: { type: "string" },
            builtWithTools: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  toolSlug: { type: "string" },
                },
              },
            },
            pricing: { type: "string" },
          },
        },
        ToolListResponse: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            data: { type: "array", items: { $ref: "#/components/schemas/ToolDetail" } },
          },
        },
        ProductListResponse: {
          type: "object",
          properties: {
            page: { type: "integer" },
            limit: { type: "integer" },
            data: { type: "array", items: { $ref: "#/components/schemas/ProductDetail" } },
          },
        },
        SearchResults: {
          type: "object",
          properties: {
            query: { type: "string" },
            tools: { type: "array", items: { $ref: "#/components/schemas/ToolDetail" } },
            products: { type: "array", items: { $ref: "#/components/schemas/ProductDetail" } },
          },
        },
        LeaderboardResponse: {
          type: "object",
          properties: {
            tools: { type: "array", items: { $ref: "#/components/schemas/ToolDetail" } },
            products: { type: "array", items: { $ref: "#/components/schemas/ProductDetail" } },
          },
        },
      },
    },
  }

  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/openapi+json; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "index, follow",
    },
  })
}
