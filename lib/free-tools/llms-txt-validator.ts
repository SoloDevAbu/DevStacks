import { LLMS_TXT_CHECKS, LLMS_TXT_GENERATOR } from "@/constants/free-tools"
import { createCheckBuilder } from "@/lib/free-tools/checks"
import {
  isTextResource,
  type PublicResource,
} from "@/lib/free-tools/safe-fetch"
import type { FreeToolCheckResult } from "@/types/free-tools"

interface LlmsTxtLink {
  url: string
  described: boolean
}

interface LlmsTxtSection {
  title: string
  links: LlmsTxtLink[]
}

const H1 = /^#\s+(.+)$/
const H2 = /^##\s+(.+)$/
const BLOCKQUOTE = /^>\s?(.*)$/
const LINK_ITEM = /^\s*[-*+]\s+\[[^\]]*\]\(([^)\s]+)[^)]*\)(.*)$/
const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i
const SAMPLE_SIZE = 5

const check = createCheckBuilder(LLMS_TXT_CHECKS)

const sample = (items: readonly string[]) =>
  items.length > SAMPLE_SIZE
    ? `${items.slice(0, SAMPLE_SIZE).join(", ")} and ${items.length - SAMPLE_SIZE} more`
    : items.join(", ")

const withoutCodeBlocks = (lines: readonly string[]) => {
  let inFence = false
  return lines.filter((line) => {
    if (line.trimStart().startsWith("```")) {
      inFence = !inFence
      return false
    }
    return !inFence
  })
}

const parse = (text: string) => {
  const lines = withoutCodeBlocks(text.split(/\r?\n/)).map((line) =>
    line.trimEnd()
  )
  const contentLines = lines.filter((line) => line.trim())
  const firstH2 = lines.findIndex((line) => H2.test(line))
  const intro = firstH2 === -1 ? lines : lines.slice(0, firstH2)
  const introContent = intro.filter((line) => line.trim())
  const sections: LlmsTxtSection[] = []

  lines.forEach((line) => {
    const heading = line.match(H2)
    if (heading) {
      sections.push({ title: heading[1].trim(), links: [] })
      return
    }
    const link = line.match(LINK_ITEM)
    if (link && sections.length > 0) {
      sections.at(-1)!.links.push({
        url: link[1],
        described: link[2].replace(/^[\s:–—-]+/, "").trim().length > 0,
      })
    }
  })

  return {
    firstLine: contentLines[0] ?? "",
    h1s: contentLines.filter((line) => H1.test(line)),
    // The summary should be the first thing after the H1, but anywhere before the first ## still counts.
    summaryFirst: BLOCKQUOTE.test(introContent[1] ?? ""),
    summary: introContent.find((line) => BLOCKQUOTE.test(line)) ?? null,
    sections,
  }
}

const checkH1 = ({ firstLine, h1s }: ReturnType<typeof parse>) => {
  if (h1s.length === 0) {
    return check(
      "H1",
      "fail",
      "No H1. The file must start with the site or project name, such as # Acme."
    )
  }
  if (!H1.test(firstLine)) {
    return check(
      "H1",
      "warn",
      `Found ${h1s[0]}, but it is not the first line. Put the H1 first.`
    )
  }
  if (h1s.length > 1) {
    return check(
      "H1",
      "warn",
      `Found ${h1s.length} H1 headings. Use one H1 for the site name and ## for sections.`
    )
  }
  return check("H1", "pass", `Starts with ${firstLine}.`)
}

const checkSummary = ({ summary, summaryFirst }: ReturnType<typeof parse>) => {
  if (!summary) {
    return check(
      "SUMMARY",
      "warn",
      "No blockquote summary. Add one line starting with > right after the H1 that says what the site is."
    )
  }
  const text = summary.replace(BLOCKQUOTE, "$1").trim()
  return summaryFirst
    ? check("SUMMARY", "pass", `"${text.slice(0, 140)}"`)
    : check(
        "SUMMARY",
        "warn",
        "Found a blockquote, but not straight after the H1. Move the > summary up so it comes first."
      )
}

const checkSections = ({ sections }: ReturnType<typeof parse>) =>
  sections.length > 0
    ? check(
        "SECTIONS",
        "pass",
        `${sections.length} sections: ${sample(sections.map(({ title }) => title))}.`
      )
    : check(
        "SECTIONS",
        "warn",
        "No ## sections. Group key links under headings such as ## Docs or ## Products."
      )

const checkLinks = (sections: readonly LlmsTxtSection[]) => {
  const links = sections.flatMap((section) => section.links)
  if (links.length === 0) {
    return check(
      "LINKS",
      "fail",
      "No link lists found. Each ## section should list pages as - [Name](https://...): description."
    )
  }

  const emptySections = sections
    .filter((section) => section.links.length === 0)
    .map(({ title }) => title)
  const relative = links.filter(({ url }) => !HAS_SCHEME.test(url))
  const problems = [
    emptySections.length > 0 &&
      `${emptySections.length} section${emptySections.length === 1 ? " has" : "s have"} no links (${sample(emptySections)}).`,
    relative.length > 0 &&
      `${relative.length} link${relative.length === 1 ? " uses a relative URL" : "s use relative URLs"}; use full https:// URLs.`,
  ].filter((problem): problem is string => Boolean(problem))

  return check(
    "LINKS",
    problems.length > 0 ? "warn" : "pass",
    [
      `${links.length} links across ${sections.length} sections.`,
      ...problems,
    ].join(" ")
  )
}

const checkDescriptions = (sections: readonly LlmsTxtSection[]) => {
  const links = sections.flatMap((section) => section.links)
  const described = links.filter((link) => link.described).length
  const share = described / links.length
  const detail = `${described} of ${links.length} links have a description after the link.`
  return share >= LLMS_TXT_GENERATOR.DESCRIBED_LINK_PASS_SHARE
    ? check("DESCRIPTIONS", "pass", detail)
    : check(
        "DESCRIPTIONS",
        "warn",
        `${detail} Add a short note after each link, as in - [Pricing](https://...): plans and limits.`
      )
}

const describeMissingFile = (resource: PublicResource | null) => {
  if (!resource) return "Could not fetch /llms.txt."
  if (resource.status !== 200) {
    return `/llms.txt returned HTTP ${resource.status}.`
  }
  if (resource.contentType.includes("text/html")) {
    return "/llms.txt returned an HTML page, not a text file. The site likely serves its app shell for unknown paths."
  }
  return "/llms.txt is empty."
}

const isPlainTextType = (contentType: string) =>
  /text\/(plain|markdown)/i.test(contentType)

export const validateLlmsTxt = (
  resource: PublicResource | null
): FreeToolCheckResult[] => {
  if (!isTextResource(resource)) {
    return [
      check(
        "FILE",
        "fail",
        `${describeMissingFile(resource)} Use the draft below as a starting point.`
      ),
    ]
  }

  const parsed = parse(resource.body)
  const lineCount = resource.body.split(/\r?\n/).length
  const fileCheck = isPlainTextType(resource.contentType)
    ? check(
        "FILE",
        "pass",
        `Found ${resource.finalUrl} (${lineCount} lines, ${resource.contentType}).`
      )
    : check(
        "FILE",
        "warn",
        `Found ${resource.finalUrl}, but it is served as "${resource.contentType || "no content type"}". Serve it as text/plain or text/markdown.`
      )

  const hasLinks = parsed.sections.some((section) => section.links.length > 0)
  return [
    fileCheck,
    checkH1(parsed),
    checkSummary(parsed),
    checkSections(parsed),
    checkLinks(parsed.sections),
    ...(hasLinks ? [checkDescriptions(parsed.sections)] : []),
  ]
}
