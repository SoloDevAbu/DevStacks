import { NextResponse } from "next/server"
import { ROUTES } from "@/constants/routes"
import { getLaunchWeekSnapshot } from "@/lib/launches/launch-week"
import { parseLaunchWeekParams } from "@/lib/launches/launch-week-params"
import {
  createMarkdownResponse,
  generateLaunchWeekMarkdown,
} from "@/lib/seo/markdown-twins"
import { toAbsoluteUrl } from "@/utils/urls"

export const revalidate = 86400

export const GET = async (
  _request: Request,
  props: { params: Promise<{ year: string; week: string }> }
) => {
  const { year: rawYear, week: rawWeek } = await props.params
  const params = parseLaunchWeekParams(rawYear, rawWeek)
  const snapshot = params && (await getLaunchWeekSnapshot(params.year, params.week))

  if (!snapshot || snapshot.items.length === 0) {
    return new NextResponse("# 404 Not Found\n\nNo launches for this week.", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    })
  }

  return createMarkdownResponse(
    generateLaunchWeekMarkdown(snapshot),
    toAbsoluteUrl(ROUTES.LAUNCH_WEEK(snapshot.year, snapshot.week))
  )
}
