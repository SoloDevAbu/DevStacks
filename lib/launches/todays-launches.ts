import { tools, products } from "@/db/schema"
import { gte, lte, and } from "drizzle-orm"
import { selectRankedLaunchPage } from "@/lib/launches/launch-queries"
import type { RankedItem } from "@/lib/rankings/types"

const getUtcDayRange = (now: Date) => {
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  const end = new Date(start)
  end.setUTCHours(23, 59, 59, 999)
  return { start, end }
}

const createdBetween = (
  table: typeof tools | typeof products,
  start: Date,
  end: Date
) => and(gte(table.createdAt, start), lte(table.createdAt, end))

export const getTodaysLaunches = ({
  limit = 30,
}: { limit?: number } = {}): Promise<RankedItem[]> => {
  const { start, end } = getUtcDayRange(new Date())
  return selectRankedLaunchPage(
    {
      toolFilter: createdBetween(tools, start, end),
      productFilter: createdBetween(products, start, end),
    },
    limit
  )
}
