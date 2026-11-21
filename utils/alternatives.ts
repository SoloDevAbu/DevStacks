import { ROUTES } from "@/constants/routes"
import { PRICING, type Pricing } from "@/constants/plans"
import { SERP_TITLE_MAX_CHARS } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"
import type { CuratedAlternative } from "@/types/alternatives"
import type { DbTool } from "@/types/entities"

export type AlternativeEntry =
  | { kind: "catalog"; tool: DbTool; curated: CuratedAlternative | null }
  | { kind: "external"; curated: CuratedAlternative }

export interface AlternativeRow {
  key: string
  name: string
  href: string
  isExternal: boolean
  isOpenSource: boolean
  licenseLabel: string
  pricing: Pricing
  buildsCount: number | null
  upvotesCount: number | null
  platforms: string
  description: string
}

const OPEN_SOURCE_LABEL = "Open Source"
const COMMERCIAL_LABEL = "Commercial"
const DEFAULT_PLATFORMS = "Web / Cloud"

export const isToolOpenSource = (tool: {
  githubUrl?: string | null
  tags?: string[]
}): boolean =>
  Boolean(
    tool.githubUrl ||
    tool.tags?.some((tag) => tag.toLowerCase().includes("open source"))
  )

const fromCurated = (curated: CuratedAlternative) => ({
  isOpenSource: curated.license === OPEN_SOURCE_LABEL,
  licenseLabel: curated.license,
  pricing: curated.pricing,
  platforms: curated.platforms,
  description: curated.bestFor,
})

const fromCatalog = (tool: DbTool) => {
  const isOpenSource = isToolOpenSource(tool)
  return {
    isOpenSource,
    licenseLabel: isOpenSource ? OPEN_SOURCE_LABEL : COMMERCIAL_LABEL,
    pricing: (tool.pricing ?? PRICING.FREE) as Pricing,
    platforms: (tool.platforms ?? []).join(", ") || DEFAULT_PLATFORMS,
    description: tool.tagline ?? "",
  }
}

// Curated facts win over catalog fields, which makers enter themselves.
export const toAlternativeRow = (entry: AlternativeEntry): AlternativeRow =>
  entry.kind === "catalog"
    ? {
        key: entry.tool.id,
        name: entry.tool.name,
        href: ROUTES.TOOL(entry.tool.slug),
        isExternal: false,
        buildsCount: entry.tool.buildsCount ?? 0,
        upvotesCount: entry.tool.upvotesCount ?? 0,
        ...(entry.curated
          ? fromCurated(entry.curated)
          : fromCatalog(entry.tool)),
      }
    : {
        key: entry.curated.websiteUrl,
        name: entry.curated.name,
        href: entry.curated.websiteUrl,
        isExternal: true,
        buildsCount: null,
        upvotesCount: null,
        ...fromCurated(entry.curated),
      }

export const toAbsoluteRowUrl = (row: AlternativeRow) =>
  row.isExternal ? row.href : toAbsoluteUrl(row.href)

// Matches curated entries to catalog listings, so a listed alternative keeps its catalog card.
export const buildAlternativeEntries = (
  curatedAlternatives: readonly CuratedAlternative[] | null,
  siblings: readonly DbTool[]
): AlternativeEntry[] => {
  if (!curatedAlternatives) {
    return siblings.map((tool) => ({ kind: "catalog", tool, curated: null }))
  }
  const siblingsBySlug = new Map(siblings.map((tool) => [tool.slug, tool]))
  return curatedAlternatives.map((curated) => {
    const tool = curated.toolSlug
      ? siblingsBySlug.get(curated.toolSlug)
      : undefined
    return tool
      ? { kind: "catalog", tool, curated }
      : { kind: "external", curated }
  })
}

export const shortAlternativeName = (name: string) => name.replace(/\s*\(.*\)\s*$/, "")

// Names as many alternatives as fit in a search result title, e.g.
// "8 Docker Alternatives (2026): Podman, OrbStack, Colima".
export const buildAlternativesTitle = (
  toolName: string,
  rows: readonly AlternativeRow[],
  year: number
): string => {
  const base = `${rows.length} ${toolName} Alternatives (${year})`
  const names: string[] = []
  for (const row of rows) {
    const candidate = [...names, shortAlternativeName(row.name)]
    if (`${base}: ${candidate.join(", ")}`.length <= SERP_TITLE_MAX_CHARS) {
      names.push(shortAlternativeName(row.name))
    }
  }
  return names.length > 0 ? `${base}: ${names.join(", ")}` : base
}

export const formatFactsCheckedOn = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  })
