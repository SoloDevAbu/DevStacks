import { marked } from "marked"
import { slugify } from "@/utils/slug"

export const BlogMarkdownContent = ({ markdown }: { markdown: string }) => {
  const seenIds = new Set<string>()

  const renderer = new marked.Renderer()

  renderer.heading = function (token) {
    const text = token.text
    const depth = token.depth
    const inlineContent = this.parser.parseInline(token.tokens)

    const cleanText = text.replace(/<[^>]+>/g, "").trim()
    let baseId = slugify(cleanText, "section")
    let id = baseId
    let counter = 1
    while (seenIds.has(id)) {
      id = `${baseId}-${counter}`
      counter++
    }
    seenIds.add(id)

    return `<h${depth} id="${id}" class="scroll-mt-24 group flex items-center justify-between text-slate-900 font-bold border-b border-dashed border-border/60 pb-2 mt-8 mb-4"><span>${inlineContent}</span><a href="#${id}" class="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-slate-500 ml-2 transition-opacity text-sm font-normal" aria-label="Link to section">#</a></h${depth}>`
  }

  const htmlContent = marked.parse(markdown, { renderer, async: false }) as string

  return (
    <article
      className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-5 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_pre]:bg-slate-900 [&_pre]:text-slate-100 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_code]:font-mono [&_code]:text-xs sm:[&_code]:text-sm [&_a]:text-indigo-600 [&_a]:font-medium [&_a]:underline hover:[&_a]:text-indigo-800"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  )
}
