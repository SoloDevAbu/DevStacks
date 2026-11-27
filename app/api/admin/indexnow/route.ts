import { NextResponse } from "next/server"
import { z } from "zod"
import { withAdmin } from "@/lib/auth/with-admin"
import { submitToIndexNow } from "@/lib/seo/indexnow"
import { recordAdminAction } from "@/db/queries/admin/audit"
import { ADMIN_AUDIT_ACTION, ADMIN_AUDIT_TARGET } from "@/constants/admin"

export const dynamic = "force-dynamic"

const submitSchema = z.object({
  paths: z.array(z.string().startsWith("/")).min(1).max(100),
})

// Lets an admin resubmit pages by hand and see IndexNow's answer, for example after rotating the
// key or editing a page outside the usual flows.
export const POST = withAdmin(async (req, { admin }) => {
  const parsed = submitSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Send { paths: [\"/path\", ...] } with 1-100 site paths." },
      { status: 400 }
    )
  }

  await recordAdminAction({
    adminId: admin.id,
    action: ADMIN_AUDIT_ACTION.INDEXNOW_SUBMITTED,
    targetType: ADMIN_AUDIT_TARGET.PATHS,
    targetId: String(parsed.data.paths.length),
    metadata: { paths: parsed.data.paths },
  })

  return NextResponse.json(await submitToIndexNow(parsed.data.paths))
})
