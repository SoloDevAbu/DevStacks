import { type NextRequest, NextResponse } from "next/server"
import { AI_READINESS_ERRORS } from "@/constants/free-tools"
import { isSafeUrl } from "@/lib/ai/url-security"
import { runAiReadinessCheck } from "@/lib/free-tools/ai-readiness"
import type { AiReadinessReport } from "@/types/free-tools"

const toSiteUrl = (raw: unknown) => {
  if (typeof raw !== "string" || !raw.trim()) return null
  const trimmed = raw.trim()
  const withScheme = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`
  if (!isSafeUrl(withScheme).safe) return null
  try {
    return new URL(withScheme)
  } catch {
    return null
  }
}

export const POST = async (req: NextRequest) => {
  const body = (await req.json().catch(() => null)) as { url?: unknown } | null
  const siteUrl = toSiteUrl(body?.url)
  if (!siteUrl) {
    return NextResponse.json(
      { error: AI_READINESS_ERRORS.INVALID_URL },
      { status: 400 }
    )
  }

  const report = await runAiReadinessCheck(siteUrl)
  if (!report) {
    return NextResponse.json(
      { error: AI_READINESS_ERRORS.UNREACHABLE },
      { status: 422 }
    )
  }
  return NextResponse.json<AiReadinessReport>(report)
}
