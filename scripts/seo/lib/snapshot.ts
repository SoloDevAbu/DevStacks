import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const METRICS_DIR = join(process.cwd(), "reports", "metrics")

const listSnapshots = (prefix: string) => {
  mkdirSync(METRICS_DIR, { recursive: true })
  return readdirSync(METRICS_DIR)
    .filter((file) => file.startsWith(`${prefix}-`) && file.endsWith(".json"))
    .sort()
}

export const readBaseline = <T>(prefix: string): T | null => {
  const [first] = listSnapshots(prefix)
  return first ? JSON.parse(readFileSync(join(METRICS_DIR, first), "utf8")) : null
}

export const writeSnapshot = (prefix: string, data: unknown) => {
  listSnapshots(prefix)
  const stamp = new Date().toISOString().replace(/[:.]/g, "-")
  const path = join(METRICS_DIR, `${prefix}-${stamp}.json`)
  writeFileSync(path, JSON.stringify(data, null, 2))
  return path
}

const formatDelta = (now: number, then: number) => {
  if (!then) return ""
  const pct = ((now - then) / then) * 100
  return ` (${pct >= 0 ? "+" : ""}${pct.toFixed(0)}% vs baseline ${then})`
}

export const printMetric = (label: string, now: number, then?: number) =>
  console.log(`  ${label.padEnd(34)} ${now}${then === undefined ? "" : formatDelta(now, then)}`)
