import { NextResponse } from "next/server"
import { getToolBySlug } from "@/db/queries/tools/get"
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
    return new NextResponse(`# 404 Not Found\n\nDeveloper tool "${slug}" does not exist on ${SITE_CONFIG.name}.`, {
      status: 404,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    })
  }

  const markdown = generateToolMarkdown(tool)
  return createMarkdownResponse(markdown, `${SITE_CONFIG.url}/tools/${tool.slug}`)
}
