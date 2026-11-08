// Custom Worker entry: the OpenNext-generated handler plus a scheduled() handler for the weekly
// launch rollover and the badge re-check. `.open-next/worker.js` only exists after `opennextjs-cloudflare build`.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as openNextHandler } from "./.open-next/worker.js"
import { BADGE_CHECK_CRON } from "./constants/badges"
import { ROUTES } from "./constants/routes"
import { SITE_CONFIG } from "./constants/site"

interface CronEnv {
  CRON_SECRET?: string
  WORKER_SELF_REFERENCE?: { fetch: (request: Request) => Promise<Response> }
}

interface ScheduledContext {
  waitUntil: (promise: Promise<unknown>) => void
}

interface ScheduledEvent {
  cron: string
}

const triggerCronRoute = async (env: CronEnv, route: string) => {
  if (!env.CRON_SECRET || !env.WORKER_SELF_REFERENCE) {
    console.error("[Cron] CRON_SECRET or WORKER_SELF_REFERENCE is missing")
    return
  }

  const response = await env.WORKER_SELF_REFERENCE.fetch(
    new Request(`https://${SITE_CONFIG.domain}${route}`, {
      method: "POST",
      headers: { authorization: `Bearer ${env.CRON_SECRET}` },
    })
  )
  console.log(`[Cron] ${route} ${response.status}: ${await response.text()}`)
}

const worker = {
  fetch: openNextHandler.fetch,
  scheduled: (event: ScheduledEvent, env: CronEnv, ctx: ScheduledContext) => {
    const route =
      event.cron === BADGE_CHECK_CRON
        ? ROUTES.CRON_BADGE_CHECK
        : ROUTES.CRON_ROLLOVER
    ctx.waitUntil(triggerCronRoute(env, route))
  },
}

export default worker

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js"
