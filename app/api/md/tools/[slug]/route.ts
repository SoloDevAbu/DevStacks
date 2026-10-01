import { NextResponse } from "next/server"
import { getToolBySlug, getRelatedTools } from "@/db/queries/tools/get"
import { getToolFaqs } from "@/db/queries/faqs/get-faqs"
import { getProductsBuiltWithTool } from "@/lib/tools/resolve-tool"
import {
  generateToolMarkdown,
  createMarkdownResponse,
} from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const tool = await getToolBySlug(slug)

  if (!tool) {
    return new NextResponse(
      `# 404 Not Found\n\nDeveloper tool "${slug}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const [customFaqs, builtWithProducts, relatedTools] = await Promise.all([
    getToolFaqs(tool.id),
    getProductsBuiltWithTool(tool.slug, tool.name, 10),
    getRelatedTools(tool.categoryId, tool.id, 4),
  ])

  const markdown = generateToolMarkdown(
    {
      ...tool,
      faqs: customFaqs.length > 0 ? customFaqs : null,
      builtWithProducts: builtWithProducts.map((p) => ({
        name: p.name,
        slug: p.slug,
        tagline: p.tagline,
      })),
      relatedTools: relatedTools.map((t) => ({
        name: t.name,
        slug: t.slug,
        tagline: t.tagline,
        pricing: t.pricing,
      })),
    },
    builtWithProducts.length
  )
  return createMarkdownResponse(markdown, `${SITE_CONFIG.url}/tools/${tool.slug}`)
}
