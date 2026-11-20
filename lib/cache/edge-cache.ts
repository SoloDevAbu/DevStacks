// Imported by worker.ts, which wrangler bundles outside Next.js, so only relative imports here.
import {
  EDGE_API_CACHE,
  EDGE_HTML_CACHE,
  EDGE_HTML_CACHE_BYPASS_COOKIES,
  EDGE_HTML_CACHE_BYPASS_HEADERS,
  EDGE_HTML_CACHE_EXCLUDED_PREFIXES,
  EDGE_HTML_CACHE_IGNORED_PARAM_PREFIXES,
  EDGE_HTML_CACHE_IGNORED_PARAMS,
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

type CacheStatus = "HIT" | "STALE" | "MISS" | "BYPASS"

interface CachePolicy {
  url: string
  freshSeconds: number
  contentType: string
}

const IGNORED_PARAMS = new Set<string>(EDGE_HTML_CACHE_IGNORED_PARAMS)
const API_PATHS = new Set<string>(EDGE_API_CACHE.PATHS)

// One background refresh per URL per isolate, so a burst of stale hits does not render the page
// once per request.
const refreshing = new Set<string>()

const getEdgeCache = () =>
  (globalThis as unknown as { caches?: { default?: Cache } }).caches?.default

const isIgnoredParam = (name: string) =>
  IGNORED_PARAMS.has(name) ||
  EDGE_HTML_CACHE_IGNORED_PARAM_PREFIXES.some((prefix) => name.startsWith(prefix))

const hasBypassHeader = (request: Request) =>
  EDGE_HTML_CACHE_BYPASS_HEADERS.some((header) => request.headers.has(header))

const getApiPolicy = (url: URL): CachePolicy => {
  url.searchParams.sort()
  url.hash = ""
  return {
    url: url.toString(),
    freshSeconds: EDGE_API_CACHE.FRESH_SECONDS,
    contentType: "application/json",
  }
}

const getHtmlPolicy = (request: Request, url: URL): CachePolicy | null => {
  if (url.pathname.includes(".")) return null
  const isExcluded = EDGE_HTML_CACHE_EXCLUDED_PREFIXES.some(
    (prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`)
  )
  if (isExcluded) return null

  const accept = request.headers.get("accept") ?? ""
  if (!accept.includes("text/html") || accept.includes("markdown")) return null

  const cookie = request.headers.get("cookie") ?? ""
  if (EDGE_HTML_CACHE_BYPASS_COOKIES.some((name) => cookie.includes(name))) return null

  const params = [...url.searchParams.keys()]
  if (params.some((name) => !isIgnoredParam(name))) return null

  url.search = ""
  url.hash = ""
  return {
    url: url.toString(),
    freshSeconds: EDGE_HTML_CACHE.FRESH_SECONDS,
    contentType: "text/html",
  }
}

// Returns how the request is cached, or null when it must reach OpenNext.
const getCachePolicy = (request: Request): CachePolicy | null => {
  if (request.method !== "GET" || hasBypassHeader(request)) return null
  const url = new URL(request.url)
  return API_PATHS.has(url.pathname) ? getApiPolicy(url) : getHtmlPolicy(request, url)
}

const isCacheableResponse = (response: Response, policy: CachePolicy) => {
  const cacheControl = response.headers.get("cache-control") ?? ""
  return (
    response.status === 200 &&
    (response.headers.get("content-type") ?? "").includes(policy.contentType) &&
    !response.headers.has("set-cookie") &&
    !/private|no-store|no-cache/.test(cacheControl)
  )
}

const isFresh = (cached: Response, policy: CachePolicy) => {
  const storedAt = Number(cached.headers.get(EDGE_HTML_CACHE.STORED_AT_HEADER))
  return Date.now() - storedAt < policy.freshSeconds * 1000
}

const withStatus = (response: Response, status: CacheStatus) => {
  const headers = new Headers(response.headers)
  headers.set(EDGE_HTML_CACHE.STATUS_HEADER, status)
  headers.delete(EDGE_HTML_CACHE.STORED_AT_HEADER)
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
  headers.set(EDGE_HTML_CACHE.STORED_AT_HEADER, String(Date.now()))
  headers.set("cache-control", `public, s-maxage=${EDGE_HTML_CACHE.STALE_SECONDS}`)
  return new Response(response.body, { status: response.status, headers })
}

const store = (cache: Cache, key: Request, response: Response) =>
  cache
    .put(key, toStoredCopy(response))
    .catch((error: unknown) => console.error("[EdgeCache] put failed:", error))

// Renders the URL again and replaces the stored copy. A URL that is gone or no longer cacheable is
// dropped so the stale copy is not served for the rest of STALE_SECONDS.
const refresh = async <Env>(
  handler: FetchHandler<Env>,
  request: Request,
  env: Env,
  ctx: ExecutionContext,
  cache: Cache,
  key: Request,
  policy: CachePolicy
) => {
  if (refreshing.has(key.url)) return
  refreshing.add(key.url)
  try {
    // Without the visitor's validators OpenNext answers 200 with a body instead of a 304.
    const headers = new Headers(request.headers)
    headers.delete("if-none-match")
    headers.delete("if-modified-since")
    const response = await handler(new Request(key.url, { method: "GET", headers }), env, ctx)
    if (isCacheableResponse(response, policy)) await store(cache, key, response)
    else await cache.delete(key)
  } catch (error) {
    console.error("[EdgeCache] refresh failed:", error)
  } finally {
    refreshing.delete(key.url)
  }
}

export const withEdgeCache =
  <Env>(handler: FetchHandler<Env>): FetchHandler<Env> =>
  async (request, env, ctx) => {
    const cache = getEdgeCache()
    const policy = cache ? getCachePolicy(request) : null
    if (!cache || !policy) return handler(request, env, ctx)

    const key = new Request(policy.url, { method: "GET" })
    const cached = await cache.match(key).catch(() => undefined)
    if (cached) {
      if (isFresh(cached, policy)) return withStatus(cached, "HIT")
      ctx.waitUntil(refresh(handler, request, env, ctx, cache, key, policy))
      return withStatus(cached, "STALE")
    }

    const response = await handler(request, env, ctx)
    if (!isCacheableResponse(response, policy)) return withStatus(response, "BYPASS")

    const [forVisitor, forCache] = response.body
      ? response.body.tee()
      : [null, null]
    ctx.waitUntil(store(cache, key, new Response(forCache, response)))
    return withStatus(new Response(forVisitor, response), "MISS")
  }
