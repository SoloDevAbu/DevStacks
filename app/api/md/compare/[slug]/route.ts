import { NextResponse } from "next/server"
import { getComparisonBySlug } from "@/constants/comparisons"
import { ROUTES } from "@/constants/routes"
import {
  generateComparisonMarkdown,
  createMarkdownResponse,
} from "@/lib/seo/markdown-twins"
import { toAbsoluteUrl } from "@/utils/urls"
import {
  buildToolComparisonMarkdown,
  getToolComparison,
} from "@/utils/tool-comparisons"

interface RouteProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export const GET = async (_req: Request, props: RouteProps) => {
  const { slug } = await props.params
  const comparison = getComparisonBySlug(slug)

  if (comparison) {
    return createMarkdownResponse(
      generateComparisonMarkdown(comparison),
      comparison.canonicalUrl
    )
  }

  const lookup = getToolComparison(slug)
  if (lookup?.kind !== "found") {
    return new NextResponse("Comparison Not Found", { status: 404 })
  }

  const pageUrl = toAbsoluteUrl(ROUTES.COMPARE(lookup.comparison.slug))
  return createMarkdownResponse(
    buildToolComparisonMarkdown(lookup.comparison, pageUrl),
    pageUrl
  )
}
