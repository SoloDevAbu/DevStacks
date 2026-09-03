import { db } from "@/db"
import { products } from "@/db/schema"
import type { NewProduct } from "@/db/schema"

const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

const nanoid = (len = 6) =>
  Math.random()
    .toString(36)
    .slice(2, 2 + len)

export const createProduct = async (
  data: Omit<NewProduct, "id" | "slug" | "status" | "upvotesCount" | "buildsCount" | "commentsCount" | "viewsCount" | "createdAt" | "updatedAt">
) => {
  const baseSlug = slugify(data.name)
  const slug = `${baseSlug}-${nanoid()}`

  const [product] = await db
    .insert(products)
    .values({ ...data, slug, status: "pending" })
    .returning()

  return product
}
