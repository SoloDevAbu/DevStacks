import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession, type AdminIdentity } from "@/lib/auth/admin"
import { SITE_CONFIG } from "@/constants/site"

interface AdminRouteContext<P> {
  params: Promise<P>
  admin: AdminIdentity
}

type AdminRouteHandler<P> = (
  req: NextRequest,
  ctx: AdminRouteContext<P>
) => Promise<Response>

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

const notFoundResponse = () =>
  NextResponse.json({ error: "Not found" }, { status: 404 })

// Cookies alone authorise the request, so a state-changing call must come from our own pages.
const isSameOrigin = (req: NextRequest) => {
  const origin = req.headers.get("origin")
  if (!origin) return false
  const allowed = new Set([req.nextUrl.origin, new URL(SITE_CONFIG.url).origin])
  return allowed.has(origin)
}

// Every /api/admin route is wrapped in this, so no handler can forget the check.
export const withAdmin =
  <P = Record<string, never>>(handler: AdminRouteHandler<P>) =>
  async (req: NextRequest, ctx: { params: Promise<P> }) => {
    if (!SAFE_METHODS.has(req.method.toUpperCase()) && !isSameOrigin(req)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { admin } = await getAdminSession(req.headers)
    if (!admin) return notFoundResponse()

    try {
      return await handler(req, { params: ctx.params, admin })
    } catch (err: unknown) {
      console.error(`[Admin ${req.method} ${req.nextUrl.pathname}]:`, err)
      const message = err instanceof Error ? err.message : "Request failed."
      return NextResponse.json({ error: message }, { status: 500 })
    }
  }
