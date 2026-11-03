import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import {
  MARKDOWN_MEDIA_TYPES,
  MARKDOWN_SUFFIX_ROUTES,
  MARKDOWN_TWIN_ROUTES,
  type MarkdownTwinRoute,
} from "@/constants/markdown-twins"

const getClientIp = (request: NextRequest) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip") ||
  "127.0.0.1"

const getComparisonSlugFromPath = (path: string): string | null => {
  if (
    path === "/producthunt-alternative" ||
    path === "/producthunt-alternative.md"
  )
    return "producthunt"
  if (path === "/uneed-alternative" || path === "/uneed-alternative.md")
    return "uneed"
  if (
    path === "/microlaunch-alternative" ||
    path === "/microlaunch-alternative.md"
  )
    return "microlaunch"
  if (path === "/betalist-alternative" || path === "/betalist-alternative.md")
    return "betalist"
  const compMatch = path.match(/^\/compare\/([^/]+?)(?:\.md)?$/)
  if (compMatch && compMatch[1]) return compMatch[1]
  const altSuffixMatch = path.match(/^\/([^/]+)-alternative(?:\.md)?$/)
  if (altSuffixMatch && altSuffixMatch[1]) return altSuffixMatch[1]
  return null
}

const comparisonTwin = (slug: string) => `/api/md/compare/${slug}`

const findTwin = (routes: readonly MarkdownTwinRoute[], pathname: string) => {
  for (const route of routes) {
    const match = pathname.match(route.pattern)
    if (match) return { route, match }
  }
  return null
}

const getMarkdownTwinPath = (pathname: string): string | null => {
  const found = findTwin(MARKDOWN_TWIN_ROUTES, pathname)
  if (found) return found.route.twin(found.match)
  const compSlug = getComparisonSlugFromPath(pathname)
  return compSlug ? comparisonTwin(compSlug) : null
}

const getMarkdownAliasPath = (pathname: string): string | null => {
  const found = findTwin(MARKDOWN_TWIN_ROUTES, pathname)
  if (found) return (found.route.alias ?? found.route.twin)(found.match)
  const compSlug = getComparisonSlugFromPath(pathname)
  return compSlug ? comparisonTwin(compSlug) : null
}

const getRateLimit = (method: string, pathname: string) => {
  const isCatalogEndpoint =
    pathname === "/api/tools" || pathname === "/api/products"
  if (method === "POST") return isCatalogEndpoint ? 10 : 30
  if (
    isCatalogEndpoint ||
    pathname === "/api/categories" ||
    pathname === "/api/trending"
  ) {
    return 60
  }
  return 120
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

  const withGeoHeaders = (res: NextResponse) => {
    if (userCountry) res.headers.set("x-user-country", userCountry)
    if (userRegion) res.headers.set("x-user-region", userRegion)
    return res
  }

  const nextWithHeaders = () => {
    const res = withGeoHeaders(
      NextResponse.next({ request: { headers: requestHeaders } })
    )
    const aliasPath = getMarkdownAliasPath(pathname)
    if (aliasPath) {
      res.headers.set(
        "Link",
        `<${request.nextUrl.origin}${aliasPath}>; rel="alternate"; type="text/markdown"`
      )
    }
    return res
  }

  const rewriteWithHeaders = (destinationPath: string) =>
    withGeoHeaders(
      NextResponse.rewrite(new URL(destinationPath, request.url), {
        request: { headers: requestHeaders },
      })
    )

  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    const method = request.method.toUpperCase()
    const rateCheck = rateLimit(
      `${getClientIp(request)}:${method}:${pathname}`,
      getRateLimit(method, pathname),
      60_000
    )

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

  // MCP alias rewrite: /.well-known/mcp -> /.well-known/mcp.json
  if (pathname === "/.well-known/mcp") {
    return rewriteWithHeaders("/.well-known/mcp.json")
  }

  if (pathname.endsWith(".md")) {
    const suffixTwin = findTwin(MARKDOWN_SUFFIX_ROUTES, pathname)
    if (suffixTwin) {
      return rewriteWithHeaders(suffixTwin.route.twin(suffixTwin.match))
    }
    const compSlug = getComparisonSlugFromPath(pathname)
    if (compSlug) return rewriteWithHeaders(comparisonTwin(compSlug))
  }

  if (MARKDOWN_MEDIA_TYPES.some((type) => acceptHeader.includes(type))) {
    const twinPath = getMarkdownTwinPath(pathname)
    if (twinPath) return rewriteWithHeaders(twinPath)
  }

  return nextWithHeaders()
}

export const config = {
  matcher: [
    "/api/:path*",
    "/.well-known/mcp",
    "/index.md",
    "/launches/:path*",
    "/tools/:path*",
    "/products/:path*",
    "/blog/:path*",
    "/makers/:path*",
    "/categories/:path*",
    "/alternatives/:path*",
    "/built-with/:path*",
    "/trending/:path*",
    "/compare/:path*",
    "/producthunt-alternative",
    "/producthunt-alternative.md",
    "/uneed-alternative",
    "/uneed-alternative.md",
    "/microlaunch-alternative",
    "/microlaunch-alternative.md",
    "/betalist-alternative",
    "/betalist-alternative.md",
    "/devhunt-alternative",
    "/devhunt-alternative.md",
    "/codehype-alternative",
    "/codehype-alternative.md",
    "/pricing",
    "/faq",
    "/terms",
    "/privacy",
    "/refund",
    "/",
  ],
}
