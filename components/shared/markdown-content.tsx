import { marked } from "marked"
import { slugify } from "@/utils/slug"
import {
  markdownArticle,
  markdownHeading,
  markdownHeadingAnchor,
} from "@/utils/styles"

interface MarkdownContentProps {
  markdown: string
  // Depth of the page's own heading above the content; markdown `#` renders one level below it.
  headingOffset?: number
}

export const MarkdownContent = ({
  markdown,
  headingOffset = 1,
}: MarkdownContentProps) => {
  const seenIds = new Set<string>()
  const renderer = new marked.Renderer()

  renderer.heading = function (token) {
    const depth = Math.min(token.depth + headingOffset, 6)
    const inlineContent = this.parser.parseInline(token.tokens)
    const baseId = slugify(token.text.replace(/<[^>]+>/g, "").trim(), "section")
    let id = baseId
    let counter = 1
    while (seenIds.has(id)) {
      id = `${baseId}-${counter}`
      counter++
    }
    seenIds.add(id)

    return `<h${depth} id="${id}" class="${markdownHeading}"><span>${inlineContent}</span><a href="#${id}" class="${markdownHeadingAnchor}" aria-label="Link to section">#</a></h${depth}>`
  }

  const htmlContent = marked.parse(markdown, { renderer, async: false }) as string

  return (
    <article
      className={markdownArticle}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
