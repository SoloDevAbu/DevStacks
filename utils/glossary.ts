import { GLOSSARY_HUB, getRelatedGlossaryTerms } from "@/constants/glossary"
import { ROUTES } from "@/constants/routes"
import { SITE_CONFIG } from "@/constants/site"
import type { GlossaryTerm } from "@/types/glossary"
import { fitTitleSuffix } from "@/utils/seo"
import { toAbsoluteUrl } from "@/utils/urls"

const TITLE_SUFFIXES = [
  " Definition & Why It Matters",
  " Meaning & Definition",
  " Definition",
]

export const buildGlossaryQuestion = (
  { term, article, plural }: GlossaryTerm,
  verbCase: "sentence" | "title" = "sentence"
) => {
  const verb = plural ? "are" : "is"
  const casedVerb =
    verbCase === "title" ? `${verb[0].toUpperCase()}${verb.slice(1)}` : verb
  return `What ${casedVerb} ${article ? `${article} ` : ""}${term}?`
}

export const buildGlossaryMetaTitle = (term: GlossaryTerm) =>
  fitTitleSuffix(buildGlossaryQuestion(term, "title"), TITLE_SUFFIXES)

export const buildGlossaryTermMarkdown = (term: GlossaryTerm) => {
  const pageUrl = toAbsoluteUrl(ROUTES.GLOSSARY_TERM(term.slug))
  const related = getRelatedGlossaryTerms(term)

  return [
    `# ${term.term}`,
    "",
    `> ${term.shortDefinition}`,
    "",
    `Canonical page: ${pageUrl}`,
    ...(term.aliases.length > 0
      ? [`Also known as: ${term.aliases.join(", ")}`]
      : []),
    "",
    "## Definition",
    "",
    ...term.definition.flatMap((paragraph) => [paragraph, ""]),
    "## Why it matters",
    "",
    ...term.whyItMatters.map((point) => `- ${point}`),
    "",
    `## On ${SITE_CONFIG.name}`,
    "",
    term.onLaunchNests,
    "",
    "## Frequently asked questions",
    "",
    ...term.faqs.flatMap(({ question, answer }) => [
      `### ${question}`,
      "",
      answer,
      "",
    ]),
    "## Related",
    "",
    ...related.map(
      (item) =>
        `- [${item.term}](${toAbsoluteUrl(ROUTES.GLOSSARY_TERM(item.slug))})`
    ),
    ...term.relatedLinks.map(
      ({ label, href }) => `- [${label}](${toAbsoluteUrl(href)})`
    ),
    "",
    `Part of the ${GLOSSARY_HUB.title}: ${toAbsoluteUrl(ROUTES.GLOSSARY)}`,
    "",
  ].join("\n")
}
