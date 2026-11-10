import { type NextRequest, NextResponse } from "next/server"
import { isCronAuthorized } from "@/lib/auth/cron"
import { recheckDueDirectories } from "@/lib/directories/recheck-directories"

export const dynamic = "force-dynamic"

export const POST = async (req: NextRequest) => {
  if (!isCronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const results = await recheckDueDirectories()

  return NextResponse.json({ checked: results.length, results })
}
