import { NextResponse } from "next/server"
import { getGuide } from "@/constants/guides"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { buildGuideMarkdown, getGuideUrl } from "@/utils/guides"

interface RouteProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export const GET = async (_req: Request, props: RouteProps) => {
  const { slug } = await props.params
  const guide = getGuide(slug)
  if (!guide) return new NextResponse("Guide Not Found", { status: 404 })

  return createMarkdownResponse(buildGuideMarkdown(guide), getGuideUrl(guide))
}
