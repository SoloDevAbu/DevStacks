import { db } from "@/db"
import { tools } from "@/db/schema"
import { and, eq, ilike, or } from "drizzle-orm"
import type { BuiltWithToolItem } from "@/components/shared/built-with-tools-input"

export const matchDetectedTechToTools = async (
  techNames: string[]
): Promise<BuiltWithToolItem[]> => {
  const cleanNames = Array.from(
    new Set(
      techNames
        .map((t) => t.trim())
        .filter((t) => t.length > 0 && t.length <= 40)
    )
  ).slice(0, 10)

  if (cleanNames.length === 0) return []

  try {
    const conditions = cleanNames.map((name) => ilike(tools.name, name))

    const matchedTools = await db
      .select({
        id: tools.id,
        name: tools.name,
        slug: tools.slug,
      })
      .from(tools)
      .where(
        and(
          eq(tools.status, "approved"),
          eq(tools.isDeleted, false),
          or(...conditions)
        )
      )

    const matchedMap = new Map<string, { id: string; name: string; slug: string }>()
    for (const tool of matchedTools) {
      matchedMap.set(tool.name.toLowerCase(), tool)
    }

    return cleanNames.map((tech) => {
      const match = matchedMap.get(tech.toLowerCase())
      if (match) {
        return {
          name: match.name,
          toolId: match.id,
          toolSlug: match.slug,
        }
      }
      return {
        name: tech,
      }
    })
  } catch {
    return cleanNames.map((name) => ({ name }))
  }
}