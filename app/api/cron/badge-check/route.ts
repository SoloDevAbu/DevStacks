import { type NextRequest, NextResponse } from "next/server"
import { isCronAuthorized } from "@/lib/auth/cron"
import { recheckDueBadges } from "@/lib/badges/recheck-badges"

export const dynamic = "force-dynamic"

export const POST = async (req: NextRequest) => {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results = await recheckDueBadges()

  return NextResponse.json({
    checked: results.length,
    removed: results.filter((result) => result.wasRemoved).length,
    results,
  })
}
