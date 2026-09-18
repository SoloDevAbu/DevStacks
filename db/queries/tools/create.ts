import { db } from "@/db"
import { tools, toolFaqs } from "@/db/schema"
import type { NewTool } from "@/db/schema"
import { getOrCreateCategory } from "@/db/queries/categories/list"
import { getFaviconUrl } from "@/utils/urls"

import { randomBytes } from "crypto"

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

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
> & {
  category?: string
  faqs?: Array<{ question: string; answer: string }>
}

export const createTool = async (data: CreateToolInput) => {
  const { category, faqs, ...rest } = data

  let categoryId = rest.categoryId
  if (!categoryId && category && category.trim()) {
    categoryId = await getOrCreateCategory(category)
  }

  const baseSlug = slugify(rest.name)
  const slug = `${baseSlug}-${nanoid()}`

  const logoUrl = rest.logoUrl?.trim() || getFaviconUrl(rest.websiteUrl)

  const [tool] = await db
    .insert(tools)
    .values({
      ...rest,
      logoUrl,
      categoryId,
      slug,
      status: "approved",
    })
    .returning()

  if (tool && faqs && faqs.length > 0) {
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
