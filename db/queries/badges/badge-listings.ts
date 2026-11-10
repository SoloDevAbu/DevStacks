import { and, asc, eq, isNull, lte, or, type SQL } from "drizzle-orm"
import { db } from "@/db"
import { tools, products } from "@/db/schema"
import { BADGE_CHECK } from "@/constants/badges"
import type { BadgeCheckUpdate } from "@/lib/badges/badge-state"
import { DAY_MS } from "@/utils/date"

export type ListingKind = "tool" | "product"

type ListingTable = typeof tools | typeof products

const getListingTable = (itemKind: ListingKind): ListingTable =>
  itemKind === "tool" ? tools : products

const badgeColumns = (table: ListingTable) => ({
  id: table.id,
  slug: table.slug,
  websiteUrl: table.websiteUrl,
  badgeVerified: table.badgeVerified,
  badgeUrl: table.badgeUrl,
  badgeCheckedAt: table.badgeCheckedAt,
  badgeCheckFailures: table.badgeCheckFailures,
  launchYear: table.launchYear,
  launchWeek: table.launchWeek,
  createdAt: table.createdAt,
})

const selectBadgeListings = async (
  itemKind: ListingKind,
  buildFilter: (table: ListingTable) => SQL | undefined,
  limit: number
) => {
  const table = getListingTable(itemKind)
  const rows = await db
    .select(badgeColumns(table))
    .from(table as typeof tools)
    .where(and(eq(table.isDeleted, false), buildFilter(table)))
    .orderBy(asc(table.badgeCheckedAt))
    .limit(limit)
  return rows.map((row) => ({ ...row, itemKind }))
}

export type BadgeListing = Awaited<
  ReturnType<typeof selectBadgeListings>
>[number]

export const getOwnedBadgeListing = async (
  itemKind: ListingKind,
  slug: string,
  userId: string
): Promise<BadgeListing | null> => {
  const [listing] = await selectBadgeListings(
    itemKind,
    (table) => and(eq(table.slug, slug), eq(table.submitterId, userId)),
    1
  )
  return listing ?? null
}

export const getListingsDueForBadgeCheck = async (
  now: Date
): Promise<BadgeListing[]> => {
  const cutoff = new Date(now.getTime() - BADGE_CHECK.INTERVAL_DAYS * DAY_MS)
  const isDue = (table: ListingTable) =>
    and(
      eq(table.badgeVerified, true),
      or(isNull(table.badgeCheckedAt), lte(table.badgeCheckedAt, cutoff))
    )

  const [dueTools, dueProducts] = await Promise.all([
    selectBadgeListings("tool", isDue, BADGE_CHECK.BATCH_SIZE),
    selectBadgeListings("product", isDue, BADGE_CHECK.BATCH_SIZE),
  ])

  return [...dueTools, ...dueProducts]
    .sort(
      (a, b) =>
        (a.badgeCheckedAt?.getTime() ?? 0) - (b.badgeCheckedAt?.getTime() ?? 0)
    )
    .slice(0, BADGE_CHECK.BATCH_SIZE)
}

// updatedAt stays untouched: a badge check is not a content change, and sitemap lastmod reads it.
export const saveBadgeCheck = async (
  { id, itemKind }: Pick<BadgeListing, "id" | "itemKind">,
  update: BadgeCheckUpdate
) => {
  if (itemKind === "tool") {
    await db.update(tools).set(update).where(eq(tools.id, id))
    return
  }
  await db.update(products).set(update).where(eq(products.id, id))
}
