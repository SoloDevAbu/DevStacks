import { tools, products } from "@/db/schema"
import { eq, gte, lte, and, or, isNull, inArray } from "drizzle-orm"
import { unstable_cache } from "next/cache"
import { TIER } from "@/constants/plans"
import { CACHE_TAGS, CACHE_REVALIDATE_SECONDS } from "@/constants/cache"
import { getISOWeekRange } from "@/utils/iso-weeks"
import {
  selectRankedLaunches,
  selectRankedLaunchPage,
} from "@/lib/launches/launch-queries"
import type { RankedItem } from "@/lib/rankings/types"

const PREMIUM_TIERS = [TIER.PREMIUM, TIER.PREMIUM_PLUS]

// Items booked into a launch week carry launchYear/launchWeek; older listings without a booking
// count towards the week they were created in.
const launchedInWeek = (
  table: typeof tools | typeof products,
  year: number,
  week: number
) => {
  const { startDate, endDate } = getISOWeekRange(year, week)
  return or(
    and(eq(table.launchYear, year), eq(table.launchWeek, week)),
    and(
      isNull(table.launchYear),
      gte(table.createdAt, startDate),
      lte(table.createdAt, endDate)
    )
  )
}

export const getWeeklyLaunches = ({
  year,
  week,
  limit = 10,
}: {
  year: number
  week: number
  limit?: number
}): Promise<RankedItem[]> =>
  selectRankedLaunchPage(
    {
      toolFilter: launchedInWeek(tools, year, week),
      productFilter: launchedInWeek(products, year, week),
    },
    limit
  )

export const getWeeklyPremiumLaunches = ({
  year,
  week,
}: {
  year: number
  week: number
}): Promise<RankedItem[]> =>
  selectRankedLaunches({
    toolFilter: and(
      inArray(tools.tier, PREMIUM_TIERS),
      launchedInWeek(tools, year, week)
    ),
    productFilter: and(
      inArray(products.tier, PREMIUM_TIERS),
      launchedInWeek(products, year, week)
    ),
  })

export const getCachedWeeklyLaunches = unstable_cache(
  async (year: number, week: number, limit: number = 10) =>
    getWeeklyLaunches({ year, week, limit }),
  [CACHE_TAGS.WEEKLY_LAUNCHES],
  {
    revalidate: CACHE_REVALIDATE_SECONDS.LISTS,
    tags: [CACHE_TAGS.WEEKLY_LAUNCHES],
  }
)
