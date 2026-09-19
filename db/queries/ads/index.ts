import { db } from "@/db"
import { ads } from "@/db/schema"
import type { Ad, NewAd } from "@/db/schema"
import { eq, and, lte, gte, desc, sql } from "drizzle-orm"
import type { AdPlacement, AdStatus } from "@/constants/ads"

export const getActiveAds = async ({
  placement = "sidebar",
  limit = 5,
}: {
  placement?: AdPlacement
  limit?: number
}): Promise<Ad[]> => {
  const now = new Date()

  return db
    .select()
    .from(ads)
    .where(
      and(
        eq(ads.placement, placement),
        eq(ads.status, "active"),
        lte(ads.startDate, now),
        gte(ads.endDate, now)
      )
    )
    .orderBy(desc(ads.createdAt))
    .limit(limit)
}

export const getAdById = async (id: string): Promise<Ad | null> => {
  const [ad] = await db.select().from(ads).where(eq(ads.id, id)).limit(1)
  return ad ?? null
}

export const getUserAds = async (userId: string): Promise<Ad[]> => {
  return db
    .select()
    .from(ads)
    .where(eq(ads.userId, userId))
    .orderBy(desc(ads.createdAt))
}

export const createAd = async (data: NewAd): Promise<Ad> => {
  const [ad] = await db.insert(ads).values(data).returning()
  return ad
}

export const updateAd = async (
  id: string,
  data: Partial<NewAd>
): Promise<Ad | null> => {
  const [updated] = await db
    .update(ads)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(ads.id, id))
    .returning()

  return updated ?? null
}

export const updateAdStatus = async (
  id: string,
  status: AdStatus,
  dates?: { startDate: Date; endDate: Date }
): Promise<Ad | null> => {
  const updateData: Partial<NewAd> = {
    status,
    updatedAt: new Date(),
  }

  if (dates) {
    updateData.startDate = dates.startDate
    updateData.endDate = dates.endDate
  }

  const [updated] = await db
    .update(ads)
    .set(updateData)
    .where(eq(ads.id, id))
    .returning()

  return updated ?? null
}

export const incrementAdImpression = async (id: string): Promise<void> => {
  await db
    .update(ads)
    .set({
      impressionsCount: sql`${ads.impressionsCount} + 1`,
    })
    .where(eq(ads.id, id))
}

export const incrementAdClick = async (id: string): Promise<void> => {
  await db
    .update(ads)
    .set({
      clicksCount: sql`${ads.clicksCount} + 1`,
    })
    .where(eq(ads.id, id))
}
