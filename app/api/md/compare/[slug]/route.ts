import { NextResponse } from "next/server"
import { getComparisonBySlug } from "@/constants/comparisons"
import {
  generateComparisonMarkdown,
  createMarkdownResponse,
} from "@/lib/seo/markdown-twins"

interface RouteProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export const GET = async (_req: Request, props: RouteProps) => {
  const { slug } = await props.params
  const comparison = getComparisonBySlug(slug)

  if (!comparison) {
    return new NextResponse("Comparison Not Found", { status: 404 })
  }

  const markdown = generateComparisonMarkdown(comparison)
  return createMarkdownResponse(markdown, comparison.canonicalUrl)
}
