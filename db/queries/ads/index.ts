import { db } from "@/db"
import { ads, adWeeks, tools, products } from "@/db/schema"
import type { Ad, NewAd, AdWeek, NewAdWeek } from "@/db/schema"
import { eq, and, lte, gte, desc, sql, inArray } from "drizzle-orm"
import type { AdPlacement, AdStatus } from "@/constants/ads"

export const getActiveAdsForCurrentWeek = async ({
  placement = "sidebar",
  limit = 3,
}: {
  placement?: AdPlacement
  limit?: number
}): Promise<
  (Ad & {
    tool: {
      id: string
      name: string
      tagline: string
      logoUrl: string | null
      websiteUrl: string
      slug: string
    } | null
    product: {
      id: string
      name: string
      tagline: string
      logoUrl: string | null
      websiteUrl: string
      slug: string
    } | null
  })[]
> => {
  const now = new Date()

  const activeWeeks = await db
    .select({ adId: adWeeks.adId })
    .from(adWeeks)
    .where(
      and(
        eq(adWeeks.placement, placement),
        eq(adWeeks.status, "active"),
        lte(adWeeks.startDate, now),
        gte(adWeeks.endDate, now)
      )
    )
    .limit(limit)

  if (activeWeeks.length === 0) return []

  const adIds = activeWeeks.map((w) => w.adId)

  const results = await db
    .select({
      ad: ads,
      tool: {
        id: tools.id,
        name: tools.name,
        tagline: tools.tagline,
        logoUrl: tools.logoUrl,
        websiteUrl: tools.websiteUrl,
        slug: tools.slug,
      },
      product: {
        id: products.id,
        name: products.name,
        tagline: products.tagline,
        logoUrl: products.logoUrl,
        websiteUrl: products.websiteUrl,
        slug: products.slug,
      },
    })
    .from(ads)
    .leftJoin(tools, eq(ads.toolId, tools.id))
    .leftJoin(products, eq(ads.productId, products.id))
    .where(inArray(ads.id, adIds))
    .orderBy(desc(ads.createdAt))
    .limit(limit)

  return results.map((r) => ({
    ...r.ad,
    tool: r.tool?.id ? r.tool : null,
    product: r.product?.id ? r.product : null,
  }))
}

export const getAdById = async (id: string): Promise<Ad | null> => {
  const [ad] = await db.select().from(ads).where(eq(ads.id, id)).limit(1)
  return ad ?? null
}

export const getAdWithTargetUrl = async (
  id: string
): Promise<{ id: string; targetUrl: string } | null> => {
  const results = await db
    .select({
      adId: ads.id,
      toolWebsite: tools.websiteUrl,
      productWebsite: products.websiteUrl,
    })
    .from(ads)
    .leftJoin(tools, eq(ads.toolId, tools.id))
    .leftJoin(products, eq(ads.productId, products.id))
    .where(eq(ads.id, id))
    .limit(1)

  if (results.length === 0) return null

  const targetUrl = results[0].toolWebsite || results[0].productWebsite || null
  if (!targetUrl) return null

  return {
    id: results[0].adId,
    targetUrl,
  }
}

export const getUserAds = async (userId: string): Promise<Ad[]> =>
  db
    .select()
    .from(ads)
    .where(eq(ads.userId, userId))
    .orderBy(desc(ads.createdAt))

export const createAd = async (data: NewAd): Promise<Ad> => {
  const [ad] = await db.insert(ads).values(data).returning()
  return ad
}

export const createAdWeeks = async (data: NewAdWeek[]): Promise<AdWeek[]> =>
  db.insert(adWeeks).values(data).returning()

export const updateAdStatus = async (
  id: string,
  status: AdStatus
): Promise<Ad | null> => {
  const [updated] = await db
    .update(ads)
    .set({ status, updatedAt: new Date() })
    .where(eq(ads.id, id))
    .returning()

  return updated ?? null
}

export const activateAdWeeks = async (adId: string): Promise<void> => {
  await db
    .update(adWeeks)
    .set({ status: "active" })
    .where(eq(adWeeks.adId, adId))
}

export const deactivateAdWeeks = async (adId: string): Promise<void> => {
  await db
    .update(adWeeks)
    .set({ status: "expired" })
    .where(eq(adWeeks.adId, adId))
}

export const getProductAdWeekCount = async ({
  placement,
  toolId,
  productId,
}: {
  placement: AdPlacement
  toolId?: string | null
  productId?: string | null
}): Promise<number> => {
  if (!toolId && !productId) return 0

  const conditions = [
    eq(ads.placement, placement),
    sql`${adWeeks.status} NOT IN ('rejected', 'expired')`,
  ]

  if (toolId) conditions.push(eq(ads.toolId, toolId))
  if (productId) conditions.push(eq(ads.productId, productId))

  const result = await db
    .select({ count: sql<number>`count(${adWeeks.id})::int` })
    .from(adWeeks)
    .innerJoin(ads, eq(adWeeks.adId, ads.id))
    .where(and(...conditions))

  return result[0]?.count ?? 0
}

export const incrementAdImpression = async (id: string): Promise<void> => {
  await db
    .update(ads)
    .set({ impressionsCount: sql`${ads.impressionsCount} + 1` })
    .where(eq(ads.id, id))
}

export const incrementAdClick = async (id: string): Promise<void> => {
  await db
    .update(ads)
    .set({ clicksCount: sql`${ads.clicksCount} + 1` })
    .where(eq(ads.id, id))
}
