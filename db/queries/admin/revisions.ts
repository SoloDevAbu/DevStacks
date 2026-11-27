import { db } from "@/db"
import {
  categories,
  listingRevisions,
  productFaqs,
  productTools,
  products,
  toolFaqs,
  tools,
  users,
} from "@/db/schema"
import { and, asc, count, desc, eq } from "drizzle-orm"
import { alias } from "drizzle-orm/pg-core"
import { applyProductUpdate } from "@/db/queries/products/update"
import { applyToolUpdate } from "@/db/queries/tools/update"
import { updateProductSchema } from "@/lib/validation/product"
import { updateToolSchema } from "@/lib/validation/tool"
import {
  ADMIN_PAGE_SIZE,
  SUBMISSION_STATUS,
  type SubmissionStatus,
} from "@/constants/moderation"

const reviewers = alias(users, "reviewers")

export const getAdminRevisions = async ({
  status = SUBMISSION_STATUS.PENDING,
  page = 1,
  pageSize = ADMIN_PAGE_SIZE,
}: { status?: SubmissionStatus; page?: number; pageSize?: number } = {}) => {
  const where = eq(listingRevisions.status, status)
  const [rows, [total]] = await Promise.all([
    db
      .select({
        id: listingRevisions.id,
        itemType: listingRevisions.itemType,
        status: listingRevisions.status,
        payload: listingRevisions.payload,
        createdAt: listingRevisions.createdAt,
        updatedAt: listingRevisions.updatedAt,
        reviewedAt: listingRevisions.reviewedAt,
        toolName: tools.name,
        productName: products.name,
        submitterEmail: users.email,
        reviewerEmail: reviewers.email,
      })
      .from(listingRevisions)
      .leftJoin(tools, eq(listingRevisions.toolId, tools.id))
      .leftJoin(products, eq(listingRevisions.productId, products.id))
      .innerJoin(users, eq(listingRevisions.submitterId, users.id))
      .leftJoin(reviewers, eq(listingRevisions.reviewedBy, reviewers.id))
      .where(where)
      .orderBy(
        status === SUBMISSION_STATUS.PENDING
          ? asc(listingRevisions.createdAt)
          : desc(listingRevisions.reviewedAt)
      )
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(listingRevisions).where(where),
  ])

  return {
    rows: rows.map(({ toolName, productName, payload, ...row }) => ({
      ...row,
      name: toolName ?? productName ?? "",
      changedFields: Object.keys(payload),
    })),
    total: total?.value ?? 0,
  }
}

export type AdminRevisionRow = Awaited<
  ReturnType<typeof getAdminRevisions>
>["rows"][number]

export const countPendingRevisions = async () => {
  const [row] = await db
    .select({ value: count() })
    .from(listingRevisions)
    .where(eq(listingRevisions.status, SUBMISSION_STATUS.PENDING))
  return row?.value ?? 0
}

const loadLiveFaqs = async (itemType: "tool" | "product", itemId: string) => {
  const table = itemType === "tool" ? toolFaqs : productFaqs
  const column = itemType === "tool" ? toolFaqs.toolId : productFaqs.productId
  return db
    .select({ question: table.question, answer: table.answer })
    .from(table)
    .where(eq(column, itemId))
    .orderBy(asc(table.sortOrder))
}

export const getAdminRevisionDetail = async (id: string) => {
  const [revision] = await db
    .select({ revision: listingRevisions, submitter: users })
    .from(listingRevisions)
    .innerJoin(users, eq(listingRevisions.submitterId, users.id))
    .where(eq(listingRevisions.id, id))
    .limit(1)
  if (!revision) return null

  const { itemType, toolId, productId } = revision.revision
  const itemId = (toolId ?? productId) as string
  const [live] =
    itemType === "tool"
      ? await db.select().from(tools).where(eq(tools.id, itemId)).limit(1)
      : await db.select().from(products).where(eq(products.id, itemId)).limit(1)
  if (!live) return null

  const [faqs, builtWith, category] = await Promise.all([
    loadLiveFaqs(itemType, itemId),
    itemType === "product"
      ? db
          .select({ name: productTools.name })
          .from(productTools)
          .where(eq(productTools.productId, itemId))
      : Promise.resolve([]),
    live.categoryId
      ? db
          .select({ name: categories.name })
          .from(categories)
          .where(eq(categories.id, live.categoryId))
          .limit(1)
      : Promise.resolve([]),
  ])

  return {
    revision: revision.revision,
    submitter: {
      id: revision.submitter.id,
      name: revision.submitter.name,
      email: revision.submitter.email,
    },
    live: {
      ...(live as Record<string, unknown>),
      faqs,
      builtWithTools: builtWith.map((tool) => tool.name),
      categoryName: category[0]?.name ?? null,
    },
    liveItem: live,
    isStale: live.updatedAt.getTime() > revision.revision.baseUpdatedAt.getTime(),
  }
}

export type AdminRevisionDetail = NonNullable<
  Awaited<ReturnType<typeof getAdminRevisionDetail>>
>

const markRevision = async (
  id: string,
  status: SubmissionStatus,
  reviewerId: string,
  reviewNote: string | null
) => {
  const [revision] = await db
    .update(listingRevisions)
    .set({
      status,
      reviewNote,
      reviewedBy: reviewerId,
      reviewedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(listingRevisions.id, id),
        eq(listingRevisions.status, SUBMISSION_STATUS.PENDING)
      )
    )
    .returning()
  if (!revision) throw new Error("Revision not found or already reviewed.")
  return revision
}

// The payload is re-validated before it touches the live row, in case the schema tightened since
// the maker submitted it.
export const approveRevision = async (id: string, reviewerId: string) => {
  const detail = await getAdminRevisionDetail(id)
  if (!detail || detail.revision.status !== SUBMISSION_STATUS.PENDING) {
    throw new Error("Revision not found or already reviewed.")
  }
  const { revision, liveItem } = detail

  const updated =
    revision.itemType === "tool"
      ? await applyToolUpdate(
          liveItem as typeof tools.$inferSelect,
          updateToolSchema.parse(revision.payload)
        )
      : await applyProductUpdate(
          liveItem as typeof products.$inferSelect,
          updateProductSchema.parse(revision.payload)
        )

  const reviewed = await markRevision(id, SUBMISSION_STATUS.APPROVED, reviewerId, null)
  return { revision: reviewed, item: updated ?? liveItem, submitter: detail.submitter }
}

export const rejectRevision = async (
  id: string,
  reviewerId: string,
  reviewNote: string
) => {
  const detail = await getAdminRevisionDetail(id)
  if (!detail) throw new Error("Revision not found.")
  const reviewed = await markRevision(id, SUBMISSION_STATUS.REJECTED, reviewerId, reviewNote)
  return { revision: reviewed, item: detail.liveItem, submitter: detail.submitter }
}
