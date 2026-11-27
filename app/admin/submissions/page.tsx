import type { Metadata } from "next"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth/admin"
import {
  ADMIN_ITEM_TYPE_FILTER_ALL,
  getAdminSubmissions,
  type AdminItemTypeFilter,
} from "@/db/queries/admin/submissions"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminFilterLinks } from "@/components/admin/admin-filter-links"
import { AdminSearchForm } from "@/components/admin/admin-search-form"
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
import { PLANS } from "@/constants/plans"
import {
  ADMIN_PAGE_SIZE,
  SUBMISSION_STATUS,
  SUBMISSION_STATUSES,
  SUBMISSION_STATUS_FILTER_ALL,
  SUBMISSION_STATUS_LABEL,
  type SubmissionStatusFilter,
} from "@/constants/moderation"
import {
  readEnumParam,
  readPage,
  readParam,
  totalPages,
  type AdminSearchParams,
} from "@/utils/admin/search-params"
import { formatAdminDateTime } from "@/utils/admin/format"
import { cn } from "@/lib/utils"
import {
  adminCellMeta,
  adminCellTitle,
  adminEmptyState,
  adminFilterBar,
  adminPagination,
} from "@/utils/admin/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Submissions" }

const STATUS_OPTIONS: { value: SubmissionStatusFilter; label: string }[] = [
  ...SUBMISSION_STATUSES.map((value) => ({ value, label: SUBMISSION_STATUS_LABEL[value] })),
  { value: SUBMISSION_STATUS_FILTER_ALL, label: "All" },
]

const TYPE_OPTIONS = [
  { value: ADMIN_ITEM_TYPE_FILTER_ALL, label: "All types" },
  { value: "product", label: "Products" },
  { value: "tool", label: "Tools" },
] as const

export default async function AdminSubmissionsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>
}) {
  await requireAdmin()
  const params = await searchParams
  const status = readEnumParam<SubmissionStatusFilter>(
    params,
    "status",
    STATUS_OPTIONS.map((option) => option.value),
    SUBMISSION_STATUS.PENDING
  )
  const itemType = readEnumParam<AdminItemTypeFilter>(
    params,
    "type",
    TYPE_OPTIONS.map((option) => option.value),
    ADMIN_ITEM_TYPE_FILTER_ALL
  )
  const search = readParam(params, "q")
  const page = readPage(params)

  const { rows, total } = await getAdminSubmissions({ status, itemType, search, page })
  const linkParams = { status, type: itemType, q: search }

  return (
    <>
      <AdminPageHeader
        title="Submissions"
        description={`${total} ${total === 1 ? "listing" : "listings"} in this view.`}
      >
        <AdminSearchForm
          action={ROUTES.ADMIN_SUBMISSIONS}
          defaultValue={search}
          hidden={{ status, type: itemType }}
        />
      </AdminPageHeader>
      <div className={adminFilterBar}>
        <AdminFilterLinks
          label="Status"
          basePath={ROUTES.ADMIN_SUBMISSIONS}
          paramKey="status"
          options={STATUS_OPTIONS}
          current={status}
          params={linkParams}
        />
        <AdminFilterLinks
          label="Type"
          basePath={ROUTES.ADMIN_SUBMISSIONS}
          paramKey="type"
          options={TYPE_OPTIONS}
          current={itemType}
          params={linkParams}
        />
      </div>

      {rows.length === 0 ? (
        <p className={adminEmptyState}>Nothing here. The queue is clear.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Launch week</TableHead>
              <TableHead>Maker</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.itemType}-${row.id}`}>
                <TableCell className="max-w-xs">
                  <Link
                    href={ROUTES.ADMIN_SUBMISSION(row.itemType, row.id)}
                    className="flex flex-col gap-0.5"
                  >
                    <span className={adminCellTitle}>{row.name}</span>
                    <span className={cn(adminCellMeta, "truncate")}>{row.tagline}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <ItemTypeBadge kind={row.itemType} />
                </TableCell>
                <TableCell>{PLANS[row.tier]?.name ?? row.tier}</TableCell>
                <TableCell className={adminCellMeta}>
                  {row.launchWeek ? `${row.launchYear} · W${row.launchWeek}` : "—"}
                </TableCell>
                <TableCell className={adminCellMeta}>{row.submitterEmail ?? "—"}</TableCell>
                <TableCell className={adminCellMeta}>
                  {formatAdminDateTime(row.createdAt)}
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
          basePath={ROUTES.ADMIN_SUBMISSIONS}
          params={linkParams}
        />
      </div>
    </>
  )
}
