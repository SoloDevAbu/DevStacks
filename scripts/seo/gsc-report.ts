import { createSearchConsole } from "./lib/google"
import { daysAgo, isoDate } from "./lib/env"
import { printMetric, readBaseline, writeSnapshot } from "./lib/snapshot"

// Search Console data settles about 2 days after the fact.
const DATA_LAG_DAYS = 2
const SITE = "https://www.launchnests.com"
const INSPECT_TOP_PAGES = 25

interface Row {
  keys: string[]
  clicks: number
  impressions: number
  ctr: number
  position: number
}

const totals = (rows: Row[]) => {
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0)
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0)
  const weighted = rows.reduce((sum, row) => sum + row.position * row.impressions, 0)
  return {
    impressions,
    clicks,
    ctrPct: impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
    avgPosition: impressions ? Number((weighted / impressions).toFixed(1)) : 0,
  }
}

const compact = (row: Row) => ({
  key: row.keys.join(" | "),
  impressions: row.impressions,
  clicks: row.clicks,
  position: Number(row.position.toFixed(1)),
})

const diffByKey = (current: Row[], previous: Row[]) => {
  const before = new Map(previous.map((row) => [row.keys[0], row.impressions]))
  return current
    .map((row) => ({
      key: row.keys[0],
      impressions: row.impressions,
      previous: before.get(row.keys[0]) ?? 0,
      position: Number(row.position.toFixed(1)),
    }))
    .sort((a, b) => b.impressions - b.previous - (a.impressions - a.previous))
}

type Snapshot = { current7d: ReturnType<typeof totals> }

const main = async () => {
  const gsc = await createSearchConsole()
  const end = daysAgo(DATA_LAG_DAYS)
  const range = (startOffset: number, endOffset: number) => ({
    startDate: isoDate(daysAgo(startOffset, end.getTime())),
    endDate: isoDate(daysAgo(endOffset, end.getTime())),
  })
  const current = range(6, 0)
  const previous = range(13, 7)
  const month = range(27, 0)

  const [daily, pagesNow, pagesBefore, queriesNow, queriesBefore, queryPages28] = await Promise.all([
    gsc.searchAnalytics({ ...range(41, 0), dimensions: ["date"] }),
    gsc.searchAnalytics({ ...current, dimensions: ["page"] }),
    gsc.searchAnalytics({ ...previous, dimensions: ["page"] }),
    gsc.searchAnalytics({ ...current, dimensions: ["query"] }),
    gsc.searchAnalytics({ ...previous, dimensions: ["query"] }),
    gsc.searchAnalytics({ ...month, dimensions: ["query", "page"] }),
  ])

  const sections = Object.values(
    pagesNow.reduce<Record<string, { section: string; impressions: number; clicks: number }>>((acc, row) => {
      const url = new URL(row.keys[0])
      const section = `${url.host}/${url.pathname.split("/")[1] ?? ""}`
      acc[section] ??= { section, impressions: 0, clicks: 0 }
      acc[section].impressions += row.impressions
      acc[section].clicks += row.clicks
      return acc
    }, {})
  ).sort((a, b) => b.impressions - a.impressions)

  const topPages = [...pagesNow]
    .filter((row) => row.keys[0].startsWith(SITE))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, INSPECT_TOP_PAGES)
  const inspections = await Promise.all(
    topPages.map((row) => gsc.inspect(row.keys[0]).catch((error: Error) => ({ url: row.keys[0], error: error.message })))
  )

  const snapshot = {
    generatedAt: new Date().toISOString(),
    siteUrl: gsc.siteUrl,
    ranges: { current, previous, month },
    current7d: totals(pagesNow),
    previous7d: totals(pagesBefore),
    daily: daily.map((row) => ({ date: row.keys[0], impressions: row.impressions, clicks: row.clicks, position: Number(row.position.toFixed(1)) })),
    sections,
    pageDeltas: diffByKey(pagesNow, pagesBefore).slice(0, 30),
    queryDeltas: diffByKey(queriesNow, queriesBefore).slice(0, 30),
    lowCtr: queryPages28.filter((row) => row.impressions >= 20 && row.ctr < 0.02).sort((a, b) => b.impressions - a.impressions).slice(0, 30).map(compact),
    strikingDistance: queryPages28.filter((row) => row.position >= 4 && row.position <= 20 && row.impressions >= 5).sort((a, b) => b.impressions - a.impressions).slice(0, 30).map(compact),
    inspections,
  }
  const baseline = readBaseline<Snapshot>("gsc")
  const path = writeSnapshot("gsc", snapshot)

  console.log(`Search Console ${current.startDate}..${current.endDate} vs ${previous.startDate}..${previous.endDate} -> ${path}`)
  printMetric("impressions (7d)", snapshot.current7d.impressions, baseline?.current7d.impressions)
  printMetric("clicks (7d)", snapshot.current7d.clicks, baseline?.current7d.clicks)
  printMetric("CTR % (7d)", snapshot.current7d.ctrPct, baseline?.current7d.ctrPct)
  printMetric("avg position (7d)", snapshot.current7d.avgPosition, baseline?.current7d.avgPosition)
  printMetric("impressions previous 7d", snapshot.previous7d.impressions)
  console.log("Top sections")
  sections.slice(0, 8).forEach((row) => console.log(`  ${row.section.padEnd(40)} ${row.impressions} imp, ${row.clicks} clicks`))
  console.log("Biggest page gains")
  snapshot.pageDeltas.slice(0, 8).forEach((row) => console.log(`  ${row.key.replace(SITE, "")} ${row.previous} -> ${row.impressions} (pos ${row.position})`))
  const notIndexed = inspections.filter((row) => "verdict" in row && row.verdict !== "PASS")
  console.log(`URL inspection: ${inspections.length - notIndexed.length}/${inspections.length} indexed`)
  notIndexed.forEach((row) => console.log(`  ${row.url} ${"coverage" in row ? row.coverage : ""}`))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
