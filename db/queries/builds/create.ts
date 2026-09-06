import { db } from "@/db"
import { products, tools } from "@/db/schema"
import { inArray, sql } from "drizzle-orm"

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

export const createBuild = async (
  data: {
    authorId: string
    name: string
    description: string
    logoText?: string
    logoBg?: string
    websiteUrl?: string
  },
  toolIds: string[] = []
) => {
  let builtWithTools: { name: string; toolSlug?: string }[] = []

  if (toolIds.length > 0) {
    const matchedTools = await db
      .select({ id: tools.id, name: tools.name, slug: tools.slug })
      .from(tools)
      .where(inArray(tools.id, toolIds))

    builtWithTools = matchedTools.map((t) => ({
      name: t.name,
      toolSlug: t.slug,
    }))

    // Increment buildsCount for each linked tool
    await db
      .update(tools)
      .set({ buildsCount: sql`${tools.buildsCount} + 1` })
      .where(inArray(tools.id, toolIds))
  }

  const baseSlug = slugify(data.name)
  const slug = `${baseSlug}-${nanoid()}`

  const [product] = await db
    .insert(products)
    .values({
      name: data.name,
      slug,
      submitterId: data.authorId,
      tagline: data.description.slice(0, 150),
      description: data.description,
      websiteUrl: data.websiteUrl || "https://example.com",
      status: "approved",
      builtWithTools,
      tags: [],
      platforms: [],
    })
    .returning()

  return product
}
