import { isPaidTier } from "@/constants/plans"
import { db } from "@/db"
import { tools, products, users, launches, blogs, payments } from "@/db/schema"
import { eq, or, ilike, and, desc, count, type SQL } from "drizzle-orm"
import { generateAndSaveLaunchBlog } from "@/lib/ai/launch-blog-service"
import {
  ADMIN_FILTER_ANY,
  ADMIN_PAGE_SIZE,
  SUBMISSION_STATUS,
  SUBMISSION_STATUS_FILTER_ALL,
  type SubmissionStatus,
  type SubmissionStatusFilter,
} from "@/constants/moderation"
import type { LaunchItemType } from "@/constants/launches"

export const ADMIN_ITEM_TYPE_FILTER_ALL = ADMIN_FILTER_ANY
export type AdminItemTypeFilter = LaunchItemType | typeof ADMIN_ITEM_TYPE_FILTER_ALL

const listingTable = (itemType: LaunchItemType) =>
  itemType === "tool" ? tools : products

const listingConditions = (
  itemType: LaunchItemType,
  status: SubmissionStatusFilter,
  search?: string
) => {
  const table = listingTable(itemType)
  const conditions: SQL[] = [eq(table.isDeleted, false)]
  if (status !== SUBMISSION_STATUS_FILTER_ALL) {
    conditions.push(eq(table.status, status))
  }
  const term = search?.trim()
  if (term) {
    const pattern = `%${term}%`
    const match = or(
      ilike(table.name, pattern),
      ilike(table.tagline, pattern),
      ilike(table.slug, pattern)
    )
    if (match) conditions.push(match)
  }
  return and(...conditions)
}

const selectListingRows = (
  itemType: LaunchItemType,
  where: SQL | undefined,
  limit: number
) => {
  const table = listingTable(itemType)
  return db
    .select({
      id: table.id,
      slug: table.slug,
      name: table.name,
      tagline: table.tagline,
      logoUrl: table.logoUrl,
      tier: table.tier,
      status: table.status,
      launchYear: table.launchYear,
      launchWeek: table.launchWeek,
      createdAt: table.createdAt,
      submitterEmail: users.email,
      submitterName: users.name,
      blogStatus: blogs.status,
      blogGenerationStatus: blogs.generationStatus,
    })
    .from(table)
    .leftJoin(users, eq(table.submitterId, users.id))
    .leftJoin(blogs, eq(table.id, itemType === "tool" ? blogs.toolId : blogs.productId))
    .where(where)
    .orderBy(desc(table.createdAt))
    .limit(limit)
}

const countListings = async (itemType: LaunchItemType, where: SQL | undefined) => {
  const [row] = await db
    .select({ value: count() })
    .from(listingTable(itemType))
    .where(where)
  return row?.value ?? 0
}

export const getAdminSubmissions = async ({
  status = SUBMISSION_STATUS.PENDING,
  itemType = ADMIN_ITEM_TYPE_FILTER_ALL,
  search,
  page = 1,
  pageSize = ADMIN_PAGE_SIZE,
}: {
  status?: SubmissionStatusFilter
  itemType?: AdminItemTypeFilter
  search?: string
  page?: number
  pageSize?: number
} = {}) => {
  const types: LaunchItemType[] =
    itemType === ADMIN_ITEM_TYPE_FILTER_ALL ? ["tool", "product"] : [itemType]
  // Each source is newest-first, so the first page*pageSize rows of each cover the merged page.
  const window = page * pageSize

  const results = await Promise.all(
    types.map(async (type) => {
      const where = listingConditions(type, status, search)
      const [rows, total] = await Promise.all([
        selectListingRows(type, where, window),
        countListings(type, where),
      ])
      return { rows: rows.map((row) => ({ ...row, itemType: type })), total }
    })
  )

  const rows = results
    .flatMap((result) => result.rows)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice((page - 1) * pageSize, window)
  const total = results.reduce((sum, result) => sum + result.total, 0)

  return { rows, total }
}

export type AdminSubmissionRow = Awaited<
  ReturnType<typeof getAdminSubmissions>
>["rows"][number]

export const getAdminSubmissionDetail = async (
  itemType: LaunchItemType,
  id: string
) => {
  const table = listingTable(itemType)
  const [row] = await db
    .select({ item: table, submitter: users })
    .from(table)
    .leftJoin(users, eq(table.submitterId, users.id))
    .where(eq(table.id, id))
    .limit(1)
  if (!row) return null

  const itemColumn = itemType === "tool" ? "toolId" : "productId"
  const [blog, launch, listingPayments] = await Promise.all([
    db.select().from(blogs).where(eq(blogs[itemColumn], id)).limit(1),
    db.select().from(launches).where(eq(launches[itemColumn], id)).limit(1),
    db
      .select()
      .from(payments)
      .where(eq(payments[itemColumn], id))
      .orderBy(desc(payments.createdAt)),
  ])

  return {
    itemType,
    item: row.item,
    submitter: row.submitter
      ? { id: row.submitter.id, name: row.submitter.name, email: row.submitter.email }
      : null,
    blog: blog[0] ?? null,
    launch: launch[0] ?? null,
    payments: listingPayments,
  }
}

export type AdminSubmissionDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminSubmissionDetail>>
>

export const countPendingSubmissions = async () => {
  const [toolCount, productCount] = await Promise.all([
    countListings("tool", listingConditions("tool", SUBMISSION_STATUS.PENDING)),
    countListings("product", listingConditions("product", SUBMISSION_STATUS.PENDING)),
  ])
  return toolCount + productCount
}

export const updateSubmissionStatusAndTriggerBlog = async ({
  itemType,
  id,
  status,
  reviewNote,
  reviewerId,
}: {
  itemType: LaunchItemType
  id: string
  status: SubmissionStatus
  reviewNote?: string | null
  reviewerId: string
}) => {
  const table = listingTable(itemType)
  const now = new Date()
  const isReset = status === SUBMISSION_STATUS.PENDING

  const [updated] = await db
    .update(table)
    .set({
      status,
      reviewNote: status === SUBMISSION_STATUS.REJECTED ? (reviewNote ?? null) : null,
      reviewedBy: isReset ? null : reviewerId,
      reviewedAt: isReset ? null : now,
      updatedAt: now,
    })
    .where(and(eq(table.id, id), eq(table.isDeleted, false)))
    .returning()

  if (!updated) {
    throw new Error(`${itemType} with id "${id}" not found.`)
  }

  await db
    .update(launches)
    .set({ status, updatedAt: now })
    .where(itemType === "tool" ? eq(launches.toolId, id) : eq(launches.productId, id))

  const blogResult =
    status === SUBMISSION_STATUS.APPROVED && isPaidTier(updated.tier)
      ? await generateAndSaveLaunchBlog({ itemType, itemId: id, forceRegenerate: false })
      : null

  return { item: updated, blogResult }
}
