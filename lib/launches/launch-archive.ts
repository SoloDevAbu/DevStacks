import { unstable_cache } from "next/cache"
import { and, eq, sql } from "drizzle-orm"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { CACHE_TAGS, CACHE_REVALIDATE_SECONDS } from "@/constants/cache"
import { launchedByNow } from "@/lib/catalog/visibility"

export interface LaunchWeekSummary {
  year: number
  week: number
  count: number
  lastUpdated: string
}

// Mirrors launchedInWeek: booked listings count towards their launch week, older listings without
// a booking towards the ISO week they were created in.
const countLaunchesPerWeek = (table: typeof tools | typeof products) =>
  db
    .select({
      year: sql<number>`coalesce(${table.launchYear}, extract(isoyear from ${table.createdAt} at time zone 'UTC')::int)`.mapWith(
        Number
      ),
      week: sql<number>`coalesce(${table.launchWeek}, extract(week from ${table.createdAt} at time zone 'UTC')::int)`.mapWith(
        Number
      ),
      count: sql<number>`count(*)::int`.mapWith(Number),
      lastUpdated: sql<string>`max(${table.updatedAt})`.mapWith(String),
    })
    .from(table)
    .where(
      and(
        eq(table.status, "approved"),
        eq(table.isDeleted, false),
        launchedByNow(table)
      )
    )
    .groupBy(sql`1, 2`)

const getLaunchWeekSummaries = async (): Promise<LaunchWeekSummary[]> => {
  const rows = (
    await Promise.all([countLaunchesPerWeek(tools), countLaunchesPerWeek(products)])
  ).flat()

  const byWeek = new Map<string, LaunchWeekSummary>()
  for (const row of rows) {
    const key = `${row.year}-${row.week}`
    const existing = byWeek.get(key)
    byWeek.set(key, {
      year: row.year,
      week: row.week,
      count: (existing?.count ?? 0) + row.count,
      lastUpdated:
        existing && new Date(existing.lastUpdated) > new Date(row.lastUpdated)
          ? existing.lastUpdated
          : row.lastUpdated,
    })
  }

  return [...byWeek.values()].sort((a, b) => b.year - a.year || b.week - a.week)
}

export const getCachedLaunchWeekSummaries = unstable_cache(
  getLaunchWeekSummaries,
  [CACHE_TAGS.WEEKLY_LAUNCHES, "summaries"],
  {
    revalidate: CACHE_REVALIDATE_SECONDS.LISTS,
    tags: [CACHE_TAGS.WEEKLY_LAUNCHES],
  }
)
