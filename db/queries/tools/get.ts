import { db } from "@/db"
import { tools } from "@/db/schema"
import { eq } from "drizzle-orm"

export const getToolBySlug = async (slug: string) => {
  const [tool] = await db
    .select()
    .from(tools)
    .where(eq(tools.slug, slug))
    .limit(1)
  return tool ?? null
}
