import { db } from "@/db"
import { tools } from "@/db/schema"
import type { NewTool } from "@/db/schema"
import { getOrCreateCategory } from "@/db/queries/categories/list"

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
}

export const createTool = async (data: CreateToolInput) => {
  const { category, ...rest } = data

  let categoryId = rest.categoryId
  if (!categoryId && category && category.trim()) {
    categoryId = await getOrCreateCategory(category)
  }

  const baseSlug = slugify(rest.name)
  const slug = `${baseSlug}-${nanoid()}`

  const [tool] = await db
    .insert(tools)
    .values({
      ...rest,
      categoryId,
      slug,
      status: "pending",
    })
    .returning()

  return tool
}
