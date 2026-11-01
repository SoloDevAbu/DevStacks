import "dotenv/config"
import { setDefaultAutoSelectFamilyAttemptTimeout } from "node:net"
import { getCloudflareContext } from "@opennextjs/cloudflare"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import * as schema from "./schema"

type Database = ReturnType<typeof createDb>

// Supabase Connection Pooling requires prepare: false when using transaction pooler (port 6543)
// and works seamlessly across both direct and pooled connections.
// A short connect_timeout surfaces an unreachable database long before Next's 60s prerender limit.
const createDb = (connectionString: string, max: number) =>
  drizzle({
    client: postgres(connectionString, {
      prepare: false,
      max,
      connect_timeout: 10,
    }),
  })

const isWorkersRuntime =
  typeof navigator !== "undefined" &&
  navigator.userAgent === "Cloudflare-Workers"

// Workers forbid reusing a socket opened by another request, so each request gets its own client.
// The request's ExecutionContext is the key, letting the client be collected once the request ends.
const requestDbs = new WeakMap<object, Database>()

const getWorkersDb = () => {
  const { env, ctx } = getCloudflareContext()
  const existing = requestDbs.get(ctx)
  if (existing) return existing

  const instance = createDb(
    env.HYPERDRIVE?.connectionString ?? process.env.DATABASE_URL!,
    5
  )
  requestDbs.set(ctx, instance)
  return instance
}

const globalForDb = globalThis as unknown as { db: Database | undefined }

const getNodeDb = () => {
  if (globalForDb.db) return globalForDb.db

  // Node tries each resolved address for only 250ms by default. When the database is farther
  // than that (or IPv6 is unroutable), every address fails with an ETIMEDOUT AggregateError.
  setDefaultAutoSelectFamilyAttemptTimeout(2000)
  globalForDb.db = createDb(process.env.DATABASE_URL!, 1)
  return globalForDb.db
}

const getDb = () => (isWorkersRuntime ? getWorkersDb() : getNodeDb())

// Resolved on every property access so module-level consumers (e.g. the Better Auth adapter)
// always talk to the client that belongs to the current request.
export const db = new Proxy({} as Database, {
  get: (_, property) => {
    const instance = getDb()
    const value = Reflect.get(instance, property)
    return typeof value === "function" ? value.bind(instance) : value
  },
})

export { schema }
