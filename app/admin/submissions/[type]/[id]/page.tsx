import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminSubmissionDetail } from "@/db/queries/admin/submissions"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminFieldList } from "@/components/admin/admin-field-list"
import { SubmissionStatusBadge } from "@/components/admin/submission-status-badge"
import { SubmissionReviewActions } from "@/components/admin/submission-review-actions"
import { StatusBadge } from "@/components/admin/status-badge"
import { ItemTypeBadge } from "@/components/shared/item-type-badge"
import { listingItemTypeSchema } from "@/lib/validation/admin"
import { ROUTES } from "@/constants/routes"
import { PLANS, isPaidTier } from "@/constants/plans"
import { SUBMISSION_STATUS } from "@/constants/moderation"
import { getListingPath } from "@/utils/urls"
import { formatAdminDateTime, formatCents } from "@/utils/admin/format"
import {
  adminActionBar,
  adminBlogBadge,
  adminNotice,
  adminSection,
  adminSectionHeader,
  paymentStatusBadge,
} from "@/utils/admin/styles"
import { inlineTextLink, monoLabel } from "@/utils/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Review submission" }

const LINK_FIELDS = [
  "websiteUrl",
  "githubUrl",
  "twitterUrl",
  "linkedinUrl",
  "discordUrl",
  "appStoreUrl",
  "playStoreUrl",
  "chromeExtensionUrl",
  "demoVideoUrl",
] as const

const CONTENT_FIELDS = [
  "tagline",
  "description",
  "problemStatement",
  "solution",
  "uniqueValue",
  "useCases",
  "targetAudience",
  "keywords",
  "metaTitle",
  "metaDescription",
  "aiContext",
  "geoTarget",
  "asoCategory",
] as const

export default async function AdminSubmissionDetailPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>
}) {
  await requireAdmin()
  const { type, id } = await params
  const itemType = listingItemTypeSchema.safeParse(type)
  if (!itemType.success) notFound()

  const detail = await getAdminSubmissionDetail(itemType.data, id)
  if (!detail) notFound()
  const { item, submitter, blog, launch, payments } = detail
  const listing = item as typeof item & Record<string, unknown>
  const publicPath = getListingPath({ itemKind: itemType.data, slug: item.slug })

  return (
    <>
      <AdminPageHeader
        title={item.name}
        description={`Submitted ${formatAdminDateTime(item.createdAt)} by ${submitter?.email ?? "unknown"}`}
      >
        <div className="flex items-center gap-2">
          <ItemTypeBadge kind={itemType.data} />
          <SubmissionStatusBadge status={item.status} />
        </div>
      </AdminPageHeader>

      {item.isDeleted && <p className={adminNotice}>The maker deleted this listing.</p>}
      {item.status === SUBMISSION_STATUS.REJECTED && item.reviewNote && (
        <p className={adminNotice}>Rejection reason: {item.reviewNote}</p>
      )}

      <div className={adminActionBar}>
        <SubmissionReviewActions
          itemType={itemType.data}
          id={item.id}
          status={item.status}
          canRegenerateBlog={item.status === SUBMISSION_STATUS.APPROVED && isPaidTier(item.tier)}
        />
        <Link href={publicPath} target="_blank" className={inlineTextLink}>
          Public page ↗
        </Link>
        <Link href={ROUTES.ADMIN_SUBMISSIONS} className={inlineTextLink}>
          ← Back to queue
        </Link>
      </div>

      <AdminFieldList
        title="Listing"
        rows={[
          { label: "Plan", value: PLANS[item.tier]?.name ?? item.tier },
          { label: "Pricing", value: item.pricing },
          { label: "Tags", value: item.tags?.join(", ") },
          { label: "Platforms", value: item.platforms?.join(", ") },
          ...CONTENT_FIELDS.map((field) => ({ field, value: listing[field] })),
          {
            label: "Last review",
            value: item.reviewedAt ? formatAdminDateTime(item.reviewedAt) : null,
          },
        ]}
      />

      <AdminFieldList
        title="Links & media"
        rows={[
          ...LINK_FIELDS.map((field) => ({ field, value: listing[field], isLink: true })),
          { label: "Logo", value: item.logoUrl, isLink: true },
          ...item.images.map((url, index) => ({
            label: `Screenshot ${index + 1}`,
            value: url,
            isLink: true,
          })),
        ]}
      />

      <AdminFieldList
        title="Launch"
        rows={[
          {
            label: "Week",
            value: launch ? `${launch.isoYear} · W${launch.isoWeek}` : null,
          },
          { label: "Launch state", value: launch?.launchStatus },
          { label: "Starts", value: launch ? formatAdminDateTime(launch.startDate) : null },
        ]}
      />

      <section className={adminSection}>
        <div className={adminSectionHeader}>
          <h2 className={monoLabel}>Payments</h2>
        </div>
        <AdminFieldList
          embedded
          rows={
            payments.length
              ? payments.map((payment) => ({
                  label: formatAdminDateTime(payment.createdAt),
                  value: (
                    <span className="flex flex-wrap items-center gap-2">
                      {formatCents(payment.amount, payment.currency)}
                      <StatusBadge
                        label={payment.status}
                        className={paymentStatusBadge[payment.status]}
                      />
                      <span className="font-mono text-xs text-slate-500">
                        {payment.dodoPaymentId ?? payment.id}
                      </span>
                    </span>
                  ),
                }))
              : [{ label: "None", value: "No payments linked to this listing." }]
          }
        />
      </section>

      {blog && (
        <AdminFieldList
          title="Launch blog"
          rows={[
            { label: "Title", value: blog.title },
            {
              label: "Generation",
              value: (
                <StatusBadge
                  label={blog.generationStatus}
                  className={adminBlogBadge[blog.generationStatus]}
                />
              ),
            },
            { label: "Error", value: blog.generationError },
            {
              label: "Preview",
              value: (
                <Link href={ROUTES.BLOG_PREVIEW(blog.slug)} target="_blank" className={inlineTextLink}>
                  Open preview ↗
                </Link>
              ),
            },
          ]}
        />
      )}
    </>
  )
}
