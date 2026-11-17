import { cache } from "react"
import { resolveTool } from "@/lib/tools/resolve-tool"
import { getRelatedTools } from "@/db/queries/tools/get"
import { getCuratedAlternatives } from "@/constants/alternatives"
import { ALTERNATIVES_SIBLINGS_LIMIT } from "@/constants/rankings"
import { buildAlternativeEntries, toAlternativeRow } from "@/utils/alternatives"

// Metadata and the page both need this, so it is loaded once per request.
export const getAlternativesPageData = cache(async (slug: string) => {
  const tool = await resolveTool(slug)
  if (!tool) return null

  const curated = getCuratedAlternatives(tool.slug)
  const siblings = await getRelatedTools(
    tool.categoryId,
    tool.id,
    ALTERNATIVES_SIBLINGS_LIMIT
  )
  const entries = buildAlternativeEntries(
    curated?.alternatives ?? null,
    siblings
  )

  return { tool, curated, entries, rows: entries.map(toAlternativeRow) }
})
