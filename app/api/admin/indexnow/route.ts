import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getAdminSession } from "@/lib/auth/admin"
import { submitToIndexNow } from "@/lib/seo/indexnow"

export const dynamic = "force-dynamic"

const submitSchema = z.object({
  paths: z.array(z.string().startsWith("/")).min(1).max(100),
})

// Lets an admin resubmit pages by hand and see IndexNow's answer, for example after rotating the
// key or editing a page outside the usual flows.
export const POST = async (req: NextRequest) => {
  const { isAdmin } = await getAdminSession(req.headers)
  if (!isAdmin) {
    return NextResponse.json(
      { error: "Forbidden: Administrator permission required." },
      { status: 403 }
    )
  }

  const parsed = submitSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Send { paths: [\"/path\", ...] } with 1-100 site paths." },
      { status: 400 }
    )
  }

  return NextResponse.json(await submitToIndexNow(parsed.data.paths))
}
