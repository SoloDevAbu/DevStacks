import type { Metadata } from "next"
import Link from "next/link"
import { requireAdmin } from "@/lib/auth/admin"
import { getAdminLaunchWeek } from "@/db/queries/admin/launches"
import { countFreeLaunchesBooked } from "@/db/queries/launches/availability"
import { AdminPageHeader } from "@/components/admin/admin-page-header"
import { SubmissionStatusBadge } from "@/components/admin/submission-status-badge"
import { ItemTypeBadge } from "@/components/shared/item-type-badge"
import { Button } from "@/components/ui/button"
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
import { MAX_FREE_LAUNCHES_PER_WEEK } from "@/constants/launches"
import { formatWeekLabel, getISOWeek, getISOWeekRange } from "@/utils/iso-weeks"
import { buildPageHref } from "@/utils/pagination"
import { readParam, type AdminSearchParams } from "@/utils/admin/search-params"
import {
  adminCellMeta,
  adminCellTitle,
  adminEmptyState,
  adminFilterBar,
  adminFilterGroup,
} from "@/utils/admin/styles"
import { monoLabel } from "@/utils/styles"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Launches" }

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

const parseWeek = (params: AdminSearchParams) => {
  const year = Number(readParam(params, "year"))
  const week = Number(readParam(params, "week"))
  if (Number.isInteger(year) && Number.isInteger(week) && week >= 1 && week <= 53) {
    return { isoYear: year, isoWeek: week }
  }
  return getISOWeek(new Date())
}

const shiftWeek = (isoYear: number, isoWeek: number, by: number) =>
  getISOWeek(new Date(getISOWeekRange(isoYear, isoWeek).startDate.getTime() + by * WEEK_MS))

const weekHref = ({ isoYear, isoWeek }: { isoYear: number; isoWeek: number }) =>
  buildPageHref(ROUTES.ADMIN_LAUNCHES, 1, { year: String(isoYear), week: String(isoWeek) })

export default async function AdminLaunchesPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>
}) {
  await requireAdmin()
  const { isoYear, isoWeek } = parseWeek(await searchParams)
  const [rows, freeSlotsUsed] = await Promise.all([
    getAdminLaunchWeek(isoYear, isoWeek),
    countFreeLaunchesBooked(isoYear, isoWeek),
  ])

  return (
    <>
      <AdminPageHeader
        title="Launches"
        description={`${formatWeekLabel(isoYear, isoWeek)}, ${isoYear} · ${freeSlotsUsed}/${MAX_FREE_LAUNCHES_PER_WEEK} free slots used`}
      />
      <div className={adminFilterBar}>
        <div className={adminFilterGroup}>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={weekHref(shiftWeek(isoYear, isoWeek, -1))} />}
          >
            ← Previous week
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={ROUTES.ADMIN_LAUNCHES} />}
          >
            This week
          </Button>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={<Link href={weekHref(shiftWeek(isoYear, isoWeek, 1))} />}
          >
            Next week →
          </Button>
        </div>
        <span className={monoLabel}>{rows.length} launches</span>
      </div>

      {rows.length === 0 ? (
        <p className={adminEmptyState}>No launches booked for this week.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Listing</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Launch state</TableHead>
              <TableHead>Maker</TableHead>
              <TableHead>Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Link
                    href={ROUTES.ADMIN_SUBMISSION(row.itemType, row.itemId)}
                    className={adminCellTitle}
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <ItemTypeBadge kind={row.itemType} />
                </TableCell>
                <TableCell>{PLANS[row.tier]?.name ?? row.tier}</TableCell>
                <TableCell className="font-mono">{row.launchStatus}</TableCell>
                <TableCell className={adminCellMeta}>{row.submitterEmail}</TableCell>
                <TableCell>
                  <SubmissionStatusBadge status={row.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  )
}
