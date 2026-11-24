import { NextResponse } from "next/server"
import { getGlossaryTerm } from "@/constants/glossary"
import { ROUTES } from "@/constants/routes"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { buildGlossaryTermMarkdown } from "@/utils/glossary"
import { toAbsoluteUrl } from "@/utils/urls"

interface RouteProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 86400

export const GET = async (_req: Request, props: RouteProps) => {
  const { slug } = await props.params
  const term = getGlossaryTerm(slug)
  if (!term) return new NextResponse("Glossary Term Not Found", { status: 404 })

  return createMarkdownResponse(
    buildGlossaryTermMarkdown(term),
    toAbsoluteUrl(ROUTES.GLOSSARY_TERM(term.slug))
  )
}
