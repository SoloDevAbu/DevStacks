import { db } from "@/db"
import { tools, toolFaqs, payments } from "@/db/schema"
import type { NewTool } from "@/db/schema"
import { getOrCreateCategory } from "@/db/queries/categories/list"
import { getFaviconUrl } from "@/utils/urls"
import { slugify } from "@/utils/slug"
import { and, eq, isNull } from "drizzle-orm"
import {
  resolveAndValidateLaunchSlot,
  recordLaunchEntry,
} from "@/db/queries/launches/book"
import type { Tier } from "@/constants/plans"
import { randomBytes } from "crypto"

const nanoid = (len = 6) =>
  randomBytes(Math.ceil(len / 2))
    .toString("hex")
    .slice(0, len)

export type CreateToolInput = Omit<
  NewTool,
  | "id"
  | "slug"
  | "status"
  | "upvotesCount"
  | "buildsCount"
  | "commentsCount"
  | "viewsCount"
  | "createdAt"
  | "updatedAt"
  | "submitterId"
> & {
  submitterId: string
  paymentId?: string
  category?: string
  faqs?: Array<{ question: string; answer: string }>
}

export const createTool = async (data: CreateToolInput) => {
  const { category, faqs, paymentId, ...rest } = data

  let resolvedTier = rest.tier
  let validPaymentId: string | null = null

  if (paymentId && rest.submitterId) {
    const [payment] = await db
      .select({
        id: payments.id,
        tier: payments.tier,
      })
      .from(payments)
      .where(
        and(
          eq(payments.id, paymentId),
          eq(payments.userId, rest.submitterId),
          eq(payments.status, "succeeded"),
          eq(payments.paymentType, "listing"),
          isNull(payments.toolId),
          isNull(payments.productId)
        )
      )
      .limit(1)

    if (payment?.tier) {
      resolvedTier = payment.tier as Tier
      validPaymentId = payment.id
    }
  }

  const slot = await resolveAndValidateLaunchSlot({
    launchYear: rest.launchYear ?? undefined,
    launchWeek: rest.launchWeek ?? undefined,
    tier: resolvedTier ?? undefined,
  })

  // Enforce server-side Free tier guardrails
  if (slot.tier === "free") {
    if (rest.images && rest.images.length > 1) {
      rest.images = rest.images.slice(0, 1)
    }
    rest.metaTitle = undefined
    rest.metaDescription = undefined
    rest.aiContext = undefined
    rest.geoTarget = undefined
    rest.asoCategory = undefined
    rest.keywords = undefined
  }

  let categoryId = rest.categoryId
  if (!categoryId && category && category.trim()) {
    categoryId = await getOrCreateCategory(category)
  }

  const baseSlug = slugify(rest.name, "tool")
  const slug = `${baseSlug}-${nanoid()}`

  const logoUrl = rest.logoUrl?.trim() || getFaviconUrl(rest.websiteUrl)

  const [tool] = await db
    .insert(tools)
    .values({
      ...rest,
      tier: slot.tier,
      launchYear: slot.launchYear,
      launchWeek: slot.launchWeek,
      launchDate: slot.startDate,
      logoUrl,
      categoryId,
      slug,
      status: "pending",
    })
    .returning()

  if (tool) {
    await recordLaunchEntry({
      toolId: tool.id,
      submitterId: rest.submitterId,
      itemType: "tool",
      slot,
    })

    if (validPaymentId) {
      await db
        .update(payments)
        .set({
          toolId: tool.id,
          updatedAt: new Date(),
        })
        .where(eq(payments.id, validPaymentId))
    }
  }

  if (tool && faqs && faqs.length > 0 && slot.tier !== "free") {
    const validFaqs = faqs
      .filter((f) => f.question?.trim() && f.answer?.trim())
      .map((f, idx) => ({
        toolId: tool.id,
        question: f.question.trim(),
        answer: f.answer.trim(),
        sortOrder: idx,
      }))

    if (validFaqs.length > 0) {
      await db.insert(toolFaqs).values(validFaqs)
    }
  }

  return tool
}
