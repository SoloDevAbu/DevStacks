import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const acceptHeader = request.headers.get("accept") ?? ""

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
    "/.well-known/mcp",
    "/tools/:path*",
    "/products/:path*",
    "/",
  ],
}
