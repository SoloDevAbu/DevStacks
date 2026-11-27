import { db } from "@/db"
import { launches, listingRevisions, products, tools } from "@/db/schema"
import { and, desc, eq, inArray, or, sql } from "drizzle-orm"
import { SUBMISSION_STATUS } from "@/constants/moderation"
import type { LaunchItemType } from "@/constants/launches"

interface ListingRef {
  itemType: LaunchItemType
  itemId: string
}

const itemColumn = (itemType: LaunchItemType) =>
  itemType === "tool" ? listingRevisions.toolId : listingRevisions.productId

// New edits merge over an already-pending revision, so the reviewer always sees one combined diff.
export const upsertPendingRevision = async ({
  itemType,
  itemId,
  submitterId,
  payload,
  baseUpdatedAt,
}: ListingRef & {
  submitterId: string
  payload: Record<string, unknown>
  baseUpdatedAt: Date
}) => {
  const column = itemColumn(itemType)
  const [revision] = await db
    .insert(listingRevisions)
    .values({
      itemType,
      toolId: itemType === "tool" ? itemId : null,
      productId: itemType === "product" ? itemId : null,
      submitterId,
      payload,
      baseUpdatedAt,
    })
    .onConflictDoUpdate({
      target: column,
      targetWhere: sql`${listingRevisions.status} = 'pending'`,
      set: {
        payload: sql`${listingRevisions.payload} || excluded.payload`,
        updatedAt: new Date(),
      },
    })
    .returning()
  return revision
}

export const getPendingRevision = async ({ itemType, itemId }: ListingRef) => {
  const [revision] = await db
    .select()
    .from(listingRevisions)
    .where(
      and(
        eq(itemColumn(itemType), itemId),
        eq(listingRevisions.status, SUBMISSION_STATUS.PENDING)
      )
    )
    .limit(1)
  return revision ?? null
}

export const getPendingRevisionItemIds = async (itemIds: string[]) => {
  if (itemIds.length === 0) return new Set<string>()
  const rows = await db
    .select({
      toolId: listingRevisions.toolId,
      productId: listingRevisions.productId,
    })
    .from(listingRevisions)
    .where(
      and(
        eq(listingRevisions.status, SUBMISSION_STATUS.PENDING),
        or(
          inArray(listingRevisions.toolId, itemIds),
          inArray(listingRevisions.productId, itemIds)
        )
      )
    )
  return new Set(rows.map((row) => (row.toolId ?? row.productId) as string))
}

// A maker editing a rejected listing is resubmitting it, so it goes back into the queue.
export const resubmitRejectedListing = async ({ itemType, itemId }: ListingRef) => {
  const table = itemType === "tool" ? tools : products
  const now = new Date()
  await db
    .update(table)
    .set({
      status: SUBMISSION_STATUS.PENDING,
      reviewNote: null,
      reviewedBy: null,
      reviewedAt: null,
      updatedAt: now,
    })
    .where(eq(table.id, itemId))
  await db
    .update(launches)
    .set({ status: SUBMISSION_STATUS.PENDING, updatedAt: now })
    .where(
      itemType === "tool"
        ? eq(launches.toolId, itemId)
        : eq(launches.productId, itemId)
    )
}

// What the maker's edit page needs to explain where the listing stands in review.
export const getListingReviewState = async ({ itemType, itemId }: ListingRef) => {
  const table = itemType === "tool" ? tools : products
  const [[listing], [latestRevision]] = await Promise.all([
    db
      .select({ status: table.status, reviewNote: table.reviewNote })
      .from(table)
      .where(eq(table.id, itemId))
      .limit(1),
    db
      .select()
      .from(listingRevisions)
      .where(eq(itemColumn(itemType), itemId))
      .orderBy(desc(listingRevisions.updatedAt))
      .limit(1),
  ])

  return {
    status: listing?.status ?? SUBMISSION_STATUS.PENDING,
    reviewNote: listing?.reviewNote ?? null,
    pendingRevision:
      latestRevision?.status === SUBMISSION_STATUS.PENDING ? latestRevision : null,
    rejectedEditNote:
      latestRevision?.status === SUBMISSION_STATUS.REJECTED ? latestRevision.reviewNote : null,
  }
}

export type ListingReviewState = Awaited<ReturnType<typeof getListingReviewState>>
