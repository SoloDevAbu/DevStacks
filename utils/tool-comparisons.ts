import { CURATED_ALTERNATIVES } from "@/constants/alternatives"
import {
  PRICING_SENTENCE,
  TOOL_COMPARISON_SEPARATOR,
  TOOL_PAIR_NOTES,
} from "@/constants/tool-comparisons"
import type { FaqItem } from "@/constants/faqs"
import type {
  CuratedAlternative,
  CuratedAlternatives,
  ToolFacts,
} from "@/types/alternatives"
import { shortAlternativeName } from "@/utils/alternatives"
import { slugify } from "@/utils/slug"
import { fitTitleSuffix } from "@/utils/seo"

export interface ComparisonSide extends ToolFacts {
  name: string
  slug: string
  tags: readonly string[]
  // Set when the tool has a LaunchNests catalog page or a curated alternatives page.
  catalogSlug?: string
  alternativesSlug?: string
}

export interface ToolComparison {
  slug: string
  a: ComparisonSide
  b: ComparisonSide
  verdict: string
  chooseA: readonly string[]
  chooseB: readonly string[]
  factsCheckedOn: string
}

export type ToolComparisonLookup =
  | { kind: "found"; comparison: ToolComparison }
  | { kind: "redirect"; slug: string }

export const getAlternativeSlug = (alternative: CuratedAlternative) =>
  alternative.toolSlug ?? slugify(shortAlternativeName(alternative.name))

// Pair slugs are alphabetical so "podman vs docker" and "docker vs podman" share one canonical URL.
export const buildPairSlug = (first: string, second: string) =>
  [first, second].sort().join(TOOL_COMPARISON_SEPARATOR)

const toMainSide = (curated: CuratedAlternatives): ComparisonSide => ({
  ...curated.profile,
  name: curated.toolName,
  slug: curated.toolSlug,
  tags: [],
  catalogSlug: curated.toolSlug,
  alternativesSlug: curated.toolSlug,
})

const toAlternativeSide = (alternative: CuratedAlternative): ComparisonSide => {
  const slug = getAlternativeSlug(alternative)
  return {
    websiteUrl: alternative.websiteUrl,
    bestFor: alternative.bestFor,
    license: alternative.license,
    pricing: alternative.pricing,
    platforms: alternative.platforms,
    name: shortAlternativeName(alternative.name),
    slug,
    tags: alternative.tags,
    catalogSlug: alternative.toolSlug,
    alternativesSlug: CURATED_ALTERNATIVES[slug] ? slug : undefined,
  }
}

const buildComparisons = (): ToolComparison[] => {
  const bySlug = new Map<string, ToolComparison>()
  for (const curated of Object.values(CURATED_ALTERNATIVES)) {
    const notes = TOOL_PAIR_NOTES[curated.toolSlug] ?? {}
    const main = toMainSide(curated)
    for (const alternative of curated.alternatives) {
      const other = toAlternativeSide(alternative)
      const note = notes[other.slug]
      const slug = buildPairSlug(main.slug, other.slug)
      if (!note || bySlug.has(slug)) continue
      const mainFirst = slug.startsWith(
        `${main.slug}${TOOL_COMPARISON_SEPARATOR}`
      )
      bySlug.set(slug, {
        slug,
        a: mainFirst ? main : other,
        b: mainFirst ? other : main,
        verdict: note.verdict,
        chooseA: mainFirst ? note.chooseTool : note.chooseAlternative,
        chooseB: mainFirst ? note.chooseAlternative : note.chooseTool,
        factsCheckedOn: curated.factsCheckedOn,
      })
    }
  }
  return [...bySlug.values()]
}

const TOOL_COMPARISONS = buildComparisons()
const COMPARISONS_BY_SLUG = new Map(TOOL_COMPARISONS.map((c) => [c.slug, c]))

export const getAllToolComparisons = (): readonly ToolComparison[] =>
  TOOL_COMPARISONS

export const getToolComparison = (
  slug: string
): ToolComparisonLookup | null => {
  const comparison = COMPARISONS_BY_SLUG.get(slug)
  if (comparison) return { kind: "found", comparison }
  const parts = slug.split(TOOL_COMPARISON_SEPARATOR)
  if (parts.length !== 2) return null
  const canonical = buildPairSlug(parts[0], parts[1])
  return COMPARISONS_BY_SLUG.has(canonical)
    ? { kind: "redirect", slug: canonical }
    : null
}

export const getComparisonsForTool = (toolSlug: string) =>
  TOOL_COMPARISONS.filter(
    ({ a, b }) => a.slug === toolSlug || b.slug === toolSlug
  )

export const getPairSlugIfCompared = (first: string, second: string) => {
  const slug = buildPairSlug(first, second)
  return COMPARISONS_BY_SLUG.has(slug) ? slug : null
}

export const getComparisonTitle = ({ a, b }: ToolComparison) =>
  `${a.name} vs ${b.name}`

const describeLicense = (side: ComparisonSide) =>
  side.license === "Open Source"
    ? `${side.name} is open source`
    : side.license === "Source Available"
      ? `${side.name} is source-available, not OSI open source`
      : `${side.name} is a commercial product`

export const buildToolComparisonFaqs = (
  comparison: ToolComparison
): FaqItem[] => {
  const { a, b, verdict, chooseA, chooseB } = comparison
  const title = getComparisonTitle(comparison)
  return [
    {
      question: `What is the difference between ${a.name} and ${b.name}?`,
      answer: verdict,
    },
    {
      question: `Is ${a.name} or ${b.name} open source?`,
      answer: `${describeLicense(a)}, and ${a.name} is ${PRICING_SENTENCE[a.pricing]}. ${describeLicense(b)}, and ${b.name} is ${PRICING_SENTENCE[b.pricing]}.`,
    },
    {
      question: `When should I choose ${a.name} over ${b.name}?`,
      answer: chooseA.join(" "),
    },
    {
      question: `When is ${b.name} the better choice?`,
      answer: chooseB.join(" "),
    },
    {
      question: `Which platforms do ${title} support?`,
      answer: `${a.name}: ${a.platforms}. ${b.name}: ${b.platforms}.`,
    },
  ]
}

const TITLE_SUFFIXES = [
  ": Differences & Which to Choose",
  ": Key Differences",
  ": Compared",
]

// Fits the longest descriptive suffix into a search result title, e.g. "Docker vs Podman (2026): Key Differences".
export const buildComparisonMetaTitle = (
  comparison: ToolComparison,
  year: number,
  maxChars: number
) =>
  fitTitleSuffix(
    `${getComparisonTitle(comparison)} (${year})`,
    TITLE_SUFFIXES,
    maxChars
  )

export const buildToolComparisonMarkdown = (
  comparison: ToolComparison,
  pageUrl: string
) => {
  const { a, b, verdict, chooseA, chooseB, factsCheckedOn } = comparison
  const title = getComparisonTitle(comparison)
  const row = (label: string, pick: (side: ComparisonSide) => string) =>
    `| ${label} | ${pick(a)} | ${pick(b)} |`
  const faqs = buildToolComparisonFaqs(comparison)
    .map(({ question, answer }) => `### ${question}\n\n${answer}`)
    .join("\n\n")

  return `# ${title}

${verdict}

Canonical: ${pageUrl}
Facts checked on: ${factsCheckedOn}

## At a glance

| | ${a.name} | ${b.name} |
|---|---|---|
${row("Best for", (side) => side.bestFor)}
${row("License", (side) => side.license)}
${row("Pricing", (side) => side.pricing)}
${row("Platforms", (side) => side.platforms)}
${row("Website", (side) => side.websiteUrl)}

## Choose ${a.name} if

${chooseA.map((reason) => `- ${reason}`).join("\n")}

## Choose ${b.name} if

${chooseB.map((reason) => `- ${reason}`).join("\n")}

## FAQ

${faqs}
`
}
