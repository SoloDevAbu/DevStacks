import { NextResponse } from "next/server"
import { resolveTool } from "@/lib/tools/resolve-tool"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await props.params
  const tool = await resolveTool(slug)

  if (!tool) {
    return NextResponse.json(
      {
        type: `${SITE_CONFIG.url}/errors/not-found`,
        title: "Tool Not Found",
        status: 404,
        detail: `Developer tool '${slug}' was not found in the catalog.`,
      },
      {
        status: 404,
        headers: {
          "Content-Type": "application/problem+json",
        },
      }
    )
  }

  return NextResponse.json(
    { data: tool },
    {
      headers: {
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    }
  )
}
