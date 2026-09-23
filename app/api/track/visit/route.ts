import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { externalLinkVisits, products, tools } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { z } from "zod"

const trackVisitSchema = z.object({
  itemType: z.enum(["product", "tool"]),
  id: z.string().uuid(),
  targetUrl: z.string().url(),
})

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    const body = await req.json()
    const parsed = trackVisitSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid tracking payload" },
        { status: 400 }
      )
    }

    const { itemType, id, targetUrl } = parsed.data
    const userId = session?.user?.id || null
    const userAgent = req.headers.get("user-agent") || undefined

    await db.insert(externalLinkVisits).values({
      itemType,
      productId: itemType === "product" ? id : null,
      toolId: itemType === "tool" ? id : null,
      userId,
      targetUrl,
      userAgent,
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Failed to track external visit:", error)
    return NextResponse.json({ error: "Tracking failed" }, { status: 500 })
  }
}
