import { NextResponse } from "next/server"
import { getMakerProfile } from "@/db/queries/users/get-profile"
import {
  generateMakerMarkdown,
  createMarkdownResponse,
} from "@/lib/seo/markdown-twins"
import { SITE_CONFIG } from "@/constants/site"

export const revalidate = 3600

export const GET = async (
  _request: Request,
  props: { params: Promise<{ username: string }> }
) => {
  const { username } = await props.params
  const decodedUsername = decodeURIComponent(username).replace(/^@/, "")
  const maker = await getMakerProfile(decodedUsername)

  if (!maker) {
    return new NextResponse(
      `# 404 Not Found\n\nMaker "@${decodedUsername}" does not exist on ${SITE_CONFIG.name}.`,
      {
        status: 404,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
        },
      }
    )
  }

  const markdown = generateMakerMarkdown(maker)
  return createMarkdownResponse(
    markdown,
    `${SITE_CONFIG.url}/makers/${maker.username}`
  )
}
