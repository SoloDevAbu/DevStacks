import { ROUTES } from "@/constants/routes"
import { loadLatestDirectoryChecks } from "@/lib/directories/latest-checks"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { buildDirectoriesHubMarkdown } from "@/utils/directories/markdown"
import { toAbsoluteUrl } from "@/utils/urls"

export const revalidate = 3600

export const GET = async () =>
  createMarkdownResponse(
    buildDirectoriesHubMarkdown(await loadLatestDirectoryChecks()),
    toAbsoluteUrl(ROUTES.DIRECTORIES)
  )
