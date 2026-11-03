// Custom Worker entry: the OpenNext-generated handler plus a scheduled() handler for the weekly
// launch rollover. `.open-next/worker.js` only exists after `opennextjs-cloudflare build`.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as openNextHandler } from "./.open-next/worker.js"
import { ROUTES } from "./constants/routes"
import { SITE_CONFIG } from "./constants/site"

interface RolloverEnv {
  CRON_SECRET?: string
  WORKER_SELF_REFERENCE?: { fetch: (request: Request) => Promise<Response> }
}

interface ScheduledContext {
  waitUntil: (promise: Promise<unknown>) => void
}

const triggerRollover = async (env: RolloverEnv) => {
  if (!env.CRON_SECRET || !env.WORKER_SELF_REFERENCE) {
    console.error("[Cron] CRON_SECRET or WORKER_SELF_REFERENCE is missing")
    return
  }

  const response = await env.WORKER_SELF_REFERENCE.fetch(
    new Request(`https://${SITE_CONFIG.domain}${ROUTES.CRON_ROLLOVER}`, {
      method: "POST",
      headers: { authorization: `Bearer ${env.CRON_SECRET}` },
    })
  )
  console.log(`[Cron] Rollover ${response.status}: ${await response.text()}`)
}

const worker = {
  fetch: openNextHandler.fetch,
  scheduled: (_event: unknown, env: RolloverEnv, ctx: ScheduledContext) => {
    ctx.waitUntil(triggerRollover(env))
  },
}

export default worker

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js"
