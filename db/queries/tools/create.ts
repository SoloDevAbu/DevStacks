import { db } from "@/db"
import { tools } from "@/db/schema"
import type { NewTool } from "@/db/schema"

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

export const createTool = async (
  data: Omit<NewTool, "id" | "slug" | "status" | "upvotesCount" | "buildsCount" | "commentsCount" | "viewsCount" | "createdAt" | "updatedAt">
) => {
  const baseSlug = slugify(data.name)
  const slug = `${baseSlug}-${nanoid()}`

  const [tool] = await db
    .insert(tools)
    .values({ ...data, slug, status: "pending" })
    .returning()

  return tool
}
