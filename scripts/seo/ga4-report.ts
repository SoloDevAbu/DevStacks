import { createAnalytics, type AnalyticsRow } from "./lib/google"
import { printMetric, readBaseline, writeSnapshot } from "./lib/snapshot"

const TOTAL_METRICS = [
  "activeUsers",
  "newUsers",
  "sessions",
  "screenPageViews",
  "engagementRate",
  "averageSessionDuration",
  "keyEvents",
] as const

const BREAKDOWN_LIMIT = 15

type Totals = Record<(typeof TOTAL_METRICS)[number], number>
type Snapshot = { current7d: Totals }

const CURRENT = { startDate: "7daysAgo", endDate: "yesterday" }
const PREVIOUS = { startDate: "14daysAgo", endDate: "8daysAgo" }
const MONTH = { startDate: "28daysAgo", endDate: "yesterday" }

const round = (value: number, digits = 2) => Number(value.toFixed(digits))

const toTotals = (row: AnalyticsRow | undefined): Totals =>
  Object.fromEntries(
    TOTAL_METRICS.map((metric) => [metric, round(Number(row?.[metric] ?? 0))])
  ) as Totals

const printRows = (title: string, rows: AnalyticsRow[], key: string, metric: string) => {
  console.log(title)
  rows.slice(0, 8).forEach((row) => console.log(`  ${String(row[key]).padEnd(50)} ${row[metric]}`))
}

const main = async () => {
  const ga4 = await createAnalytics()
  const breakdown = (dimension: string, metrics: string[]) =>
    ga4.runReport({
      dateRanges: [CURRENT],
      dimensions: [dimension],
      metrics,
      orderBy: metrics[0],
      limit: BREAKDOWN_LIMIT,
    })

  const [current, previous, daily, pages, sources, countries, devices, events] = await Promise.all([
    ga4.runReport({ dateRanges: [CURRENT], metrics: [...TOTAL_METRICS] }),
    ga4.runReport({ dateRanges: [PREVIOUS], metrics: [...TOTAL_METRICS] }),
    ga4.runReport({ dateRanges: [MONTH], dimensions: ["date"], metrics: ["activeUsers", "sessions"], limit: 31 }),
    breakdown("pagePath", ["screenPageViews", "activeUsers"]),
    breakdown("sessionSourceMedium", ["sessions", "activeUsers"]),
    breakdown("country", ["activeUsers"]),
    breakdown("deviceCategory", ["activeUsers"]),
    breakdown("eventName", ["eventCount"]),
  ])

  const snapshot = {
    generatedAt: new Date().toISOString(),
    propertyId: ga4.propertyId,
    current7d: toTotals(current[0]),
    previous7d: toTotals(previous[0]),
    daily: [...daily].sort((a, b) => String(a.date).localeCompare(String(b.date))),
    pages,
    sources,
    countries,
    devices,
    events,
  }
  const baseline = readBaseline<Snapshot>("ga4")
  const path = writeSnapshot("ga4", snapshot)

  console.log(`GA4 property ${ga4.propertyId}, last 7 days -> ${path}`)
  TOTAL_METRICS.forEach((metric) =>
    printMetric(`${metric} (prev 7d ${snapshot.previous7d[metric]})`, snapshot.current7d[metric], baseline?.current7d[metric])
  )
  printRows("Top pages (views)", pages, "pagePath", "screenPageViews")
  printRows("Top sources (sessions)", sources, "sessionSourceMedium", "sessions")
  printRows("Countries (users)", countries, "country", "activeUsers")
  printRows("Devices (users)", devices, "deviceCategory", "activeUsers")
  printRows("Events", events, "eventName", "eventCount")
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
