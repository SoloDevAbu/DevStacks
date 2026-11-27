import { db } from "@/db"
import { adWeeks, ads, products, tools, users } from "@/db/schema"
import { and, asc, count, desc, eq, gte, inArray } from "drizzle-orm"
import { ADMIN_AD_TRANSITIONS, type AdStatus } from "@/constants/ads"
import { ADMIN_PAGE_SIZE } from "@/constants/moderation"

export const getAdminAds = async ({
  status,
  page = 1,
  pageSize = ADMIN_PAGE_SIZE,
}: { status?: AdStatus; page?: number; pageSize?: number } = {}) => {
  const where = status ? eq(ads.status, status) : undefined
  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: ads.id,
        status: ads.status,
        placement: ads.placement,
        totalWeeks: ads.totalWeeks,
        totalAmount: ads.totalAmount,
        impressionsCount: ads.impressionsCount,
        clicksCount: ads.clicksCount,
        createdAt: ads.createdAt,
        ownerEmail: users.email,
        toolName: tools.name,
        productName: products.name,
      })
      .from(ads)
      .innerJoin(users, eq(ads.userId, users.id))
      .leftJoin(tools, eq(ads.toolId, tools.id))
      .leftJoin(products, eq(ads.productId, products.id))
      .where(where)
      .orderBy(desc(ads.createdAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(ads).where(where),
  ])

  const weeks = rows.length
    ? await db
        .select({
          adId: adWeeks.adId,
          isoYear: adWeeks.isoYear,
          isoWeek: adWeeks.isoWeek,
          status: adWeeks.status,
        })
        .from(adWeeks)
        .where(inArray(adWeeks.adId, rows.map((row) => row.id)))
        .orderBy(asc(adWeeks.isoYear), asc(adWeeks.isoWeek))
    : []

  return {
    rows: rows.map(({ toolName, productName, ...row }) => ({
      ...row,
      listingName: toolName ?? productName ?? null,
      weeks: weeks.filter((week) => week.adId === row.id),
    })),
    total: total?.value ?? 0,
  }
}

export type AdminAdRow = Awaited<ReturnType<typeof getAdminAds>>["rows"][number]

// Serving reads ad_weeks, so the weeks that haven't ended yet follow the ad's new state.
export const setAdStatusByAdmin = async (id: string, status: AdStatus) => {
  const [current] = await db
    .select({ status: ads.status })
    .from(ads)
    .where(eq(ads.id, id))
    .limit(1)
  if (!current) throw new Error("Ad not found.")
  if (!ADMIN_AD_TRANSITIONS[current.status]?.includes(status)) {
    throw new Error(`An ${current.status} ad can't be moved to ${status}.`)
  }

  const now = new Date()
  const [updated] = await db
    .update(ads)
    .set({ status, updatedAt: now })
    .where(eq(ads.id, id))
    .returning()
  await db
    .update(adWeeks)
    .set({ status })
    .where(and(eq(adWeeks.adId, id), gte(adWeeks.endDate, now)))

  return { previousStatus: current.status, ad: updated }
}
