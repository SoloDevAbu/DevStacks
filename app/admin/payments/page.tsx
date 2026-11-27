import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminPayments } from "@/db/queries/admin/payments"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminFilterLinks } from "@/components/admin/admin-filter-links"
import { StatusBadge } from "@/components/admin/status-badge"
import { CrawlablePagination } from "@/components/shared/crawlable-pagination"
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
import { ADMIN_PAYMENT_STATUS_OPTIONS, ADMIN_PAYMENT_TYPE_OPTIONS } from "@/constants/admin"
import { ADMIN_FILTER_ANY, ADMIN_PAGE_SIZE } from "@/constants/moderation"
import {
  readOptionalEnumParam,
  readPage,
  totalPages,
  type AdminSearchParams,
} from "@/utils/admin/search-params"
import { formatAdminDateTime, formatCents } from "@/utils/admin/format"
import {
  adminCellMeta,
  adminEmptyState,
  adminFilterBar,
  adminPagination,
  paymentStatusBadge,
} from "@/utils/admin/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Payments" }

const valuesOf = <T extends string>(options: readonly { value: T | typeof ADMIN_FILTER_ANY }[]) =>
  options.map((option) => option.value).filter((value): value is T => value !== ADMIN_FILTER_ANY)

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>
}) {
  await requireAdmin()
  const params = await searchParams
  const status = readOptionalEnumParam(params, "status", valuesOf(ADMIN_PAYMENT_STATUS_OPTIONS))
  const paymentType = readOptionalEnumParam(params, "type", valuesOf(ADMIN_PAYMENT_TYPE_OPTIONS))
  const page = readPage(params)
  const { rows, total } = await getAdminPayments({ status, paymentType, page })
  const linkParams = { status, type: paymentType }

  return (
    <>
      <AdminPageHeader
        title="Payments"
        description="Read-only ledger from Dodo Payments. Refunds are issued in the Dodo dashboard."
      />
      <div className={adminFilterBar}>
        <AdminFilterLinks
          label="Status"
          basePath={ROUTES.ADMIN_PAYMENTS}
          paramKey="status"
          options={ADMIN_PAYMENT_STATUS_OPTIONS}
          current={status ?? ADMIN_FILTER_ANY}
          params={linkParams}
        />
        <AdminFilterLinks
          label="Type"
          basePath={ROUTES.ADMIN_PAYMENTS}
          paramKey="type"
          options={ADMIN_PAYMENT_TYPE_OPTIONS}
          current={paymentType ?? ADMIN_FILTER_ANY}
          params={linkParams}
        />
      </div>

      {rows.length === 0 ? (
        <p className={adminEmptyState}>No payments in this view.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>For</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dodo ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className={adminCellMeta}>{formatAdminDateTime(row.createdAt)}</TableCell>
                <TableCell>{row.userEmail}</TableCell>
                <TableCell>
                  {row.paymentType === "ad"
                    ? "Ad placement"
                    : `${row.tier ? (PLANS[row.tier]?.name ?? row.tier) : "Listing"} upgrade`}
                  {row.listingName && <span className={adminCellMeta}> · {row.listingName}</span>}
                </TableCell>
                <TableCell className="tabular-nums">{formatCents(row.amount, row.currency)}</TableCell>
                <TableCell>
                  <StatusBadge label={row.status} className={paymentStatusBadge[row.status]} />
                </TableCell>
                <TableCell className="font-mono text-[11px] text-slate-500">
                  {row.dodoPaymentId ?? "—"}
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
          basePath={ROUTES.ADMIN_PAYMENTS}
          params={linkParams}
        />
      </div>
    </>
  )
}
