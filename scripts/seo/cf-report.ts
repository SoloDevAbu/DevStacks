import {
  cloudflareConfig,
  filter,
  graphql,
  isBlocked,
  observabilityQuery,
  type Blocked,
} from "./lib/cloudflare"
import { daysAgo, isoDate } from "./lib/env"
import { printMetric, readBaseline, writeSnapshot } from "./lib/snapshot"

const SCRIPT_NAME = "launchnests"
const WINDOW_DAYS = Number(process.argv[2] ?? 7)
const LIVE_SAMPLE_PATHS = [
  "/",
  "/tools",
  "/products",
  "/directories",
  "/alternatives/docker",
  "/tools/postgresql",
  "/producthunt-alternative",
]

const config = cloudflareConfig()
const until = new Date()
const since = daysAgo(WINDOW_DAYS)
const ms = (micros?: number | null) => (micros == null ? null : Math.round(micros / 1000))

type Account<T> = { accounts: T[] }

const rum = async <T>(dataset: string, fields: string, dims = "", limit = 1, order = "count_DESC") => {
  const result = await graphql<Account<Record<string, T[]>>>(
    config,
    `query($a:String!,$s:String!,$f:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){
      ${dataset}(limit:${limit},orderBy:[${order}],filter:{siteTag:$s,datetime_geq:$f,datetime_leq:$u}){
        count ${dims ? `dimensions{${dims}}` : ""} ${fields}}}}}`,
    { a: config.accountId, s: config.siteTag, f: since.toISOString(), u: until.toISOString() }
  )
  return isBlocked(result) ? result : result.accounts[0][dataset]
}

interface VitalsRow {
  count: number
  dimensions?: Record<string, string>
  quantiles: Record<string, number | null>
}

const VITALS_FIELDS = `quantiles{largestContentfulPaintP75 interactionToNextPaintP75 cumulativeLayoutShiftP75 timeToFirstByteP75}`

const toVitals = (row: VitalsRow) => ({
  samples: row.count,
  lcpMs: ms(row.quantiles.largestContentfulPaintP75),
  inpMs: ms(row.quantiles.interactionToNextPaintP75),
  cls: row.quantiles.cumulativeLayoutShiftP75,
  ttfbMs: ms(row.quantiles.timeToFirstByteP75),
})

const mapRows = <T, R>(rows: T[] | Blocked, map: (row: T) => R) =>
  isBlocked(rows) ? rows : rows.map(map)

const collectRum = async () => {
  const [total, byDevice, byPath, daily, referers, paths] = await Promise.all([
    rum<VitalsRow>("rumWebVitalsEventsAdaptiveGroups", VITALS_FIELDS),
    rum<VitalsRow>("rumWebVitalsEventsAdaptiveGroups", VITALS_FIELDS, "deviceType", 5),
    rum<VitalsRow>("rumWebVitalsEventsAdaptiveGroups", VITALS_FIELDS, "requestPath", 15),
    rum<{ count: number; dimensions: { date: string }; sum: { visits: number } }>(
      "rumPageloadEventsAdaptiveGroups", "sum{visits}", "date", 60, "date_ASC"
    ),
    rum<{ count: number; dimensions: { refererHost: string }; sum: { visits: number } }>(
      "rumPageloadEventsAdaptiveGroups", "sum{visits}", "refererHost", 15
    ),
    rum<{ count: number; dimensions: { requestPath: string }; sum: { visits: number } }>(
      "rumPageloadEventsAdaptiveGroups", "sum{visits}", "requestPath", 15
    ),
  ])
  return {
    vitals: isBlocked(total) ? total : toVitals(total[0]),
    vitalsByDevice: mapRows(byDevice, (row) => ({ device: row.dimensions?.deviceType, ...toVitals(row) })),
    vitalsByPath: mapRows(byPath, (row) => ({ path: row.dimensions?.requestPath, ...toVitals(row) })),
    dailyVisits: mapRows(daily, (row) => ({ date: row.dimensions.date, pageviews: row.count, visits: row.sum.visits })),
    referers: mapRows(referers, (row) => ({ host: row.dimensions.refererHost || "(direct)", visits: row.sum.visits })),
    topPaths: mapRows(paths, (row) => ({ path: row.dimensions.requestPath, pageviews: row.count })),
  }
}

interface WorkerRow {
  dimensions: { status: string }
  sum: { requests: number; errors: number }
  quantiles: { cpuTimeP50: number; cpuTimeP99: number; wallTimeP50: number; wallTimeP99: number }
}

const collectWorker = async () => {
  const vars = { a: config.accountId, f: since.toISOString(), u: until.toISOString() }
  const [invocations, durableObjects, r2] = await Promise.all([
    graphql<Account<{ workersInvocationsAdaptive: WorkerRow[] }>>(
      config,
      `query($a:String!,$f:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){
        workersInvocationsAdaptive(limit:20,orderBy:[sum_requests_DESC],filter:{scriptName:"${SCRIPT_NAME}",datetime_geq:$f,datetime_leq:$u}){
          dimensions{status} sum{requests errors} quantiles{cpuTimeP50 cpuTimeP99 wallTimeP50 wallTimeP99}}}}}`,
      vars
    ),
    graphql<Account<{ durableObjectsInvocationsAdaptiveGroups: { dimensions: { status: string }; sum: { requests: number } }[] }>>(
      config,
      `query($a:String!,$f:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){
        durableObjectsInvocationsAdaptiveGroups(limit:20,orderBy:[sum_requests_DESC],filter:{scriptName:"${SCRIPT_NAME}",datetime_geq:$f,datetime_leq:$u}){
          dimensions{status} sum{requests}}}}}`,
      vars
    ),
    graphql<Account<{ r2OperationsAdaptiveGroups: { dimensions: { actionType: string }; sum: { requests: number } }[] }>>(
      config,
      `query($a:String!,$f:Time!,$u:Time!){viewer{accounts(filter:{accountTag:$a}){
        r2OperationsAdaptiveGroups(limit:20,filter:{bucketName:"launchnests-inc-cache",datetime_geq:$f,datetime_leq:$u}){
          dimensions{actionType} sum{requests}}}}}`,
      vars
    ),
  ])

  const rows = isBlocked(invocations) ? invocations : invocations.accounts[0].workersInvocationsAdaptive
  const total = isBlocked(rows) ? 0 : rows.reduce((sum, row) => sum + row.sum.requests, 0)
  const byStatus = isBlocked(rows)
    ? rows
    : Object.fromEntries(rows.map((row) => [row.dimensions.status, row.sum.requests]))
  const success = isBlocked(rows) ? undefined : rows.find((row) => row.dimensions.status === "success")

  const doRows = isBlocked(durableObjects) ? durableObjects : durableObjects.accounts[0].durableObjectsInvocationsAdaptiveGroups
  const doByStatus = isBlocked(doRows)
    ? doRows
    : doRows.reduce<Record<string, number>>((acc, row) => {
        acc[row.dimensions.status] = (acc[row.dimensions.status] ?? 0) + row.sum.requests
        return acc
      }, {})

  const r2Rows = isBlocked(r2) ? r2 : r2.accounts[0].r2OperationsAdaptiveGroups
  return {
    requests: total,
    byStatus,
    exceededResourcesPct:
      isBlocked(byStatus) || !total ? null : Number((((byStatus.exceededResources ?? 0) / total) * 100).toFixed(2)),
    successCpuP50Ms: ms(success?.quantiles.cpuTimeP50),
    successWallP50Ms: ms(success?.quantiles.wallTimeP50),
    successWallP99Ms: ms(success?.quantiles.wallTimeP99),
    durableObjectsByStatus: doByStatus,
    r2: isBlocked(r2Rows)
      ? r2Rows
      : Object.fromEntries(r2Rows.map((row) => [row.dimensions.actionType, row.sum.requests])),
  }
}

const collectObservability = async () => {
  const window = { from: Math.max(since.getTime(), daysAgo(3).getTime()), to: until.getTime() }
  const script = filter("$workers.scriptName", "eq", SCRIPT_NAME)
  const [exceededCpuByUrl, errorMessages, statusCodes] = await Promise.all([
    observabilityQuery(config, {
      ...window,
      groupBy: "$workers.event.request.url",
      filters: [script, filter("$workers.outcome", "eq", "exceededCpu")],
    }),
    observabilityQuery(config, {
      ...window,
      groupBy: "$metadata.message",
      filters: [script, filter("$metadata.level", "eq", "error")],
      limit: 10,
    }),
    observabilityQuery(config, {
      ...window,
      groupBy: "$workers.event.response.status",
      filters: [script],
    }),
  ])
  const flatten = (rows: typeof exceededCpuByUrl) =>
    isBlocked(rows)
      ? rows
      : rows.map((row) => ({ key: String(row.groups?.[0]?.value ?? ""), count: row.value }))
  return {
    windowDays: Math.round((window.to - window.from) / 86_400_000),
    exceededCpuByUrl: flatten(exceededCpuByUrl),
    errorMessages: flatten(errorMessages),
    responseStatus: flatten(statusCodes),
  }
}

const collectZone = async () => {
  const result = await graphql<{ zones: { httpRequests1dGroups: unknown[] }[] }>(
    config,
    `query($z:String!,$f:Date!,$u:Date!){viewer{zones(filter:{zoneTag:$z}){
      httpRequests1dGroups(limit:60,orderBy:[date_ASC],filter:{date_geq:$f,date_leq:$u}){
        dimensions{date} sum{requests cachedRequests pageViews threats} uniq{uniques}}}}}`,
    { z: config.zoneId, f: isoDate(since), u: isoDate(until) }
  )
  return isBlocked(result) ? result : result.zones[0].httpRequests1dGroups
}

const probeLive = async () =>
  Promise.all(
    LIVE_SAMPLE_PATHS.map(async (path) => {
      const started = performance.now()
      const response = await fetch(`https://www.launchnests.com${path}`, {
        headers: { "User-Agent": "LaunchNests-SEO-Report/1.0" },
      })
      const ttfbMs = Math.round(performance.now() - started)
      await response.arrayBuffer()
      return {
        path,
        status: response.status,
        ttfbMs,
        opennextCache: response.headers.get("x-opennext-cache"),
        edgeCache: response.headers.get("x-edge-cache"),
        cacheControl: response.headers.get("cache-control"),
      }
    })
  )

type Snapshot = {
  generatedAt: string
  windowDays: number
  rum: Awaited<ReturnType<typeof collectRum>>
  worker: Awaited<ReturnType<typeof collectWorker>>
}

const main = async () => {
  const [rumData, worker, observability, zone, live] = await Promise.all([
    collectRum(),
    collectWorker(),
    collectObservability(),
    collectZone(),
    probeLive(),
  ])
  const snapshot = {
    generatedAt: until.toISOString(),
    windowDays: WINDOW_DAYS,
    rum: rumData,
    worker,
    observability,
    zone,
    live,
  }
  const baseline = readBaseline<Snapshot>("cf")
  const path = writeSnapshot("cf", snapshot)

  console.log(`Cloudflare report, last ${WINDOW_DAYS} days -> ${path}`)
  if (!isBlocked(rumData.vitals)) {
    const before = baseline && !isBlocked(baseline.rum.vitals) ? baseline.rum.vitals : undefined
    console.log("Core Web Vitals (p75, all devices)")
    printMetric("LCP ms", rumData.vitals.lcpMs ?? 0, before?.lcpMs ?? undefined)
    printMetric("INP ms", rumData.vitals.inpMs ?? 0, before?.inpMs ?? undefined)
    printMetric("CLS", rumData.vitals.cls ?? 0, before?.cls ?? undefined)
    printMetric("TTFB ms", rumData.vitals.ttfbMs ?? 0, before?.ttfbMs ?? undefined)
  }
  console.log("Worker")
  printMetric("requests", worker.requests, baseline?.worker.requests)
  printMetric("exceededResources %", worker.exceededResourcesPct ?? 0, baseline?.worker.exceededResourcesPct ?? undefined)
  printMetric("success CPU p50 ms", worker.successCpuP50Ms ?? 0, baseline?.worker.successCpuP50Ms ?? undefined)
  printMetric("success wall p50 ms", worker.successWallP50Ms ?? 0, baseline?.worker.successWallP50Ms ?? undefined)
  console.log("Durable Objects by status", JSON.stringify(worker.durableObjectsByStatus))
  console.log("R2 operations", JSON.stringify(worker.r2))
  console.log("Zone HTTP analytics", isBlocked(zone) ? `blocked: ${zone.blocked.slice(0, 120)}` : `${zone.length} days`)
  console.log("Live probe")
  live.forEach((row) =>
    console.log(`  ${row.path.padEnd(28)} ${row.status} ${row.ttfbMs}ms opennext=${row.opennextCache ?? "-"} edge=${row.edgeCache ?? "-"}`)
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
