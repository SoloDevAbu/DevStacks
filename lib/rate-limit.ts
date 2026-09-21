import type { NextRequest } from "next/server"

type RateLimitRecord = {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitRecord>()

let lastCleanup = Date.now()
const CLEANUP_INTERVAL = 60_000
const MAX_ENTRIES = 10_000

const cleanupStore = () => {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL && store.size < MAX_ENTRIES) return
  lastCleanup = now

  for (const [key, record] of store.entries()) {
    if (record.resetAt <= now) {
      store.delete(key)
    }
  }

  if (store.size > MAX_ENTRIES) {
    const keysToDelete = Array.from(store.keys()).slice(0, 2000)
    for (const key of keysToDelete) {
      store.delete(key)
    }
  }
}

export type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: number
  resetSeconds: number
}

export const rateLimit = (
  identifier: string,
  limit = 60,
  windowMs = 60_000
): RateLimitResult => {
  cleanupStore()

  const now = Date.now()
  const windowKey = `${identifier}:${Math.floor(now / windowMs)}`
  const resetAt = Math.ceil(now / windowMs) * windowMs
  const resetSeconds = Math.max(1, Math.ceil((resetAt - now) / 1000))

  const record = store.get(windowKey) ?? { count: 0, resetAt }
  record.count += 1
  store.set(windowKey, record)

  const success = record.count <= limit
  const remaining = Math.max(0, limit - record.count)

  return {
    success,
    limit,
    remaining,
    reset: Math.ceil(resetAt / 1000),
    resetSeconds,
  }
}

export const getClientIp = (request: NextRequest): string =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  request.headers.get("x-real-ip")?.trim() ||
  "127.0.0.1"

export const isDeduplicated = (key: string, windowMs: number): boolean => {
  const result = rateLimit(key, 1, windowMs)
  return !result.success
}

export const isRateLimited = (
  key: string,
  windowMs: number,
  maxRequests: number
): boolean => {
  const result = rateLimit(key, maxRequests, windowMs)
  return !result.success
}
