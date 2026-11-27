import type { Metadata } from "next"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminRevisions } from "@/db/queries/admin/revisions"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminFilterLinks } from "@/components/admin/admin-filter-links"
import { SubmissionStatusBadge } from "@/components/admin/submission-status-badge"
import { CrawlablePagination } from "@/components/shared/crawlable-pagination"
import { ItemTypeBadge } from "@/components/shared/item-type-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ROUTES } from "@/constants/routes"
import {
  ADMIN_PAGE_SIZE,
  SUBMISSION_STATUS,
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_LABEL,
  type SubmissionStatus,
} from "@/constants/moderation"
import {
  readEnumParam,
  readPage,
  totalPages,
  type AdminSearchParams,
} from "@/utils/admin/search-params"
import { formatAdminDateTime, humanizeFieldName } from "@/utils/admin/format"
import {
  adminCellMeta,
  adminCellTitle,
  adminEmptyState,
  adminFilterBar,
  adminPagination,
} from "@/utils/admin/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Edit requests" }

const STATUS_OPTIONS = SUBMISSION_STATUSES.map((value) => ({
  value,
  label: SUBMISSION_STATUS_LABEL[value],
}))

export default async function AdminEditsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>
}) {
  await requireAdmin()
  const params = await searchParams
  const status = readEnumParam<SubmissionStatus>(
    params,
    "status",
    SUBMISSION_STATUSES,
    SUBMISSION_STATUS.PENDING
  )
  const page = readPage(params)
  const { rows, total } = await getAdminRevisions({ status, page })
  const isPending = status === SUBMISSION_STATUS.PENDING

  return (
    <>
      <AdminPageHeader
        title="Edit requests"
        description="Changes makers made to approved listings. The live version stays up until an edit is approved."
      />
      <div className={adminFilterBar}>
        <AdminFilterLinks
          label="Status"
          basePath={ROUTES.ADMIN_EDITS}
          paramKey="status"
          options={STATUS_OPTIONS}
          current={status}
          params={{ status }}
        />
      </div>

      {rows.length === 0 ? (
        <p className={adminEmptyState}>No edit requests in this view.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Changed fields</TableHead>
              <TableHead>Maker</TableHead>
              <TableHead>{isPending ? "Requested" : "Reviewed"}</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link href={ROUTES.ADMIN_EDIT(row.id)} className={adminCellTitle}>
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <ItemTypeBadge kind={row.itemType} />
                </TableCell>
                <TableCell className="max-w-sm truncate">
                  {row.changedFields.map(humanizeFieldName).join(", ")}
                </TableCell>
                <TableCell className={adminCellMeta}>{row.submitterEmail}</TableCell>
                <TableCell className={adminCellMeta}>
                  {formatAdminDateTime(isPending ? row.updatedAt : row.reviewedAt)}
                  {!isPending && row.reviewerEmail && ` · ${row.reviewerEmail}`}
                </TableCell>
                <TableCell>
                  <SubmissionStatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className={adminPagination}>
        <CrawlablePagination
          currentPage={page}
          totalPages={totalPages(total, ADMIN_PAGE_SIZE)}
          basePath={ROUTES.ADMIN_EDITS}
          params={{ status }}
        />
      </div>
    </>
  )
}
