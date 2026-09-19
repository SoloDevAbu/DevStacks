import { type NextRequest, NextResponse } from "next/server"
import { incrementAdImpression } from "@/db/queries/ads"

export const POST = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) => {
  try {
    const { id } = await context.params
    await incrementAdImpression(id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Ad impression tracking error:", error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
