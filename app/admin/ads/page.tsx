import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminAds } from "@/db/queries/admin/ads"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { AdminFilterLinks } from "@/components/admin/admin-filter-links"
import { AdStatusActions } from "@/components/admin/ad-status-actions"
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
import { ADMIN_AD_STATUS_OPTIONS } from "@/constants/admin"
import { AD_PRICING, AD_STATUS_LABEL, type AdStatus } from "@/constants/ads"
import { ADMIN_FILTER_ANY, ADMIN_PAGE_SIZE } from "@/constants/moderation"
import {
  readOptionalEnumParam,
  readPage,
  totalPages,
  type AdminSearchParams,
} from "@/utils/admin/search-params"
import { formatCents } from "@/utils/admin/format"
import { cn } from "@/lib/utils"
import {
  adAdminStatusBadge,
  adminCellMeta,
  adminCellTitle,
  adminEmptyState,
  adminFilterBar,
  adminPagination,
} from "@/utils/admin/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Ads" }

const AD_STATUS_VALUES = ADMIN_AD_STATUS_OPTIONS.map((option) => option.value).filter(
  (value): value is AdStatus => value !== ADMIN_FILTER_ANY
)

export default async function AdminAdsPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>
}) {
  await requireAdmin()
  const params = await searchParams
  const status = readOptionalEnumParam(params, "status", AD_STATUS_VALUES)
  const page = readPage(params)
  const { rows, total } = await getAdminAds({ status, page })

  return (
    <>
      <AdminPageHeader
        title="Ads"
        description="Pausing or rejecting an ad takes it out of rotation for every week that hasn't ended. It doesn't refund the advertiser."
      />
      <div className={adminFilterBar}>
        <AdminFilterLinks
          label="Status"
          basePath={ROUTES.ADMIN_ADS}
          paramKey="status"
          options={ADMIN_AD_STATUS_OPTIONS}
          current={status ?? ADMIN_FILTER_ANY}
          params={{ status }}
        />
      </div>

      {rows.length === 0 ? (
        <p className={adminEmptyState}>No ads in this view.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Weeks</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Clicks / views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <span className={adminCellTitle}>{row.listingName ?? "Deleted listing"}</span>
                  <span className={cn("block", adminCellMeta)}>{row.ownerEmail}</span>
                </TableCell>
                <TableCell>{AD_PRICING[row.placement]?.label ?? row.placement}</TableCell>
                <TableCell className={adminCellMeta}>
                  {row.weeks.map((week) => `W${week.isoWeek}`).join(", ") || "—"}
                </TableCell>
                <TableCell className="tabular-nums">{formatCents(row.totalAmount)}</TableCell>
                <TableCell className="tabular-nums">
                  {row.clicksCount} / {row.impressionsCount}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    label={AD_STATUS_LABEL[row.status]}
                    className={adAdminStatusBadge[row.status]}
                  />
                </TableCell>
                <TableCell>
                  <AdStatusActions id={row.id} status={row.status} />
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
          basePath={ROUTES.ADMIN_ADS}
          params={{ status }}
        />
      </div>
    </>
  )
}
