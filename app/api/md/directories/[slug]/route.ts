import { NextResponse } from "next/server"
import { getLaunchDirectory } from "@/constants/launch-directories"
import { ROUTES } from "@/constants/routes"
import { loadLatestDirectoryChecks } from "@/lib/directories/latest-checks"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { buildDirectoryMarkdown } from "@/utils/directories/markdown"
import { toAbsoluteUrl } from "@/utils/urls"

interface RouteProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export const GET = async (_req: Request, props: RouteProps) => {
  const { slug } = await props.params
  const directory = getLaunchDirectory(slug)
  if (!directory) return new NextResponse("Directory Not Found", { status: 404 })

  const latestChecks = await loadLatestDirectoryChecks()
  return createMarkdownResponse(
    buildDirectoryMarkdown(directory, latestChecks.get(directory.slug)),
    toAbsoluteUrl(ROUTES.DIRECTORY(directory.slug))
  )
}
