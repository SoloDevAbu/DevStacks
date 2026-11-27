import { ROUTES } from "@/constants/routes"
import { createMarkdownResponse } from "@/lib/seo/markdown-twins"
import { buildGuidesHubMarkdown } from "@/utils/guides"
import { toAbsoluteUrl } from "@/utils/urls"

export const revalidate = 86400

export const GET = () =>
  createMarkdownResponse(buildGuidesHubMarkdown(), toAbsoluteUrl(ROUTES.GUIDES))
