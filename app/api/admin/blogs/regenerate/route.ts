import { type NextRequest, NextResponse } from "next/server"
import { getAdminSession } from "@/lib/auth/admin"
import { generateAndSaveLaunchBlog } from "@/lib/ai/launch-blog-service"
import { z } from "zod"

const regenerateSchema = z.object({
  itemType: z.enum(["tool", "product"]),
  itemId: z.string().uuid("Invalid item ID"),
})

export const POST = async (req: NextRequest) => {
  try {
    const { isAdmin } = await getAdminSession(req.headers)

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Administrator permission required." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const parsed = regenerateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload.", details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { itemType, itemId } = parsed.data

    const result = await generateAndSaveLaunchBlog({
      itemType,
      itemId,
      forceRegenerate: true,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Blog generation failed." },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { success: true, blog: result.blog },
      { status: 200 }
    )
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to regenerate blog."
    console.error("[Admin Blog Regenerate Error]:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

