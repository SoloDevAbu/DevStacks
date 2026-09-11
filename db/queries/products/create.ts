import { db } from "@/db"
import { products, productTools, tools } from "@/db/schema"
import type { NewProduct } from "@/db/schema"
import { getOrCreateCategory } from "@/db/queries/categories/list"
import { eq, ilike, or, sql } from "drizzle-orm"

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

export type CreateProductInput = Omit<
  NewProduct,
  | "id"
  | "slug"
  | "status"
  | "likesCount"
  | "commentsCount"
  | "viewsCount"
  | "createdAt"
  | "updatedAt"
> & {
  category?: string
  builtWithTools?: Array<
    | string
    | {
        name: string
        toolSlug?: string
        toolId?: string
      }
  >
}

export const createProduct = async (data: CreateProductInput) => {
  const { category, builtWithTools: toolsToLink, ...rest } = data

  let categoryId = rest.categoryId
  if (!categoryId && category && category.trim()) {
    categoryId = await getOrCreateCategory(category)
  }

  const baseSlug = slugify(rest.name)
  const slug = `${baseSlug}-${nanoid()}`

  const [product] = await db
    .insert(products)
    .values({
      ...rest,
      categoryId,
      slug,
      status: "pending",
    })
    .returning()

  if (toolsToLink && toolsToLink.length > 0) {
    for (const item of toolsToLink) {
      const name = (typeof item === "string" ? item : item.name).trim()
      if (!name) continue

      let toolId: string | null =
        typeof item !== "string" && item.toolId ? item.toolId : null

      if (!toolId && typeof item !== "string" && item.toolSlug) {
        const [found] = await db
          .select({ id: tools.id })
          .from(tools)
          .where(eq(tools.slug, item.toolSlug))
          .limit(1)
        if (found) toolId = found.id
      }

      if (!toolId) {
        const [found] = await db
          .select({ id: tools.id })
          .from(tools)
          .where(ilike(tools.name, name))
          .limit(1)
        if (found) toolId = found.id
      }

      await db
        .insert(productTools)
        .values({
          productId: product.id,
          toolId: toolId ?? null,
          name,
        })
        .onConflictDoNothing()

      if (toolId) {
        await db
          .update(tools)
          .set({ buildsCount: sql`${tools.buildsCount} + 1` })
          .where(eq(tools.id, toolId))
          .catch(() => {})
      }
    }
  }

  return product
}
