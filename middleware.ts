import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"

const getClientIp = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "127.0.0.1"

const getComparisonSlugFromPath = (path: string): string | null => {
  if (path === "/producthunt-alternative" || path === "/producthunt-alternative.md") return "producthunt"
  if (path === "/uneed-alternative" || path === "/uneed-alternative.md") return "uneed"
  if (path === "/microlaunch-alternative" || path === "/microlaunch-alternative.md") return "microlaunch"
  if (path === "/betalist-alternative" || path === "/betalist-alternative.md") return "betalist"
  const compMatch = path.match(/^\/compare\/([^/]+?)(?:\.md)?$/)
  if (compMatch && compMatch[1]) return compMatch[1]
  const altSuffixMatch = path.match(/^\/([^/]+)-alternative(?:\.md)?$/)
  if (altSuffixMatch && altSuffixMatch[1]) return altSuffixMatch[1]
  return null
}

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const acceptHeader = request.headers.get("accept") ?? ""

  // Edge geolocation headers extraction
  const userCountry =
    request.headers.get("x-vercel-ip-country") ||
    request.headers.get("cf-ipcountry") ||
    ""
  const userRegion =
    request.headers.get("x-vercel-ip-country-region") ||
    request.headers.get("cf-region-code") ||
    ""

  const requestHeaders = new Headers(request.headers)
  if (userCountry) {
    requestHeaders.set("x-user-country", userCountry)
  }
  if (userRegion) {
    requestHeaders.set("x-user-region", userRegion)
  }

  const nextWithHeaders = () => {
    const res = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
    if (userCountry) res.headers.set("x-user-country", userCountry)
    if (userRegion) res.headers.set("x-user-region", userRegion)

    const origin = request.nextUrl.origin
    const categoryMatch = pathname.match(/^\/tools\/category\/([^/]+)$/)
    if (categoryMatch && categoryMatch[1]) {
      res.headers.set(
        "Link",
        `<${origin}/api/md/tools/category/${categoryMatch[1]}>; rel="alternate"; type="text/markdown"`
      )
    } else {
      const altMatch = pathname.match(/^\/alternatives\/([^/]+)$/)
      if (altMatch && altMatch[1]) {
        res.headers.set(
          "Link",
          `<${origin}/api/md/alternatives/${altMatch[1]}>; rel="alternate"; type="text/markdown"`
        )
      } else {
        const builtWithMatch = pathname.match(/^\/built-with\/([^/]+)$/)
        if (builtWithMatch && builtWithMatch[1]) {
          res.headers.set(
            "Link",
            `<${origin}/api/md/built-with/${builtWithMatch[1]}>; rel="alternate"; type="text/markdown"`
          )
        } else {
          const toolMatch = pathname.match(/^\/tools\/([^/]+)$/)
          if (toolMatch && toolMatch[1]) {
            res.headers.set(
              "Link",
              `<${origin}/tools/${toolMatch[1]}.md>; rel="alternate"; type="text/markdown"`
            )
          } else {
            const productMatch = pathname.match(/^\/products\/([^/]+)$/)
            if (productMatch && productMatch[1]) {
              res.headers.set(
                "Link",
                `<${origin}/products/${productMatch[1]}.md>; rel="alternate"; type="text/markdown"`
              )
            } else {
              const makerMatch = pathname.match(/^\/makers\/([^/]+)$/)
              if (makerMatch && makerMatch[1]) {
                res.headers.set(
                  "Link",
                  `<${origin}/makers/${makerMatch[1]}.md>; rel="alternate"; type="text/markdown"`
                )
              } else if (pathname === "/pricing") {
                res.headers.set(
                  "Link",
                  `<${origin}/pricing.md>; rel="alternate"; type="text/markdown"`
                )
              } else if (pathname === "/faq") {
                res.headers.set(
                  "Link",
                  `<${origin}/faq.md>; rel="alternate"; type="text/markdown"`
                )
              } else {
                const compSlug = getComparisonSlugFromPath(pathname)
                if (compSlug) {
                  res.headers.set(
                    "Link",
                    `<${origin}/api/md/compare/${compSlug}>; rel="alternate"; type="text/markdown"`
                  )
                }
              }
            }
          }
        }
      }
    }

    return res
  }

  const rewriteWithHeaders = (destinationUrl: string) => {
    const res = NextResponse.rewrite(new URL(destinationUrl, request.url), {
      request: {
        headers: requestHeaders,
      },
    })
    if (userCountry) res.headers.set("x-user-country", userCountry)
    if (userRegion) res.headers.set("x-user-region", userRegion)
    return res
  }

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

      const response = nextWithHeaders()
      response.headers.set("X-RateLimit-Limit", String(rateCheck.limit))
      response.headers.set("X-RateLimit-Remaining", String(rateCheck.remaining))
      response.headers.set("X-RateLimit-Reset", String(rateCheck.reset))
      return response
    }
  }

  // MCP alias rewrite: /.well-known/mcp -> /.well-known/mcp.json
  if (pathname === "/.well-known/mcp") {
    return rewriteWithHeaders("/.well-known/mcp.json")
  }

  // Support .md suffix on comparison pages
  if (pathname.endsWith(".md")) {
    const compSlug = getComparisonSlugFromPath(pathname)
    if (compSlug) {
      return rewriteWithHeaders(`/api/md/compare/${compSlug}`)
    }
  }

  // Support .md suffix on tools: /tools/supabase.md -> /api/md/tools/supabase
  const toolMdMatch = pathname.match(/^\/tools\/([^/]+)\.md$/)
  if (toolMdMatch && toolMdMatch[1]) {
    return rewriteWithHeaders(`/api/md/tools/${toolMdMatch[1]}`)
  }

  // Support .md suffix on products: /products/decispher.md -> /api/md/products/decispher
  const productMdMatch = pathname.match(/^\/products\/([^/]+)\.md$/)
  if (productMdMatch && productMdMatch[1]) {
    return rewriteWithHeaders(`/api/md/products/${productMdMatch[1]}`)
  }

  // Support .md suffix on makers: /makers/alice.md -> /api/md/makers/alice
  const makerMdMatch = pathname.match(/^\/makers\/([^/]+)\.md$/)
  if (makerMdMatch && makerMdMatch[1]) {
    return rewriteWithHeaders(`/api/md/makers/${makerMdMatch[1]}`)
  }

  // Content negotiation for text/markdown on tools, products, makers, and root
  if (
    acceptHeader.includes("text/markdown") ||
    acceptHeader.includes("text/x-markdown")
  ) {
    const categoryMatch = pathname.match(/^\/tools\/category\/([^/]+)$/)
    if (categoryMatch && categoryMatch[1]) {
      return rewriteWithHeaders(`/api/md/tools/category/${categoryMatch[1]}`)
    }

    const altMatch = pathname.match(/^\/alternatives\/([^/]+)$/)
    if (altMatch && altMatch[1]) {
      return rewriteWithHeaders(`/api/md/alternatives/${altMatch[1]}`)
    }

    const builtWithMatch = pathname.match(/^\/built-with\/([^/]+)$/)
    if (builtWithMatch && builtWithMatch[1]) {
      return rewriteWithHeaders(`/api/md/built-with/${builtWithMatch[1]}`)
    }

    const toolMatch = pathname.match(/^\/tools\/([^/]+)$/)
    if (toolMatch && toolMatch[1]) {
      return rewriteWithHeaders(`/api/md/tools/${toolMatch[1]}`)
    }

    const productMatch = pathname.match(/^\/products\/([^/]+)$/)
    if (productMatch && productMatch[1]) {
      return rewriteWithHeaders(`/api/md/products/${productMatch[1]}`)
    }

    const makerMatch = pathname.match(/^\/makers\/([^/]+)$/)
    if (makerMatch && makerMatch[1]) {
      return rewriteWithHeaders(`/api/md/makers/${makerMatch[1]}`)
    }

    if (pathname === "/pricing") {
      return rewriteWithHeaders("/pricing.md")
    }

    if (pathname === "/faq") {
      return rewriteWithHeaders("/faq.md")
    }

    if (pathname === "/terms") {
      return rewriteWithHeaders("/terms.md")
    }

    if (pathname === "/privacy") {
      return rewriteWithHeaders("/privacy.md")
    }

    if (pathname === "/refund") {
      return rewriteWithHeaders("/refund.md")
    }

    const compSlug = getComparisonSlugFromPath(pathname)
    if (compSlug) {
      return rewriteWithHeaders(`/api/md/compare/${compSlug}`)
    }

    if (pathname === "/") {
      return rewriteWithHeaders("/api/md/_catalog")
    }
  }

  return nextWithHeaders()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/.well-known/mcp",
    "/tools/:path*",
    "/products/:path*",
    "/makers/:path*",
    "/categories/:path*",
    "/alternatives/:path*",
    "/built-with/:path*",
    "/trending/:path*",
    "/compare/:path*",
    "/producthunt-alternative",
    "/uneed-alternative",
    "/microlaunch-alternative",
    "/betalist-alternative",
    "/pricing",
    "/faq",
    "/terms",
    "/privacy",
    "/refund",
    "/",
  ],
}
