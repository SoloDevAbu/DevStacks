import { NextResponse, after } from "next/server"
import { withAdmin } from "@/lib/auth/with-admin"
import { updateSubmissionStatusAndTriggerBlog } from "@/db/queries/admin/submissions"
import { recordAdminAction } from "@/db/queries/admin/audit"
import { getUserContact } from "@/db/queries/users/get-profile"
import { revalidateCatalog } from "@/lib/cache/revalidate"
import { isBlogLive, isPubliclyVisible } from "@/lib/catalog/visibility"
import { submitToIndexNow } from "@/lib/seo/indexnow"
import { sendModerationEmail } from "@/lib/email/moderation"
import { listingItemTypeSchema, submissionReviewSchema } from "@/lib/validation/admin"
import { getListingPath } from "@/utils/urls"
import { ROUTES } from "@/constants/routes"
import { ADMIN_AUDIT_ACTION } from "@/constants/admin"
import { MODERATION_EMAIL_KIND } from "@/constants/email"
import { SUBMISSION_STATUS } from "@/constants/moderation"

const AUDIT_ACTION_BY_STATUS = {
  [SUBMISSION_STATUS.APPROVED]: ADMIN_AUDIT_ACTION.SUBMISSION_APPROVED,
  [SUBMISSION_STATUS.REJECTED]: ADMIN_AUDIT_ACTION.SUBMISSION_REJECTED,
  [SUBMISSION_STATUS.PENDING]: ADMIN_AUDIT_ACTION.SUBMISSION_RESET,
} as const

const EMAIL_KIND_BY_STATUS = {
  [SUBMISSION_STATUS.APPROVED]: MODERATION_EMAIL_KIND.SUBMISSION_APPROVED,
  [SUBMISSION_STATUS.REJECTED]: MODERATION_EMAIL_KIND.SUBMISSION_REJECTED,
} as const

export const PATCH = withAdmin<{ type: string; id: string }>(
  async (req, { params, admin }) => {
    const { type, id } = await params
    const itemType = listingItemTypeSchema.safeParse(type)
    if (!itemType.success) {
      return NextResponse.json({ error: "Invalid item type." }, { status: 400 })
    }

    const parsed = submissionReviewSchema.safeParse(await req.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
        { status: 400 }
      )
    }
    const { status, reviewNote } = parsed.data

    const result = await updateSubmissionStatusAndTriggerBlog({
      itemType: itemType.data,
      id,
      status,
      reviewNote,
      reviewerId: admin.id,
    })
    const { item } = result

    await recordAdminAction({
      adminId: admin.id,
      action: AUDIT_ACTION_BY_STATUS[status],
      targetType: itemType.data,
      targetId: id,
      metadata: { name: item.name, slug: item.slug, reviewNote: reviewNote ?? null },
    })

    const maker = item.submitterId ? await getUserContact(item.submitterId) : null
    revalidateCatalog({
      [itemType.data === "tool" ? "toolSlug" : "productSlug"]: item.slug,
      blogSlug: result.blogResult?.blog?.slug,
      makerUsername: maker?.username ?? undefined,
    })

    after(async () => {
      if (isPubliclyVisible(item)) {
        const blog = result.blogResult?.blog
        await submitToIndexNow([
          getListingPath({ itemKind: itemType.data, slug: item.slug }),
          ...(blog && isBlogLive(blog) ? [ROUTES.BLOG_POST(blog.slug)] : []),
        ])
      }
      if (maker?.email && status !== SUBMISSION_STATUS.PENDING) {
        await sendModerationEmail({
          to: maker.email,
          kind: EMAIL_KIND_BY_STATUS[status],
          eventId: `${item.id}/${item.reviewedAt?.getTime() ?? Date.now()}`,
          listing: {
            itemType: itemType.data,
            name: item.name,
            slug: item.slug,
            launchYear: item.launchYear,
            launchWeek: item.launchWeek,
          },
          reviewNote,
        })
      }
    })

    return NextResponse.json({
      success: true,
      data: { id: item.id, status: item.status },
      blogError: result.blogResult?.error,
    })
  }
)
