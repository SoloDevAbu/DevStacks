// Imported by worker.ts, which wrangler bundles outside Next.js, so only relative imports here.
import {
  EDGE_HTML_CACHE,
  EDGE_HTML_CACHE_BYPASS_COOKIES,
  EDGE_HTML_CACHE_BYPASS_HEADERS,
  EDGE_HTML_CACHE_EXCLUDED_PREFIXES,
  EDGE_HTML_CACHE_STRIPPED_HEADERS,
} from "../../constants/edge-cache"

interface ExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void
}

type FetchHandler<Env> = (
  request: Request,
  env: Env,
  ctx: ExecutionContext
) => Promise<Response>

const getEdgeCache = () =>
  (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default

const isCacheableRequest = (request: Request) => {
  if (request.method !== "GET") return false

  const url = new URL(request.url)
  if (url.search) return false
  if (url.pathname.includes(".")) return false
  const isExcluded = EDGE_HTML_CACHE_EXCLUDED_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  )
  if (isExcluded) return false

  const accept = request.headers.get("accept") ?? ""
  if (!accept.includes("text/html") || accept.includes("markdown")) return false
  if (EDGE_HTML_CACHE_BYPASS_HEADERS.some((header) => request.headers.has(header))) {
    return false
  }

  const cookie = request.headers.get("cookie") ?? ""
  return !EDGE_HTML_CACHE_BYPASS_COOKIES.some((name) => cookie.includes(name))
}

const isCacheableResponse = (response: Response) => {
  const cacheControl = response.headers.get("cache-control") ?? ""
  return (
    response.status === 200 &&
    (response.headers.get("content-type") ?? "").includes("text/html") &&
    !response.headers.has("set-cookie") &&
    !/private|no-store|no-cache/.test(cacheControl)
  )
}

const withStatus = (response: Response, status: "HIT" | "MISS" | "BYPASS") => {
  const headers = new Headers(response.headers)
  headers.set(EDGE_HTML_CACHE.STATUS_HEADER, status)
  const originCacheControl = headers.get(EDGE_HTML_CACHE.ORIGIN_CACHE_CONTROL_HEADER)
  if (originCacheControl !== null) {
    headers.set("cache-control", originCacheControl)
    headers.delete(EDGE_HTML_CACHE.ORIGIN_CACHE_CONTROL_HEADER)
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

// The stored copy carries its own TTL for the Cache API; the visitor still gets the header OpenNext
// chose, restored from ORIGIN_CACHE_CONTROL_HEADER on the way out.
const toStoredCopy = (response: Response) => {
  const headers = new Headers(response.headers)
  EDGE_HTML_CACHE_STRIPPED_HEADERS.forEach((header) => headers.delete(header))
  headers.set(EDGE_HTML_CACHE.ORIGIN_CACHE_CONTROL_HEADER, headers.get("cache-control") ?? "")
  headers.set("cache-control", `public, s-maxage=${EDGE_HTML_CACHE.TTL_SECONDS}`)
  return new Response(response.body, { status: response.status, headers })
}

export const withEdgeHtmlCache =
  <Env>(handler: FetchHandler<Env>): FetchHandler<Env> =>
  async (request, env, ctx) => {
    const cache = getEdgeCache()
    if (!cache || !isCacheableRequest(request)) return handler(request, env, ctx)

    const key = new Request(new URL(request.url).toString(), { method: "GET" })
    const cached = await cache.match(key).catch(() => undefined)
    if (cached) return withStatus(cached, "HIT")

    const response = await handler(request, env, ctx)
    if (!isCacheableResponse(response)) return withStatus(response, "BYPASS")

    const [forVisitor, forCache] = response.body
      ? response.body.tee()
      : [null, null]
    const visitorResponse = new Response(forVisitor, response)
    ctx.waitUntil(
      cache
        .put(key, toStoredCopy(new Response(forCache, response)))
        .catch((error: unknown) => console.error("[EdgeCache] put failed:", error))
    )
    return withStatus(visitorResponse, "MISS")
  }
