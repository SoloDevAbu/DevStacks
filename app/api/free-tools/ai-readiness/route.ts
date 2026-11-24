import { type NextRequest, NextResponse } from "next/server"
import { SITE_CHECK_ERRORS } from "@/constants/free-tools"
import { runAiReadinessCheck } from "@/lib/free-tools/ai-readiness"
import { readSiteUrl } from "@/lib/free-tools/site-url"
import type { AiReadinessReport } from "@/types/free-tools"

export const POST = async (req: NextRequest) => {
  const siteUrl = await readSiteUrl(req)
  if (!siteUrl) {
    return NextResponse.json(
      { error: SITE_CHECK_ERRORS.INVALID_URL },
      { status: 400 }
    )
  }

  const report = await runAiReadinessCheck(siteUrl)
  if (!report) {
    return NextResponse.json(
      { error: SITE_CHECK_ERRORS.UNREACHABLE },
      { status: 422 }
    )
  }
  return NextResponse.json<AiReadinessReport>(report)
}
