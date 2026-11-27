import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminRevisionDetail } from "@/db/queries/admin/revisions"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { RevisionDiff } from "@/components/admin/revision-diff"
import { RevisionReviewActions } from "@/components/admin/revision-review-actions"
import { SubmissionStatusBadge } from "@/components/admin/submission-status-badge"
import { ItemTypeBadge } from "@/components/shared/item-type-badge"
import { ROUTES } from "@/constants/routes"
import { SUBMISSION_STATUS } from "@/constants/moderation"
import { getListingPath } from "@/utils/urls"
import { formatAdminDateTime } from "@/utils/admin/format"
import { adminActionBar, adminNotice, adminSection } from "@/utils/admin/styles"
import { inlineTextLink } from "@/utils/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Review edit" }

export default async function AdminEditDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const detail = await getAdminRevisionDetail(id)
  if (!detail) notFound()
  const { revision, submitter, live, liveItem, isStale } = detail
  const isPending = revision.status === SUBMISSION_STATUS.PENDING

  return (
    <>
      <AdminPageHeader
        title={`Edit to ${liveItem.name}`}
        description={`Requested ${formatAdminDateTime(revision.updatedAt)} by ${submitter.email}`}
      >
        <div className="flex items-center gap-2">
          <ItemTypeBadge kind={revision.itemType} />
          <SubmissionStatusBadge status={revision.status} />
        </div>
      </AdminPageHeader>

      {isPending && isStale && (
        <p className={adminNotice}>
          The live listing changed after this edit was made. Check the Live column carefully
          before approving.
        </p>
      )}
      {revision.status === SUBMISSION_STATUS.REJECTED && revision.reviewNote && (
        <p className={adminNotice}>Rejection reason: {revision.reviewNote}</p>
      )}

      <div className={adminActionBar}>
        {isPending && <RevisionReviewActions id={revision.id} />}
        <Link
          href={getListingPath({ itemKind: revision.itemType, slug: liveItem.slug })}
          target="_blank"
          className={inlineTextLink}
        >
          Live page ↗
        </Link>
        <Link
          href={ROUTES.ADMIN_SUBMISSION(revision.itemType, liveItem.id)}
          className={inlineTextLink}
        >
          Full listing →
        </Link>
        <Link href={ROUTES.ADMIN_EDITS} className={inlineTextLink}>
          ← Back to edits
        </Link>
      </div>

      <section className={adminSection}>
        <RevisionDiff payload={revision.payload} live={live} />
      </section>
    </>
  )
}
