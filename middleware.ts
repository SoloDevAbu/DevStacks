import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

const getClientIp = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "127.0.0.1"

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const acceptHeader = request.headers.get("accept") ?? ""

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const isAuthRoute = pathname.startsWith("/api/auth/")

    if (!isAuthRoute) {
      const ip = getClientIp(request)
      const method = request.method.toUpperCase()

      let limit = 60
      if (method === "POST") {
        if (pathname === "/api/tools" || pathname === "/api/products") {
          limit = 10
        } else {
          limit = 30
        }
      } else if (
        pathname === "/api/tools" ||
        pathname === "/api/products" ||
        pathname === "/api/categories" ||
        pathname === "/api/trending"
      ) {
        limit = 60
      } else {
        limit = 120
      }

      const identifier = `${ip}:${method}:${pathname}`
      const rateCheck = rateLimit(identifier, limit, 60_000)

      if (!rateCheck.success) {
        return new NextResponse(
          JSON.stringify({
            error: "Too many requests. Please try again later.",
          }),
          {
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": String(rateCheck.resetSeconds),
              "X-RateLimit-Limit": String(rateCheck.limit),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(rateCheck.reset),
            },
          }
        )
      }

      const response = NextResponse.next()
      response.headers.set("X-RateLimit-Limit", String(rateCheck.limit))
      response.headers.set("X-RateLimit-Remaining", String(rateCheck.remaining))
      response.headers.set("X-RateLimit-Reset", String(rateCheck.reset))
      return response
    }
  }

  // MCP alias rewrite: /.well-known/mcp -> /.well-known/mcp.json
  if (pathname === "/.well-known/mcp") {
    return NextResponse.rewrite(new URL("/.well-known/mcp.json", request.url))
  }

  // Support .md suffix on tools: /tools/supabase.md -> /api/md/tools/supabase
  const toolMdMatch = pathname.match(/^\/tools\/([^/]+)\.md$/)
  if (toolMdMatch && toolMdMatch[1]) {
    return NextResponse.rewrite(
      new URL(`/api/md/tools/${toolMdMatch[1]}`, request.url)
    )
  }

  // Support .md suffix on products: /products/decispher.md -> /api/md/products/decispher
  const productMdMatch = pathname.match(/^\/products\/([^/]+)\.md$/)
  if (productMdMatch && productMdMatch[1]) {
    return NextResponse.rewrite(
      new URL(`/api/md/products/${productMdMatch[1]}`, request.url)
    )
  }

  // Content negotiation for text/markdown on tools, products, and root
  if (acceptHeader.includes("text/markdown") || acceptHeader.includes("text/x-markdown")) {
    const toolMatch = pathname.match(/^\/tools\/([^/]+)$/)
    if (toolMatch && toolMatch[1]) {
      return NextResponse.rewrite(
        new URL(`/api/md/tools/${toolMatch[1]}`, request.url)
      )
    }

    const productMatch = pathname.match(/^\/products\/([^/]+)$/)
    if (productMatch && productMatch[1]) {
      return NextResponse.rewrite(
        new URL(`/api/md/products/${productMatch[1]}`, request.url)
      )
    }

    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/api/md/_catalog", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/.well-known/mcp",
    "/tools/:path*",
    "/products/:path*",
    "/",
  ],
}
