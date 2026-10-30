import { slugify } from "@/utils/slug"

export interface BlogTocItem {
  id: string
  text: string
  level: number
}

/**
 * Extracts H2 and H3 headings from markdown text for the Table of Contents.
 */
export const extractHeadingsFromMarkdown = (markdown: string): BlogTocItem[] => {
  if (!markdown) return []

  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const headings: BlogTocItem[] = []
  const seenIds = new Set<string>()

  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const rawText = match[2].trim()

    // Strip markdown formatting like bold, italics, code, links
    const cleanText = rawText
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [link](url) -> link
      .replace(/[*_`#]/g, "")
      .trim()

    if (!cleanText) continue

    let baseId = slugify(cleanText, "section")
    let id = baseId
    let counter = 1
    while (seenIds.has(id)) {
      id = `${baseId}-${counter}`
      counter++
    }
    seenIds.add(id)

    headings.push({
      id,
      text: cleanText,
      level,
    })
  }

  return headings
}

