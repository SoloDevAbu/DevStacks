import { NextResponse, after } from "next/server"
import { withAdmin } from "@/lib/auth/with-admin"
import { approveRevision, rejectRevision } from "@/db/queries/admin/revisions"
import { recordAdminAction } from "@/db/queries/admin/audit"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { pingListingChange } from "@/lib/seo/listing-indexnow"
import { sendModerationEmail } from "@/lib/email/moderation"
import { revisionReviewSchema } from "@/lib/validation/admin"
import { ADMIN_AUDIT_ACTION, ADMIN_AUDIT_TARGET } from "@/constants/admin"
import { MODERATION_EMAIL_KIND } from "@/constants/email"
import { REVISION_ACTION } from "@/constants/moderation"

export const PATCH = withAdmin<{ id: string }>(async (req, { params, admin }) => {
  const { id } = await params
  const parsed = revisionReviewSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 400 }
    )
  }

  const isApproval = parsed.data.action === REVISION_ACTION.APPROVE
  const reviewNote = parsed.data.reviewNote ?? null
  const result = isApproval
    ? await approveRevision(id, admin.id)
    : await rejectRevision(id, admin.id, reviewNote ?? "")
  const { revision, item, submitter } = result
  const itemType = revision.itemType

  await recordAdminAction({
    adminId: admin.id,
    action: isApproval
      ? ADMIN_AUDIT_ACTION.REVISION_APPROVED
      : ADMIN_AUDIT_ACTION.REVISION_REJECTED,
    targetType: ADMIN_AUDIT_TARGET.REVISION,
    targetId: id,
    metadata: {
      itemType,
      itemId: item.id,
      name: item.name,
      fields: Object.keys(revision.payload),
      reviewNote,
    },
  })

  if (isApproval) {
    revalidateCatalog({ [itemType === "tool" ? "toolSlug" : "productSlug"]: item.slug })
  }

  after(async () => {
    if (isApproval) await pingListingChange(itemType, item)
    await sendModerationEmail({
      to: submitter.email,
      kind: isApproval
        ? MODERATION_EMAIL_KIND.EDIT_APPROVED
        : MODERATION_EMAIL_KIND.EDIT_REJECTED,
      eventId: revision.id,
      listing: {
        itemType,
        name: item.name,
        slug: item.slug,
        launchYear: item.launchYear,
        launchWeek: item.launchWeek,
      },
      reviewNote,
    })
  })

  return NextResponse.json({ success: true, data: { id, status: revision.status } })
})
