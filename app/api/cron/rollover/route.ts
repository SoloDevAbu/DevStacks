import { type NextRequest, NextResponse, after } from "next/server"
import { revalidatePath, revalidateTag } from "next/cache"
import { CACHE_TAGS } from "@/constants/cache"
import { ROUTES } from "@/constants/routes"
import { HOMEPAGE_LIMITS } from "@/constants/rankings"
import { getWeeklyLaunches } from "@/lib/launches/weekly-launches"
import { getCurrentWeek } from "@/utils/iso-weeks"
import { warmPaths } from "@/lib/cache/warm"
import { submitToIndexNow } from "@/lib/seo/indexnow"
import { getListingPath } from "@/utils/urls"

export const dynamic = "force-dynamic"

const ROLLOVER_HUB_PATHS = [ROUTES.HOME, ROUTES.DISCOVER_WEEKLY_LAUNCHES]

const ROLLOVER_MACHINE_PATHS = [
  ROUTES.LLMS_TXT,
  ROUTES.LLMS_FULL_TXT,
  ROUTES.AI_SNAPSHOT,
  ROUTES.FEED,
]

const isAuthorized = (req: NextRequest) => {
  const secret = process.env.CRON_SECRET
  return Boolean(secret) && req.headers.get("authorization") === `Bearer ${secret}`
}

// Scheduled launches go live when the ISO week turns over (Monday 00:00 UTC), which no mutation
// signals. Every listing query hides future-week launches, so the cron expires all listing caches
// and the new launches' own pages (cached as 404 until now), re-renders the pages that list the
// new week and pings IndexNow so crawlers and AI search pick them up without waiting for a recrawl.
export const POST = async (req: NextRequest) => {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  Object.values(CACHE_TAGS).forEach((tag) => revalidateTag(tag, { expire: 0 }))

  const { year, week } = getCurrentWeek()
  const launches = await getWeeklyLaunches({
    year,
    week,
    limit: HOMEPAGE_LIMITS.WEEKLY_LAUNCHES_MAX,
  })
  const launchPaths = launches.map(getListingPath)
  launchPaths.forEach((path) => revalidatePath(path))

  after(async () => {
    await warmPaths([...ROLLOVER_HUB_PATHS, ...ROLLOVER_MACHINE_PATHS])
    await submitToIndexNow([...ROLLOVER_HUB_PATHS, ...launchPaths])
  })

  return NextResponse.json({ year, week, launches: launchPaths.length })
}
