import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { withAdmin } from "@/lib/auth/with-admin"
import { setAdStatusByAdmin } from "@/db/queries/admin/ads"
import { recordAdminAction } from "@/db/queries/admin/audit"
import { adStatusUpdateSchema } from "@/lib/validation/admin"
import { ADMIN_AUDIT_ACTION, ADMIN_AUDIT_TARGET } from "@/constants/admin"
import { CACHE_TAGS } from "@/constants/cache"

export const PATCH = withAdmin<{ id: string }>(async (req, { params, admin }) => {
  const { id } = await params
  const parsed = adStatusUpdateSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ad status." }, { status: 400 })
  }

  const { previousStatus, ad } = await setAdStatusByAdmin(id, parsed.data.status)
  await recordAdminAction({
    adminId: admin.id,
    action: ADMIN_AUDIT_ACTION.AD_STATUS_CHANGED,
    targetType: ADMIN_AUDIT_TARGET.AD,
    targetId: id,
    metadata: { from: previousStatus, to: parsed.data.status },
  })
  revalidateTag(CACHE_TAGS.ADS, "max")

  return NextResponse.json({ success: true, data: { id, status: ad?.status } })
})
