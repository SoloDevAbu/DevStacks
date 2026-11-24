import { type NextRequest, NextResponse } from "next/server"
import { SITE_CHECK_ERRORS } from "@/constants/free-tools"
import { runLlmsTxtCheck } from "@/lib/free-tools/llms-txt"
import { readSiteUrl } from "@/lib/free-tools/site-url"
import type { LlmsTxtReport } from "@/types/free-tools"

export const POST = async (req: NextRequest) => {
  const siteUrl = await readSiteUrl(req)
  if (!siteUrl) {
    return NextResponse.json(
      { error: SITE_CHECK_ERRORS.INVALID_URL },
      { status: 400 }
    )
  }

  const report = await runLlmsTxtCheck(new URL(siteUrl.origin))
  if (!report) {
    return NextResponse.json(
      { error: SITE_CHECK_ERRORS.UNREACHABLE },
      { status: 422 }
    )
  }
  return NextResponse.json<LlmsTxtReport>(report)
}
