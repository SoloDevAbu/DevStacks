import { and, eq, isNull, lt, lte, ne, or } from "drizzle-orm"
import { blogs, type tools, type products } from "@/db/schema"
import { BLOG_PLACEHOLDER_CONTENT } from "@/constants/blog"
import { getCurrentWeek } from "@/utils/iso-weeks"

interface LaunchSchedule {
  launchYear?: number | null
  launchWeek?: number | null
}

interface ListingVisibility extends LaunchSchedule {
  status?: string | null
  isDeleted?: boolean | null
}

// Listings booked into a future launch week stay private until Monday 00:00 UTC of that week;
// listings without a booking are public as soon as they are approved.
export const hasLaunched = (
  { launchYear, launchWeek }: LaunchSchedule,
  now: Date = new Date()
): boolean => {
  if (!launchYear || !launchWeek) return true
  const { year, week } = getCurrentWeek(now)
  return launchYear < year || (launchYear === year && launchWeek <= week)
}

export const isPubliclyVisible = (listing: ListingVisibility): boolean =>
  listing.status === "approved" && !listing.isDeleted && hasLaunched(listing)

interface BlogSchedule {
  status: string
  publishedAt: Date | null
  content: string
}

// A scheduled blog post goes live with its listing's launch date. A post whose generation never
// finished still holds the placeholder body and stays private until it is regenerated.
export const isBlogLive = (
  { status, publishedAt, content }: BlogSchedule,
  now: Date = new Date()
): boolean =>
  content !== BLOG_PLACEHOLDER_CONTENT &&
  (status === "published" ||
    (status === "scheduled" && publishedAt !== null && publishedAt <= now))

export const blogIsLive = (now: Date = new Date()) =>
  and(
    ne(blogs.content, BLOG_PLACEHOLDER_CONTENT),
    or(
      eq(blogs.status, "published"),
      and(eq(blogs.status, "scheduled"), lte(blogs.publishedAt, now))
    )
  )

export const launchedByNow = (table: typeof tools | typeof products) => {
  const { year, week } = getCurrentWeek()
  return or(
    isNull(table.launchYear),
    lt(table.launchYear, year),
    and(eq(table.launchYear, year), lte(table.launchWeek, week))
  )
}
