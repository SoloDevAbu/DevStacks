// Custom Worker entry: the OpenNext-generated handler plus a scheduled() handler for the weekly
// launch rollover, the badge re-check and the launch directory link check. `.open-next/worker.js` only exists after `opennextjs-cloudflare build`.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { default as openNextHandler } from "./.open-next/worker.js"
import { CRON, ROLLOVER_MARKER_PREFIX } from "./constants/cron"
import { ROUTES } from "./constants/routes"
import { SITE_CONFIG } from "./constants/site"
import { getCurrentWeek } from "./utils/iso-weeks"

interface MarkerBucket {
  head: (key: string) => Promise<unknown>
  put: (key: string, value: string) => Promise<unknown>
}

interface CronEnv {
  CRON_SECRET?: string
  WORKER_SELF_REFERENCE?: { fetch: (request: Request) => Promise<Response> }
  NEXT_INC_CACHE_R2_BUCKET?: MarkerBucket
}

interface ScheduledContext {
  waitUntil: (promise: Promise<unknown>) => void
}

interface ScheduledEvent {
  cron: string
}

const triggerCronRoute = async (
  env: CronEnv,
  route: string
): Promise<boolean> => {
  if (!env.CRON_SECRET || !env.WORKER_SELF_REFERENCE) {
    console.error("[Cron] CRON_SECRET or WORKER_SELF_REFERENCE is missing")
    return false
  }

  const response = await env.WORKER_SELF_REFERENCE.fetch(
    new Request(`https://${SITE_CONFIG.domain}${route}`, {
      method: "POST",
      headers: { authorization: `Bearer ${env.CRON_SECRET}` },
    })
  )
  console.log(`[Cron] ${route} ${response.status}: ${await response.text()}`)
  return response.ok
}

// The 00:30 retry exists only for a failed 00:00 run. Without this marker it re-ran every Monday,
// expiring every cache and pinging IndexNow twice for the same launches.
const runRollover = async (env: CronEnv, isRetry: boolean) => {
  const { year, week } = getCurrentWeek()
  const marker = `${ROLLOVER_MARKER_PREFIX}${year}-W${week}`
  const bucket = env.NEXT_INC_CACHE_R2_BUCKET

  if (isRetry && (await bucket?.head(marker))) {
    console.log(
      `[Cron] Rollover for ${year}-W${week} already ran, retry skipped`
    )
    return
  }

  const succeeded = await triggerCronRoute(env, ROUTES.CRON_ROLLOVER)
  if (succeeded) await bucket?.put(marker, new Date().toISOString())
}

const worker = {
  fetch: openNextHandler.fetch,
  scheduled: (event: ScheduledEvent, env: CronEnv, ctx: ScheduledContext) => {
    if (event.cron === CRON.BADGE_CHECK) {
      ctx.waitUntil(
        Promise.all([
          triggerCronRoute(env, ROUTES.CRON_BADGE_CHECK),
          triggerCronRoute(env, ROUTES.CRON_DIRECTORY_CHECK),
        ])
      )
      return
    }
    ctx.waitUntil(runRollover(env, event.cron === CRON.ROLLOVER_RETRY))
  },
}

export default worker

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export { DOQueueHandler, DOShardedTagCache } from "./.open-next/worker.js"
