import { SITE_CONFIG } from "@/constants/site"
import { getCurrentLaunchWeekSnapshot } from "@/lib/launches/launch-week"
import {
  createMarkdownResponse,
  generateHomeMarkdown,
} from "@/lib/seo/markdown-twins"

export const revalidate = 3600

export const GET = async () => {
  const snapshot = await getCurrentLaunchWeekSnapshot()
  return createMarkdownResponse(generateHomeMarkdown(snapshot), SITE_CONFIG.url)
}
